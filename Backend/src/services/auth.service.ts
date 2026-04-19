import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { SALT_ROUNDS, SYSTEM_CATEGORIES } from '../config/constants';
import { userRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { ApiError } from '../utils/ApiError';
import { signAccessToken } from '../utils/jwt';

export class AuthService {
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

    const payload = { userId: user.id, email: user.email };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      accessToken: signAccessToken(payload),
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

    const payload = { userId: user.id, email: user.email };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      accessToken: signAccessToken(payload),
    };
  }
}

export const authService = new AuthService();
