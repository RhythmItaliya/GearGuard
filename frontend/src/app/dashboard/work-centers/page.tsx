'use client';

import { useState, useEffect } from 'react';
import { useWorkCenters } from '@/hooks/use-work-centers';
import { useResources } from '@/hooks/use-resources';
import { PageHeader, DataTable, FormDialog, Field } from '@/components/shared';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Factory } from 'lucide-react';
import { WorkCenter } from '@/types';

export default function WorkCentersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WorkCenter | null>(null);

  const {
    workCenters,
    isLoading,
    createWorkCenter,
    updateWorkCenter,
    deleteWorkCenter,
    isCreating,
    isUpdating,
  } = useWorkCenters();

  const { companies } = useResources();

  const [form, setForm] = useState({
    name: '',
    code: '',
    tag: '',
    alternativeWorkCenters: '',
    costPerHour: '0',
    capacity: '1',
    timeEfficiency: '100',
    oeeTarget: '0',
    companyId: '',
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        code: editing.code || '',
        tag: editing.tag || '',
        alternativeWorkCenters: editing.alternativeWorkCenters || '',
        costPerHour: String(editing.costPerHour || 0),
        capacity: String(editing.capacity || 1),
        timeEfficiency: String(editing.timeEfficiency || 100),
        oeeTarget: String(editing.oeeTarget || 0),
        companyId: editing.companyId || '',
      });
    } else {
      setForm({
        name: '',
        code: '',
        tag: '',
        alternativeWorkCenters: '',
        costPerHour: '0',
        capacity: '1',
        timeEfficiency: '100',
        oeeTarget: '0',
        companyId: '',
      });
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        code: form.code || null,
        tag: form.tag || null,
        alternativeWorkCenters: form.alternativeWorkCenters || null,
        costPerHour: +form.costPerHour,
        capacity: +form.capacity,
        timeEfficiency: +form.timeEfficiency,
        oeeTarget: +form.oeeTarget,
        companyId: form.companyId,
      };

      if (editing) {
        await updateWorkCenter({ id: editing.id, data: payload });
        toast({ title: 'Work center updated successfully' });
      } else {
        await createWorkCenter(payload);
        toast({ title: 'Work center created successfully' });
      }
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save work center',
      });
    }
  };

  const handleDelete = async (item: WorkCenter) => {
    if (confirm('Are you sure you want to delete this work center?')) {
      try {
        await deleteWorkCenter(item.id);
        toast({ title: 'Work center deleted successfully' });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete work center',
        });
      }
    }
  };

  const filtered = workCenters.filter(
    i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Work Centers"
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'code', label: 'Code' },
          { key: 'tag', label: 'Tag' },
          { key: 'cost', label: 'Cost/Hr' },
          { key: 'capacity', label: 'Capacity' },
          { key: 'efficiency', label: 'Efficiency' },
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
          if (key === 'code') return item.code || '-';
          if (key === 'tag') return item.tag || '-';
          if (key === 'cost') return item.costPerHour?.toFixed(2);
          if (key === 'capacity') return item.capacity?.toFixed(2);
          if (key === 'efficiency') return `${item.timeEfficiency}%`;
          return '-';
        }}
      />

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Work Center' : 'New Work Center'}
        icon={Factory}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name">
            <Input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Code">
            <Input
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
            />
          </Field>
          <Field label="Tag">
            <Input
              value={form.tag}
              onChange={e => setForm({ ...form, tag: e.target.value })}
            />
          </Field>
          <Field label="Alternative">
            <Input
              value={form.alternativeWorkCenters}
              onChange={e =>
                setForm({ ...form, alternativeWorkCenters: e.target.value })
              }
            />
          </Field>
          <Field label="Cost/Hour">
            <Input
              type="number"
              value={form.costPerHour}
              onChange={e => setForm({ ...form, costPerHour: e.target.value })}
            />
          </Field>
          <Field label="Capacity">
            <Input
              type="number"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
            />
          </Field>
          <Field label="Efficiency %">
            <Input
              type="number"
              value={form.timeEfficiency}
              onChange={e =>
                setForm({ ...form, timeEfficiency: e.target.value })
              }
            />
          </Field>
          <Field label="OEE Target">
            <Input
              type="number"
              value={form.oeeTarget}
              onChange={e => setForm({ ...form, oeeTarget: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Company">
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
      </FormDialog>
    </div>
  );
}
