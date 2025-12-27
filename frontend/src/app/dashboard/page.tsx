'use client';

import { useDashboardStats, useRecentRequests } from '@/hooks/use-dashboard';
import SummaryCard from '@/components/dashboard/SummaryCard';
import RequestsTable from '@/components/dashboard/RequestsTable';
import { AlertTriangle, Users, ClipboardList } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: requests, isLoading: requestsLoading } = useRecentRequests();

  if (statsLoading || requestsLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of maintenance activities
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard
          title="Critical Equipment"
          value={`${stats?.critical || 0} Units`}
          subtitle="Health < 30%"
          variant="critical"
          icon={<AlertTriangle className="h-5 w-5" />}
          tooltip="Equipment needing urgent attention"
        />
        <SummaryCard
          title="Technician Load"
          value={`${stats?.load || 0}%`}
          subtitle="Utilized"
          variant="info"
          icon={<Users className="h-5 w-5" />}
          tooltip="Team utilization based on active requests"
        />
        <SummaryCard
          title="Open Requests"
          value={`${stats?.pending || 0} Pending`}
          subtitle={`${stats?.overdue || 0} Overdue`}
          variant="success"
          icon={<ClipboardList className="h-5 w-5" />}
          tooltip="Active maintenance requests"
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Recent Requests</h3>
        <RequestsTable requests={requests} />
      </div>
    </div>
  );
}
