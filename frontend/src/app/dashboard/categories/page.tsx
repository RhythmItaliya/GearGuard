'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/use-categories';
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
import { Folder } from 'lucide-react';
import { EquipmentCategory } from '@/types';

export default function CategoriesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EquipmentCategory | null>(null);

  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
  } = useCategories();

  const { users, companies } = useResources();

  const [form, setForm] = useState({
    name: '',
    responsibleUserId: '',
    companyId: '',
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        responsibleUserId: editing.responsibleUserId || '',
        companyId: editing.companyId || '',
      });
    } else {
      setForm({
        name: '',
        responsibleUserId: '',
        companyId: '',
      });
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        responsibleUserId: form.responsibleUserId || null,
        companyId: form.companyId,
      };

      if (editing) {
        await updateCategory({ id: editing.id, data: payload });
        toast({ title: 'Category updated successfully' });
      } else {
        await createCategory(payload);
        toast({ title: 'Category created successfully' });
      }
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save category',
      });
    }
  };

  const handleDelete = async (item: EquipmentCategory) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(item.id);
        toast({ title: 'Category deleted successfully' });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete category',
        });
      }
    }
  };

  const filtered = categories.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categories"
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Category' },
          { key: 'responsible', label: 'Responsible' },
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
          if (key === 'responsible')
            return (
              item.responsibleUser?.fullName ||
              item.responsibleUser?.email ||
              '-'
            );
          if (key === 'company') return item.company?.name || '-';
          return '-';
        }}
      />

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Category' : 'New Category'}
        icon={Folder}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
      >
        <Field label="Name">
          <Input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <Field label="Responsible">
          <Select
            value={form.responsibleUserId}
            onValueChange={v => setForm({ ...form, responsibleUserId: v })}
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
