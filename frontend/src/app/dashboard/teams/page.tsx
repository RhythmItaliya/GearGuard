'use client';

import { useState, useEffect } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { useResources } from '@/hooks/use-resources';
import { PageHeader, DataTable, FormDialog, Field } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, X } from 'lucide-react';
import { MaintenanceTeamWithRelations } from '@/types';

export default function TeamsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [editing, setEditing] = useState<MaintenanceTeamWithRelations | null>(
    null
  );
  const [selectedTeam, setSelectedTeam] =
    useState<MaintenanceTeamWithRelations | null>(null);
  const [selectedUser, setSelectedUser] = useState('');

  const {
    teams,
    isLoading,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    isCreating,
    isUpdating,
  } = useTeams();

  const { users, companies } = useResources();

  const [form, setForm] = useState({
    name: '',
    companyId: '',
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        companyId: editing.companyId,
      });
    } else {
      setForm({
        name: '',
        companyId: '',
      });
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        companyId: form.companyId,
      };

      if (editing) {
        await updateTeam({ id: editing.id, data: payload });
        toast({ title: 'Team updated successfully' });
      } else {
        await createTeam(payload);
        toast({ title: 'Team created successfully' });
      }
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save team',
      });
    }
  };

  const handleDelete = async (item: MaintenanceTeamWithRelations) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(item.id);
        toast({ title: 'Team deleted successfully' });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete team',
        });
      }
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !selectedUser) return;
    try {
      await addMember({
        teamId: selectedTeam.id,
        userId: selectedUser,
        role: 'member',
      });
      toast({ title: 'Member added successfully' });
      setSelectedUser('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add member',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedTeam) return;
    try {
      await removeMember({ teamId: selectedTeam.id, memberId });
      toast({ title: 'Member removed successfully' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove member',
      });
    }
  };

  const filtered = teams.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Teams"
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Team' },
          { key: 'members', label: 'Members' },
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
          if (key === 'members')
            return (
              <div className="flex items-center gap-1.5 flex-wrap">
                {(item.members || []).map(m => (
                  <Badge key={m.id} variant="secondary" className="text-xs">
                    {m.user?.fullName || m.user?.email || 'Unknown'}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs gap-1"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedTeam(item);
                    setMemberOpen(true);
                  }}
                >
                  <UserPlus className="h-3 w-3" />
                  Manage
                </Button>
              </div>
            );
          return '-';
        }}
      />

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Team' : 'New Team'}
        icon={Users}
        onSubmit={handleSubmit}
        loading={isCreating || isUpdating}
      >
        <Field label="Team Name">
          <Input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
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

      <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Manage Members - {selectedTeam?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddMember} disabled={!selectedUser}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          <div className="border rounded divide-y mt-2">
            {(selectedTeam?.members || []).length === 0 ? (
              <p className="p-2 text-sm text-muted-foreground">No members</p>
            ) : (
              (selectedTeam?.members || []).map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2"
                >
                  <span className="text-sm">
                    {m.user?.fullName || m.user?.email || 'Unknown'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveMember(m.id)}
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
