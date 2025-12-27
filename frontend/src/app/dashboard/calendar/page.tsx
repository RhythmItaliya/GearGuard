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
  Star,
  Trash2,
  Edit,
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

const stages = ['new_request', 'in_progress', 'repaired', 'scrap'];
const stageLabel: Record<string, string> = {
  new_request: 'New Request',
  in_progress: 'In Progress',
  repaired: 'Repaired',
  scrap: 'Scrap',
};
const stageColor: Record<string, string> = {
  new_request: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  repaired: 'bg-green-100 text-green-700',
  scrap: 'bg-red-100 text-red-700',
};

export default function CalendarPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const {
    requests,
    isLoading,
    createRequest,
    updateRequest,
    deleteRequest,
    isCreating,
    isUpdating,
    isDeleting,
  } = useMaintenance();

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
    requestDate: new Date().toISOString().split('T')[0],
    scheduledDate: '',
    durationHours: '0',
    priority: 'medium',
    stage: 'new_request',
    notes: '',
    instructions: '',
  });

  useEffect(() => {
    if (selectedDate) {
      setForm(prev => ({
        ...prev,
        scheduledDate: format(selectedDate, "yyyy-MM-dd'T'HH:mm"),
      }));
    }
  }, [selectedDate]);

  const handleEdit = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(false);

    // Pre-populate form with existing data
    setForm({
      subject: request.title || '',
      maintenanceFor: request.equipmentId ? 'equipment' : 'work_center',
      equipmentId: request.equipmentId || '',
      workCenterId: request.workCenterId || '',
      categoryId: request.categoryId || '',
      companyId: request.companyId || '',
      technicianUserId: request.assignedToId || '',
      maintenanceTeamId: request.teamId || '',
      maintenanceType: request.type || 'preventive',
      requestDate: request.createdAt
        ? format(parseISO(request.createdAt), 'yyyy-MM-dd')
        : new Date().toISOString().split('T')[0],
      scheduledDate: request.scheduledDate
        ? format(parseISO(request.scheduledDate), "yyyy-MM-dd'T'HH:mm")
        : '',
      durationHours: '0',
      priority: request.priority || 'medium',
      stage: request.status || 'new_request',
      notes: request.description || '',
      instructions: '',
    });

    setIsFormOpen(true);
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this maintenance request?')) {
      return;
    }

    try {
      await deleteRequest(requestId);
      toast({ title: 'Maintenance request deleted' });
      setIsViewDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete maintenance request',
      });
    }
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

      if (selectedRequest) {
        // Edit mode
        await updateRequest({ id: selectedRequest.id, data: payload });
        toast({ title: 'Maintenance request updated' });
      } else {
        // Create mode
        await createRequest(payload);
        toast({ title: 'Preventive maintenance scheduled' });
      }

      setIsFormOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: selectedRequest
          ? 'Failed to update maintenance'
          : 'Failed to schedule maintenance',
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
                className={`min-h-[100px] p-2 border-b border-r cursor-pointer transition-colors hover:bg-muted/50 ${
                  isToday ? 'bg-primary/5' : ''
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayRequests.slice(0, 3).map(req => (
                    <div
                      key={req.id}
                      className="text-[10px] p-1 rounded bg-primary/10 text-primary truncate flex items-center gap-1 hover:bg-primary/20 cursor-pointer transition-colors"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          stageColor[req.status] || 'bg-gray-400'
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
        onClose={() => {
          setIsFormOpen(false);
          setSelectedRequest(null);
        }}
        title={
          selectedRequest
            ? 'Edit Preventive Maintenance'
            : 'Schedule Preventive Maintenance'
        }
        icon={CalendarIcon}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
      >
        <div className="flex gap-1 mb-3 flex-wrap">
          {stages.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setForm({ ...form, stage: s })}
              className={`px-2 py-1 text-xs rounded ${
                form.stage === s
                  ? stageColor[s]
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {stageLabel[s]}
            </button>
          ))}
        </div>
        <Field label="Subject">
          <Input
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
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
          <SelectField
            label="Team"
            options={teams}
            value={form.maintenanceTeamId}
            onValueChange={v => setForm({ ...form, maintenanceTeamId: v })}
            addHref="/dashboard/teams"
          />
          <SelectField
            label="Technician"
            options={users.map((u: any) => ({
              id: u.id,
              name: u.fullName || u.email,
            }))}
            value={form.technicianUserId}
            onValueChange={v => setForm({ ...form, technicianUserId: v })}
            addHref="/register"
          />
          <Field label="Request Date">
            <Input
              type="date"
              value={form.requestDate}
              onChange={e => setForm({ ...form, requestDate: e.target.value })}
            />
          </Field>
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
          <Field label="Duration (hours)">
            <Input
              type="number"
              value={form.durationHours}
              onChange={e =>
                setForm({ ...form, durationHours: e.target.value })
              }
            />
          </Field>
          <Field label="Priority">
            <div className="flex gap-1">
              {['low', 'medium', 'high'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`p-1.5 rounded ${
                    form.priority === p ? 'bg-primary/10' : ''
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      form.priority === p
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Maintenance Type">
            <RadioGroup
              value={form.maintenanceType}
              onValueChange={v => setForm({ ...form, maintenanceType: v })}
              className="flex gap-3"
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem value="corrective" id="c" />
                <Label htmlFor="c" className="text-sm">
                  Corrective
                </Label>
              </div>
              <div className="flex items-center gap-1">
                <RadioGroupItem value="preventive" id="p" />
                <Label htmlFor="p" className="text-sm">
                  Preventive
                </Label>
              </div>
            </RadioGroup>
          </Field>
        </div>
        <Field label="Notes">
          <Textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </Field>
        <Field label="Instructions">
          <Textarea
            value={form.instructions}
            onChange={e => setForm({ ...form, instructions: e.target.value })}
            rows={3}
          />
        </Field>
      </FormDialog>

      {/* Event Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Maintenance Request Details
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge className={stageColor[selectedRequest.status]}>
                  {stageLabel[selectedRequest.status] || selectedRequest.status}
                </Badge>
                <Badge variant="outline">
                  {selectedRequest.type === 'preventive'
                    ? 'Preventive'
                    : 'Corrective'}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    selectedRequest.priority === 'high'
                      ? 'border-red-500 text-red-700'
                      : selectedRequest.priority === 'medium'
                        ? 'border-amber-500 text-amber-700'
                        : 'border-blue-500 text-blue-700'
                  }
                >
                  {selectedRequest.priority?.toUpperCase() || 'MEDIUM'} Priority
                </Badge>
              </div>

              {/* Subject */}
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedRequest.title}
                </h3>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedRequest.equipment && (
                  <div>
                    <p className="text-muted-foreground">Equipment</p>
                    <p className="font-medium">
                      {selectedRequest.equipment.name}
                    </p>
                  </div>
                )}

                {selectedRequest.workCenter && (
                  <div>
                    <p className="text-muted-foreground">Work Center</p>
                    <p className="font-medium">
                      {selectedRequest.workCenter.name}
                    </p>
                  </div>
                )}

                {selectedRequest.category && (
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">
                      {selectedRequest.category.name}
                    </p>
                  </div>
                )}

                {selectedRequest.company && (
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p className="font-medium">
                      {selectedRequest.company.name}
                    </p>
                  </div>
                )}

                {selectedRequest.team && (
                  <div>
                    <p className="text-muted-foreground">Team</p>
                    <p className="font-medium">{selectedRequest.team.name}</p>
                  </div>
                )}

                {selectedRequest.assignedTo && (
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium">
                      {selectedRequest.assignedTo.fullName ||
                        selectedRequest.assignedTo.email}
                    </p>
                  </div>
                )}

                {selectedRequest.scheduledDate && (
                  <div>
                    <p className="text-muted-foreground">Scheduled Date</p>
                    <p className="font-medium">
                      {format(parseISO(selectedRequest.scheduledDate), 'PPp')}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(parseISO(selectedRequest.createdAt), 'PPp')}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedRequest.description && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Notes</p>
                  <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                    {selectedRequest.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleEdit(selectedRequest)}
                  className="flex-1 gap-2"
                  variant="default"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(selectedRequest.id)}
                  className="flex-1 gap-2"
                  variant="destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
