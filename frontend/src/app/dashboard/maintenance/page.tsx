'use client';

import { useState, useEffect } from 'react';
import { useMaintenance } from '@/hooks/use-maintenance';
import { useResources } from '@/hooks/use-resources';
import { useEquipment } from '@/hooks/use-equipment';
import {
  PageHeader,
  DataTable,
  FormDialog,
  Field,
  SelectField,
} from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

const stages = ['new_request', 'in_progress', 'repaired', 'scrap'];
const stageLabel: Record<string, string> = {
  new_request: 'New',
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

export default function MaintenancePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [tab, setTab] = useState('all');

  const {
    requests,
    isLoading,
    createRequest,
    updateRequest,
    deleteRequest,
    isCreating,
    isUpdating,
  } = useMaintenance();

  const {
    categories,
    companies,
    teams,
    users,
    workCenters,
    isLoading: resourcesLoading,
  } = useResources();

  const { equipment } = useEquipment();

  // Form state
  const [form, setForm] = useState({
    subject: '',
    maintenanceFor: 'equipment',
    equipmentId: '',
    workCenterId: '',
    categoryId: '',
    companyId: '',
    technicianUserId: '',
    maintenanceTeamId: '',
    maintenanceType: 'corrective',
    requestDate: new Date().toISOString().split('T')[0],
    scheduledDate: '',
    durationHours: '0',
    priority: 'medium',
    stage: 'new_request',
    status: 'in_progress',
    notes: '',
    instructions: '',
  });

  useEffect(() => {
    if (editing) {
      setForm({
        subject: editing.title, // Map title to subject
        maintenanceFor: editing.equipmentId ? 'equipment' : 'work_center',
        equipmentId: editing.equipmentId || '',
        workCenterId: editing.workCenterId || '',
        categoryId: editing.categoryId || '',
        companyId: editing.companyId || '',
        technicianUserId: editing.technician?.id || '', // Assuming technician relation is loaded
        maintenanceTeamId: editing.teamId || '',
        maintenanceType: editing.type || 'corrective',
        requestDate: editing.createdAt
          ? new Date(editing.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        scheduledDate: editing.scheduledDate
          ? new Date(editing.scheduledDate).toISOString().slice(0, 16)
          : '',
        durationHours: '0', // Not in schema yet
        priority: editing.priority || 'medium',
        stage:
          editing.status === 'pending'
            ? 'new_request'
            : editing.status === 'completed'
              ? 'repaired'
              : 'in_progress', // Map status to stage roughly
        status: editing.status || 'pending',
        notes: editing.description || '',
        instructions: '', // Not in schema yet
      });
    } else {
      setForm({
        subject: '',
        maintenanceFor: 'equipment',
        equipmentId: '',
        workCenterId: '',
        categoryId: '',
        companyId: '',
        technicianUserId: '',
        maintenanceTeamId: '',
        maintenanceType: 'corrective',
        requestDate: new Date().toISOString().split('T')[0],
        scheduledDate: '',
        durationHours: '0',
        priority: 'medium',
        stage: 'new_request',
        status: 'in_progress',
        notes: '',
        instructions: '',
      });
    }
  }, [editing]);

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
        requestedById: (session?.user as any)?.id, // Ensure user ID is available
        // assignedToId: form.technicianUserId || null, // Need to add to schema or use existing relation
        teamId: form.maintenanceTeamId || null,
        type: form.maintenanceType,
        // scheduledDate: form.scheduledDate ? new Date(form.scheduledDate) : null,
        priority: form.priority,
        status:
          form.stage === 'new_request'
            ? 'pending'
            : form.stage === 'repaired'
              ? 'completed'
              : 'in_progress', // Map stage back to status
      };

      if (editing) {
        await updateRequest({ id: editing.id, data: payload });
        toast({ title: 'Request updated successfully' });
      } else {
        await createRequest(payload);
        toast({ title: 'Request created successfully' });
      }
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save request',
      });
    }
  };

  const handleDelete = async (item: any) => {
    if (confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteRequest(item.id);
        toast({ title: 'Request deleted successfully' });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete request',
        });
      }
    }
  };

  // Helper to map status to stage for display filtering
  const getStage = (status: string) => {
    if (status === 'pending') return 'new_request';
    if (status === 'completed') return 'repaired';
    if (status === 'cancelled') return 'scrap';
    return 'in_progress';
  };

  const filtered = requests.filter(
    (i: any) =>
      i.title.toLowerCase().includes(search.toLowerCase()) &&
      (tab === 'all' || getStage(i.status) === tab)
  );

  const userOptions = users.map((u: any) => ({
    id: u.id,
    name: u.fullName || u.email,
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Maintenance Requests"
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {stages.map(s => (
            <TabsTrigger key={s} value={s}>
              {stageLabel[s]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DataTable
        columns={[
          { key: 'subject', label: 'Subject' },
          { key: 'type', label: 'Type' },
          { key: 'stage', label: 'Stage' },
          { key: 'category', label: 'Category' },
          { key: 'company', label: 'Company' },
        ]}
        data={filtered}
        loading={isLoading}
        onEdit={item => {
          setEditing(item);
          setOpen(true);
        }}
        onDelete={handleDelete}
        renderCell={(item, key) => {
          const stage = getStage(item.status);
          if (key === 'subject') return item.title;
          if (key === 'type') return item.type;
          if (key === 'stage')
            return (
              <Badge className={stageColor[stage]}>{stageLabel[stage]}</Badge>
            );
          if (key === 'category') return item.category?.name || '-';
          if (key === 'company') return item.company?.name || '-';
          return '-';
        }}
      />

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Request' : 'New Request'}
        icon={ClipboardList}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
      >
        <div className="flex gap-1 mb-3 flex-wrap">
          {stages.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setForm({ ...form, stage: s })}
              className={`px-2 py-1 text-xs rounded ${form.stage === s
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
            className="text-lg font-semibold"
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
            options={userOptions}
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
          <Field label="Scheduled">
            <Input
              type="datetime-local"
              value={form.scheduledDate}
              onChange={e =>
                setForm({ ...form, scheduledDate: e.target.value })
              }
            />
          </Field>
          <Field label="Duration (hrs)">
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
                  className={`p-1.5 rounded ${form.priority === p ? 'bg-primary/10' : ''
                    }`}
                >
                  <Star
                    className={`h-5 w-5 ${form.priority === p
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                      }`}
                  />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Type">
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
            rows={2}
          />
        </Field>
        <Field label="Instructions">
          <Textarea
            value={form.instructions}
            onChange={e => setForm({ ...form, instructions: e.target.value })}
            rows={2}
          />
        </Field>
      </FormDialog>
    </div>
  );
}
