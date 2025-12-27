import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkCenterService {
  async getAll(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.workCenter.findMany({
      where,
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.workCenter.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.workCenter.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.workCenter.delete({
      where: { id },
    });
  }
}

export const workCenterService = new WorkCenterService();
