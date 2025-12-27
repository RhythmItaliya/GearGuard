import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  // Get dashboard statistics
  async getStats(companyId?: string) {
    const where = companyId ? { companyId } : {};

    const [
      totalEquipment,
      criticalEquipment,
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      totalTeams,
      teamMembers,
      overdueRequests,
      allRequests,
    ] = await Promise.all([
      // Total equipment
      prisma.equipment.count({ where }),

      // Critical equipment (health < 30%)
      prisma.equipment.count({
        where: { ...where, healthPercentage: { lt: 30 } },
      }),

      // Total requests
      prisma.maintenanceRequest.count({ where }),

      // Pending requests
      prisma.maintenanceRequest.count({
        where: { ...where, status: 'pending' },
      }),

      // In progress requests
      prisma.maintenanceRequest.count({
        where: { ...where, status: 'in_progress' },
      }),

      // Completed requests
      prisma.maintenanceRequest.count({
        where: { ...where, status: 'completed' },
      }),

      // Total teams
      prisma.maintenanceTeam.count({ where }),

      // Team members count
      prisma.teamMember.count(),

      // Overdue requests
      prisma.maintenanceRequest.count({
        where: {
          ...where,
          status: { notIn: ['completed', 'cancelled'] },
          scheduledDate: { lt: new Date() },
        },
      }),

      // All requests for charts (last 6 months)
      prisma.maintenanceRequest.findMany({
        where: {
          ...where,
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
        select: {
          status: true,
          type: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate technician load
    const load =
      teamMembers > 0
        ? Math.min(100, Math.round((inProgressRequests / teamMembers) * 100))
        : 0;

    // Breakdown by status
    const statusBreakdown = allRequests.reduce((acc: any, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    // Breakdown by type
    const typeBreakdown = allRequests.reduce((acc: any, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});

    // Breakdown by month
    const monthBreakdown = allRequests.reduce((acc: any, r) => {
      const month = r.createdAt.toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEquipment,
      critical: criticalEquipment,
      totalRequests,
      pending: pendingRequests,
      completed: completedRequests,
      totalTeams,
      totalTechnicians: teamMembers,
      load,
      overdue: overdueRequests,
      statusBreakdown,
      typeBreakdown,
      monthBreakdown,
    };
  }

  // Get recent maintenance requests
  async getRecentRequests(limit: number = 10) {
    const requests = await prisma.maintenanceRequest.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        equipment: {
          select: {
            name: true,
            category: { select: { name: true } },
            company: { select: { name: true } },
          },
        },
        assignedTo: { select: { fullName: true } },
        team: { select: { name: true } },
      },
    });

    return requests;
  }
}

export const dashboardService = new DashboardService();
