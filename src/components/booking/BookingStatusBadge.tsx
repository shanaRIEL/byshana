const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800" },
  accepted: { label: "Accepted", bg: "bg-blue-100", text: "text-blue-800" },
  active: { label: "Active", bg: "bg-green-100", text: "text-green-800" },
  completed: { label: "Completed", bg: "bg-b7", text: "text-b3" },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-800" },
  cancelled: { label: "Cancelled", bg: "bg-b7", text: "text-b5" },
};

export default function BookingStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={`inline-block text-[0.65rem] font-semibold font-montserrat tracking-wide uppercase px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
