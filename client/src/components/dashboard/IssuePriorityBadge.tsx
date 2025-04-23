import { getPriorityColor } from "@/lib/utils";
import { PRIORITY_LABELS } from "@/lib/constants";
import { Priority } from "@shared/schema";

interface IssuePriorityBadgeProps {
  priority: Priority;
}

const IssuePriorityBadge = ({ priority }: IssuePriorityBadgeProps) => {
  const colorClass = getPriorityColor(priority);
  const label = PRIORITY_LABELS[priority];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default IssuePriorityBadge;
