'use client';

import { useState, useEffect } from 'react';
import { useEquipment } from '@/hooks/use-equipment';
import { useResources } from '@/hooks/use-resources';
import { PageHeader, DataTable, FormDialog, Field } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';
import { Equipment } from '@/types';

export default function EquipmentPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);

  const [form, setForm] = useState({
    name: '',
    serialNumber: '',
    categoryId: '',
    companyId: '',
    department: '',
    usedByUserId: '',
    technicianUserId: '',
    maintenanceTeamId: '',
    workCenterId: '',
    assignedDate: '',
    scrapDate: '',
    location: '',
    description: '',
  });

  const {
    equipment,
    isLoading,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    isCreating,
    isUpdating,
  } = useEquipment();

  const { categories, companies, teams, users, workCenters } = useResources();

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        serialNumber: editing.serialNumber || '',
        categoryId: editing.categoryId || '',
        companyId: editing.companyId || '',
        department: editing.department || '',
        usedByUserId: editing.usedByUserId || '',
        technicianUserId: editing.technicianUserId || '',
        maintenanceTeamId: editing.maintenanceTeamId || '',
        workCenterId: editing.workCenterId || '',
        assignedDate: editing.assignedDate
          ? new Date(editing.assignedDate).toISOString().split('T')[0]
          : '',
        scrapDate: editing.scrapDate
          ? new Date(editing.scrapDate).toISOString().split('T')[0]
          : '',
        location: editing.location || '',
        description: editing.description || '',
      });
    } else {
      setForm({
        name: '',
        serialNumber: '',
        categoryId: '',
        companyId: '',
        department: '',
        usedByUserId: '',
        technicianUserId: '',
        maintenanceTeamId: '',
        workCenterId: '',
        assignedDate: '',
        scrapDate: '',
        location: '',
        description: '',
      });
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        serialNumber: form.serialNumber || null,
        categoryId: form.categoryId || null,
        companyId: form.companyId,
        department: form.department || null,
        location: form.location || null,
        usedByUserId: form.usedByUserId || null,
        technicianUserId: form.technicianUserId || null,
        maintenanceTeamId: form.maintenanceTeamId || null,
        workCenterId: form.workCenterId || null,
        assignedDate: form.assignedDate
          ? new Date(form.assignedDate).toISOString()
          : null,
        scrapDate: form.scrapDate
          ? new Date(form.scrapDate).toISOString()
          : null,
        description: form.description || null,
      };

      if (editing) {
        await updateEquipment({ id: editing.id, data: payload });
        toast({ title: 'Equipment updated successfully' });
      } else {
        await createEquipment(payload);
        toast({ title: 'Equipment created successfully' });
      }
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save equipment',
      });
    }
  };

  const handleDelete = async (item: Equipment) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(item.id);
        toast({ title: 'Equipment deleted successfully' });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete equipment',
        });
      }
    }
  };

  const filtered = equipment.filter(
    (i: any) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Equipment"
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Equipment' },
          { key: 'serial', label: 'Serial' },
          { key: 'dept', label: 'Department' },
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
          if (key === 'name') return item.name;
          if (key === 'serial') return item.serialNumber || '-';
          if (key === 'dept') return item.department || '-';
          if (key === 'category') return item.category?.name || '-';
          if (key === 'company') return item.company?.name || '-';
          return '-';
        }}
      />

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Equipment' : 'New Equipment'}
        icon={Settings}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" tip="Equipment name">
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Serial Number" tip="Unique identifier">
            <Input
              value={form.serialNumber}
              onChange={e => setForm({ ...form, serialNumber: e.target.value })}
            />
          </Field>
          <Field label="Category" tip="Equipment type">
            <Select
              value={form.categoryId}
              onValueChange={v => setForm({ ...form, categoryId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Company" tip="Owning company">
            <Select
              value={form.companyId}
              onValueChange={v => setForm({ ...form, companyId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Department">
            <Input
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <Input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Maintenance Team">
            <Select
              value={form.maintenanceTeamId}
              onValueChange={v => setForm({ ...form, maintenanceTeamId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t: any) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Technician">
            <Select
              value={form.technicianUserId}
              onValueChange={v => setForm({ ...form, technicianUserId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Used By">
            <Select
              value={form.usedByUserId}
              onValueChange={v => setForm({ ...form, usedByUserId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Work Center">
            <Select
              value={form.workCenterId}
              onValueChange={v => setForm({ ...form, workCenterId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {workCenters.map((w: any) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Assigned Date">
            <Input
              type="date"
              value={form.assignedDate}
              onChange={e => setForm({ ...form, assignedDate: e.target.value })}
            />
          </Field>
          <Field label="Scrap Date">
            <Input
              type="date"
              value={form.scrapDate}
              onChange={e => setForm({ ...form, scrapDate: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Description">
          <Textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
        </Field>
      </FormDialog>
    </div>
  );
}
