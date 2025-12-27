import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
  async getAll(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.equipmentCategory.findMany({
      where,
      include: {
        company: true,
        responsibleUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.equipmentCategory.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.equipmentCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.equipmentCategory.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();
