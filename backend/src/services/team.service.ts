import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TeamService {
  async getAll(companyId?: string) {
    const where = companyId ? { companyId } : {};
    return prisma.maintenanceTeam.findMany({
      where,
      include: {
        company: true,
        members: {
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.maintenanceTeam.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.maintenanceTeam.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.maintenanceTeam.delete({
      where: { id },
    });
  }

  async addMember(teamId: string, userId: string, role: string = 'member') {
    return prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async removeMember(memberId: string) {
    return prisma.teamMember.delete({
      where: { id: memberId },
    });
  }
}

export const teamService = new TeamService();
