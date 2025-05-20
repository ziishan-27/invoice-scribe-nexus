
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/types";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig: Record<
  InvoiceStatus,
  { color: string; backgroundColor: string; label: string }
> = {
  draft: {
    color: "text-gray-800",
    backgroundColor: "bg-gray-100",
    label: "Draft",
  },
  sent: {
    color: "text-blue-800",
    backgroundColor: "bg-blue-100",
    label: "Sent",
  },
  paid: {
    color: "text-green-800",
    backgroundColor: "bg-green-100",
    label: "Paid",
  },
  overdue: {
    color: "text-red-800",
    backgroundColor: "bg-red-100",
    label: "Overdue",
  },
  cancelled: {
    color: "text-gray-800",
    backgroundColor: "bg-gray-100",
    label: "Cancelled",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge
      className={`${config.backgroundColor} ${config.color} hover:${config.backgroundColor}`}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
};
