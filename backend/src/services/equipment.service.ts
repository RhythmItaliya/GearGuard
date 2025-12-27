import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EquipmentService {
  async getAll(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.equipment.findMany({
      where,
      include: {
        category: true,
        company: true,
        workCenter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.equipment.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.equipment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.equipment.delete({
      where: { id },
    });
  }
}

export const equipmentService = new EquipmentService();
