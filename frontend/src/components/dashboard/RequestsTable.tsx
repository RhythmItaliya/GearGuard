'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import type { MaintenanceRequestWithRelations } from '@/types';

const stageColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const stageLabels: Record<string, string> = {
  pending: 'New Request',
  in_progress: 'In Progress',
  completed: 'Repaired',
  cancelled: 'Cancelled',
};

interface RequestsTableProps {
  requests?: MaintenanceRequestWithRelations[];
}

export default function RequestsTable({ requests = [] }: RequestsTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="font-semibold">Equipment</TableHead>
            <TableHead className="font-semibold">Team</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Stage</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No maintenance requests found. Create your first request!
              </TableCell>
            </TableRow>
          ) : (
            requests.map(request => (
              <TableRow
                key={request.id}
                className="hover:bg-muted/30 cursor-pointer"
                onClick={() => router.push('/dashboard/maintenance')}
              >
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>{request.equipment?.name || '-'}</TableCell>
                <TableCell>{request.team?.name || '-'}</TableCell>
                <TableCell className="capitalize">
                  {request.equipment?.category?.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={stageColors[request.status] || ''}
                  >
                    {stageLabels[request.status] || request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.equipment?.company?.name || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
