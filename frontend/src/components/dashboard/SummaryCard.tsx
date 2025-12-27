import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  subtitle: string;
  variant: 'critical' | 'info' | 'success';
  icon?: ReactNode;
  tooltip?: string;
}

const colors = {
  critical: 'bg-red-50 border-red-200 text-red-600',
  info: 'bg-blue-50 border-blue-200 text-blue-600',
  success: 'bg-green-50 border-green-200 text-green-600',
};

const SummaryCard = ({
  title,
  value,
  subtitle,
  variant,
  icon,
  tooltip,
}: Props) => (
  <div className={`rounded-lg border-2 p-4 ${colors[variant]}`}>
    <div className="flex justify-between">
      <div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold uppercase">{title}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3 w-3 opacity-60" />
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-xs">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xl font-bold mt-1">{value}</p>
        <p className="text-xs opacity-80">{subtitle}</p>
      </div>
      {icon && <div className="opacity-80">{icon}</div>}
    </div>
  </div>
);

export default SummaryCard;
