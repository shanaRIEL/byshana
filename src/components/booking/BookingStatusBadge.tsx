const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: "bg-sand-deep", text: "text-ink/70" },
  accepted: { label: "Accepted", bg: "bg-ink/10", text: "text-ink" },
  active: { label: "Active", bg: "bg-ink text-b8", text: "text-b8" },
  completed: { label: "Completed", bg: "bg-white border border-line", text: "text-ink/50" },
  rejected: { label: "Rejected", bg: "bg-b1/10", text: "text-b2" },
  cancelled: { label: "Cancelled", bg: "bg-white border border-line", text: "text-ink/35" },
};

export default function BookingStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={`inline-block text-[0.56rem] font-semibold font-montserrat tracking-[0.14em] uppercase px-2.5 py-1 shrink-0 ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
