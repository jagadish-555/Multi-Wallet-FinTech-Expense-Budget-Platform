import prisma from '../config/database';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    currency: string;
  }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Partial<{
    name: string;
    currency: string;
    timezone: string;
  }>) {
    return prisma.user.update({ where: { id }, data });
  }
}

export const userRepository = new UserRepository();
