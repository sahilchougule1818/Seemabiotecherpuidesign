import { Badge } from "../ui/badge";

export type StatusType = "active" | "pending" | "completed" | "contaminated";

interface StatusBadgeProps {
  status: StatusType;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-[#4CAF50] hover:bg-[#45a049] text-white border-0",
  },
  pending: {
    label: "Pending",
    className: "bg-[#FFC107] hover:bg-[#ffb300] text-[#555555] border-0",
  },
  completed: {
    label: "Completed",
    className: "bg-[#2196F3] hover:bg-[#1976D2] text-white border-0",
  },
  contaminated: {
    label: "Contaminated",
    className: "bg-[#d4183d] hover:bg-[#c0162e] text-white border-0",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
