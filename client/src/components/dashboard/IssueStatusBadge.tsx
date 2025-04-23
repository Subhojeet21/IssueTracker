import { getStatusColor } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/constants";
import { Status } from "@shared/schema";

interface IssueStatusBadgeProps {
  status: Status;
}

const IssueStatusBadge = ({ status }: IssueStatusBadgeProps) => {
  const colorClass = getStatusColor(status);
  const label = STATUS_LABELS[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default IssueStatusBadge;
