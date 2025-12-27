'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  LucideIcon,
  Save,
  HelpCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

// Page Header with search and add button
interface PageHeaderProps {
  title: string;
  search: string;
  onSearch: (v: string) => void;
  onAdd: () => void;
}

export const PageHeader = ({
  title,
  search,
  onSearch,
  onAdd,
}: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="flex gap-2">
      <div className="relative flex-1 sm:w-48">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="pl-8 h-9"
        />
      </div>
      <Button onClick={onAdd} size="sm" className="gap-1.5">
        <Plus className="h-4 w-4" /> New
      </Button>
    </div>
  </div>
);

// Data Table wrapper
interface Column {
  key: string;
  label: string;
  className?: string;
}
interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  loading: boolean;
  empty?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderCell: (item: T, key: string) => ReactNode;
  keyField?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading,
  empty = 'No data',
  onEdit,
  onDelete,
  renderCell,
  keyField = 'id',
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg overflow-x-auto bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map(col => (
              <TableHead key={col.key} className={col.className}>
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete) && (
              <TableHead className="w-20">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-8"
              >
                <div className="h-5 w-5 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-8 text-muted-foreground"
              >
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            data.map(item => (
              <TableRow
                key={item[keyField]}
                className="hover:bg-muted/30"
                onClick={() => onEdit?.(item)}
              >
                {columns.map(col => (
                  <TableCell key={col.key} className={col.className}>
                    {renderCell(item, col.key)}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={e => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={e => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Form Dialog wrapper
interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: LucideIcon;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  loading?: boolean;
}

export const FormDialog = ({
  open,
  onClose,
  title,
  icon: Icon,
  onSubmit,
  children,
  loading,
}: FormDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />} {title}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="gap-1.5"
          >
            <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

// Form Field wrapper
interface FieldProps {
  label: string;
  tip?: string;
  children: ReactNode;
}

export const Field = ({ label, tip, children }: FieldProps) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1">
      <Label className="text-sm">{label}</Label>
      {tip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    {children}
  </div>
);

// Enhanced Select Field with Empty State handling
interface SelectFieldProps {
  label: string;
  options: { id: string; name: string }[];
  value: string;
  onValueChange: (v: string) => void;
  addHref: string;
  placeholder?: string;
  tip?: string;
  required?: boolean;
}

export const SelectField = ({
  label,
  options,
  value,
  onValueChange,
  addHref,
  placeholder = 'Select',
  tip,
  required,
}: SelectFieldProps) => (
  <Field label={label} tip={tip}>
    <div className="flex gap-2">
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                No {label.toLowerCase()} found
              </p>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="w-full gap-1 h-8 text-xs"
              >
                <Link href={addHref}>
                  <Plus className="h-3 w-3" /> Add {label}
                </Link>
              </Button>
            </div>
          ) : (
            options.map(opt => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {options.length === 0 && (
        <Button
          variant="outline"
          size="icon"
          asChild
          className="shrink-0 h-10 w-10"
          title={`Add ${label}`}
        >
          <Link href={addHref}>
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  </Field>
);
