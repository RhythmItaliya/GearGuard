import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResourceService {
  async getCategories(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.equipmentCategory.findMany({ where });
  }

  async getCompanies() {
    return prisma.company.findMany();
  }

  async getTeams(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.maintenanceTeam.findMany({ where });
  }

  async getUsers(_companyId?: string) {
    return prisma.user.findMany({
      select: { id: true, email: true, fullName: true },
    });
  }

  async getWorkCenters(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.workCenter.findMany({ where });
  }
}

export const resourceService = new ResourceService();
