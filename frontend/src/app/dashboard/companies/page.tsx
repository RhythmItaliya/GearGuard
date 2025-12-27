'use client';

import { useState, useEffect } from 'react';
import { useCompanies, Company } from '@/hooks/use-companies';
import { PageHeader, DataTable, FormDialog, Field } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';

export default function CompaniesPage() {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Company | null>(null);

    const {
        companies,
        isLoading,
        createCompany,
        updateCompany,
        deleteCompany,
        isCreating,
        isUpdating,
    } = useCompanies();

    const [form, setForm] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (editing) {
            setForm({
                name: editing.name,
                description: editing.description || '',
            });
        } else {
            setForm({
                name: '',
                description: '',
            });
        }
    }, [editing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateCompany({ id: editing.id, data: form });
                toast({ title: 'Company updated successfully' });
            } else {
                await createCompany(form);
                toast({ title: 'Company created successfully' });
            }
            setOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save company',
            });
        }
    };

    const handleDelete = async (item: Company) => {
        if (
            confirm(
                'Are you sure you want to delete this company? This will delete all associated data.'
            )
        ) {
            try {
                await deleteCompany(item.id);
                toast({ title: 'Company deleted successfully' });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to delete company',
                });
            }
        }
    };

    const filtered = companies.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <PageHeader
                title="Companies"
                search={search}
                onSearch={setSearch}
                onAdd={() => {
                    setEditing(null);
                    setOpen(true);
                }}
            />
            <DataTable
                columns={[
                    { key: 'name', label: 'Company' },
                    { key: 'description', label: 'Description' },
                    { key: 'stats', label: 'Stats' },
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
                    if (key === 'description')
                        return (
                            <span className="text-muted-foreground line-clamp-1">
                                {item.description || '-'}
                            </span>
                        );
                    if (key === 'stats') {
                        const stats = item._count;
                        if (!stats) return '-';
                        return (
                            <div className="flex gap-2 text-xs">
                                <span title="Users">{stats.users} Users</span>
                                <span title="Equipment">{stats.equipment} Eq.</span>
                                <span title="Teams">{stats.teams} Teams</span>
                            </div>
                        );
                    }
                    return '-';
                }}
            />

            <FormDialog
                open={open}
                onClose={() => setOpen(false)}
                title={editing ? 'Edit Company' : 'New Company'}
                icon={Building2}
                onSubmit={handleSubmit}
                loading={isCreating || isUpdating}
            >
                <Field label="Company Name">
                    <Input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Acme Corp"
                        required
                    />
                </Field>
                <Field label="Description">
                    <Textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Optional description"
                    />
                </Field>
            </FormDialog>
        </div>
    );
}
