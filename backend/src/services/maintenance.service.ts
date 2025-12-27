import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaintenanceService {
  async getAll(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.maintenanceRequest.findMany({
      where,
      include: {
        equipment: true,
        category: true,
        company: true,
        team: true,
        assignedTo: {
          select: { id: true, fullName: true, email: true },
        },
        workCenter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.maintenanceRequest.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.maintenanceRequest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.maintenanceRequest.delete({
      where: { id },
    });
  }
}

export const maintenanceService = new MaintenanceService();
