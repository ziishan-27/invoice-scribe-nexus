
import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types";
import { Clock, CheckCircle2, XCircle, AlertCircle, Circle } from "lucide-react";

interface StatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "draft":
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Circle className="h-3 w-3 text-gray-500" />,
          label: "Draft"
        };
      case "sent":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="h-3 w-3 text-blue-500" />,
          label: "Sent"
        };
      case "paid":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="h-3 w-3 text-green-500" />,
          label: "Paid"
        };
      case "overdue":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertCircle className="h-3 w-3 text-red-500" />,
          label: "Overdue"
        };
      case "cancelled":
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <XCircle className="h-3 w-3 text-gray-500" />,
          label: "Cancelled"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Circle className="h-3 w-3 text-gray-500" />,
          label: status
        };
    }
  };

  const { color, icon, label } = getStatusConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm",
        color,
        className
      )}
    >
      {icon}
      <span className="ml-1">{label}</span>
    </span>
  );
};
