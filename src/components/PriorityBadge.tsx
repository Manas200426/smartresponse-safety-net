
import { cn } from '@/lib/utils';
import { AccidentSeverity } from '@/types/accident';

interface PriorityBadgeProps {
  severity: AccidentSeverity;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ severity, className }) => {
  const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const severityClasses = {
    'Critical': "bg-priority-critical text-white",
    'High': "bg-priority-high text-white",
    'Medium': "bg-priority-medium text-emergency-darkGray",
    'Low': "bg-priority-low text-white",
  };
  
  return (
    <span className={cn(baseClass, severityClasses[severity], className)}>
      {severity}
    </span>
  );
};

export default PriorityBadge;
