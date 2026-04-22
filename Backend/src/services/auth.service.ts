import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { SALT_ROUNDS, SYSTEM_CATEGORIES } from '../config/constants';
import { userRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { ApiError } from '../utils/ApiError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {

  private buildTokens(userId: string, email: string) {
    const payload = { userId, email };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }

  private safeUser(user: {
    id: string; name: string; email: string; currency: string; createdAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      createdAt: user.createdAt,
    };
  }

  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);

    if (existing) {
      throw ApiError.conflict('Email already in use');
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          currency: input.currency,
        },
      });

      await tx.category.createMany({
        data: SYSTEM_CATEGORIES.map((category) => ({
          userId: createdUser.id,
          name: category.name,
          icon: category.icon,
          colorHex: category.colorHex,
          isSystem: true,
        })),
      });

      return createdUser;
    });

    const tokens = this.buildTokens(user.id, user.email);

    return {
      user: this.safeUser(user),
      ...tokens,
    };
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user || !user.passwordHash) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash);

    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = this.buildTokens(user.id, user.email);

    return {
      user: this.safeUser(user),
      ...tokens,
    };
  }

  async refresh(token: string) {
    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    return {
      accessToken: signAccessToken({ userId: user.id, email: user.email }),
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        currency: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
