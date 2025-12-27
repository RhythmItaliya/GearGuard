import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CompanyService {
  async getAll() {
    return prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            equipment: true,
            teams: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: { name: string; description?: string | null }) {
    return prisma.company.create({
      data,
    });
  }

  async update(
    id: string,
    data: { name?: string; description?: string | null }
  ) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }
}

export const companyService = new CompanyService();
