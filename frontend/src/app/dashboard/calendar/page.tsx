'use client';

import { useState, useEffect } from 'react';
import { useMaintenance } from '@/hooks/use-maintenance';
import { useResources } from '@/hooks/use-resources';
import { useEquipment } from '@/hooks/use-equipment';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormDialog, Field, SelectField } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

const stageColor: Record<string, string> = {
  pending: 'bg-blue-500',
  in_progress: 'bg-amber-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export default function CalendarPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { requests, isLoading, createRequest, isCreating } = useMaintenance();

  const { categories, companies, teams, users, workCenters } = useResources();

  const { equipment } = useEquipment();

  const [form, setForm] = useState({
    subject: '',
    maintenanceFor: 'equipment',
    equipmentId: '',
    workCenterId: '',
    categoryId: '',
    companyId: '',
    technicianUserId: '',
    maintenanceTeamId: '',
    maintenanceType: 'preventive',
    scheduledDate: '',
    priority: 'medium',
    notes: '',
  });

  useEffect(() => {
    if (selectedDate) {
      setForm(prev => ({
        ...prev,
        scheduledDate: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      }));
    }
  }, [selectedDate]);

  const fetchRequests = async () => {
    // useMaintenance already fetches all requests
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getRequestsForDay = (day: Date) => {
    return requests.filter(r => {
      if (!r.scheduledDate) return false;
      const requestDate = parseISO(r.scheduledDate);
      return isSameDay(requestDate, day) && r.type === 'preventive';
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.subject,
        description: form.notes,
        equipmentId:
          form.maintenanceFor === 'equipment' ? form.equipmentId || null : null,
        workCenterId:
          form.maintenanceFor === 'work_center'
            ? form.workCenterId || null
            : null,
        categoryId: form.categoryId || null,
        companyId: form.companyId || null,
        requestedById: (session?.user as any)?.id,
        teamId: form.maintenanceTeamId || null,
        type: 'preventive',
        scheduledDate: form.scheduledDate
          ? new Date(form.scheduledDate).toISOString()
          : null,
        priority: form.priority,
        status: 'pending',
      };

      await createRequest(payload);
      toast({ title: 'Preventive maintenance scheduled' });
      setIsFormOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to schedule maintenance',
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Maintenance Calendar</h2>
        <Button
          onClick={() => {
            setSelectedDate(new Date());
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Preventive Request
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground bg-muted/30"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {paddingDays.map((_, i) => (
            <div
              key={`pad-${i}`}
              className="min-h-[100px] p-2 bg-muted/10 border-b border-r"
            />
          ))}

          {days.map(day => {
            const dayRequests = getRequestsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day);
                  setIsFormOpen(true);
                }}
                className={`min-h-[100px] p-2 border-b border-r cursor-pointer transition-colors hover:bg-muted/50 ${isToday ? 'bg-primary/5' : ''
                  }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'
                    }`}
                >
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayRequests.slice(0, 3).map(req => (
                    <div
                      key={req.id}
                      className="text-[10px] p-1 rounded bg-primary/10 text-primary truncate flex items-center gap-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${stageColor[req.status] || 'bg-gray-400'
                          }`}
                      />
                      <span className="truncate">{req.title}</span>
                    </div>
                  ))}
                  {dayRequests.length > 3 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{dayRequests.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4" />
          Showing only Preventive maintenance requests
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          Click any date to schedule new maintenance
        </span>
      </div>

      <FormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Schedule Preventive Maintenance"
        icon={CalendarIcon}
        onSubmit={handleSubmit}
        loading={isCreating}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="Subject">
              <Input
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                required
              />
            </Field>
          </div>
          <Field label="Maintenance For">
            <Select
              value={form.maintenanceFor}
              onValueChange={v => setForm({ ...form, maintenanceFor: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="work_center">Work Center</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {form.maintenanceFor === 'equipment' ? (
            <SelectField
              label="Equipment"
              options={equipment}
              value={form.equipmentId}
              onValueChange={v => setForm({ ...form, equipmentId: v })}
              addHref="/dashboard/equipment"
            />
          ) : (
            <SelectField
              label="Work Center"
              options={workCenters}
              value={form.workCenterId}
              onValueChange={v => setForm({ ...form, workCenterId: v })}
              addHref="/dashboard/work-centers"
            />
          )}
          <SelectField
            label="Category"
            options={categories}
            value={form.categoryId}
            onValueChange={v => setForm({ ...form, categoryId: v })}
            addHref="/dashboard/categories"
          />
          <SelectField
            label="Company"
            options={companies}
            value={form.companyId}
            onValueChange={v => setForm({ ...form, companyId: v })}
            addHref="/dashboard/companies"
          />
          <Field label="Scheduled Date">
            <Input
              type="datetime-local"
              value={form.scheduledDate}
              onChange={e =>
                setForm({ ...form, scheduledDate: e.target.value })
              }
              required
            />
          </Field>
          <SelectField
            label="Team"
            options={teams}
            value={form.maintenanceTeamId}
            onValueChange={v => setForm({ ...form, maintenanceTeamId: v })}
            addHref="/dashboard/teams"
          />
        </div>
        <Field label="Notes">
          <Textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </Field>
      </FormDialog>
    </div>
  );
}