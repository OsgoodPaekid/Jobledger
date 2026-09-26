const stageColor = {
  "New / Not Started": "var(--color-slate)",
  "Documents Received": "var(--color-ink-soft)",
  "Documents Being Processed": "var(--color-ink-soft)",
  "Application Submitted": "var(--color-brass)",
  "Awaiting Approval": "var(--color-amber)",
  "Approved": "var(--color-forest)",
  "Ready for Collection": "var(--color-forest)",
  "Completed": "var(--color-forest)",
  "On Hold": "var(--color-amber)",
  "Cancelled": "var(--color-rust)",
};

export function StageBadge({ stage }) {
  const color = stageColor[stage] || "var(--color-slate)";
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[12.5px] text-ink/80 whitespace-nowrap">
      <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: color }} />
      {stage}
    </span>
  );
}

const paymentStyle = {
  "Unpaid": { color: "var(--color-rust)", bg: "var(--color-rust-tint)" },
  "Partially Paid": { color: "var(--color-amber)", bg: "var(--color-amber-tint)" },
  "Fully Paid": { color: "var(--color-forest)", bg: "var(--color-forest-tint)" },
};

export function PaymentBadge({ status }) {
  const s = paymentStyle[status] || { color: "var(--color-slate)", bg: "var(--color-line)" };
  return (
    <span
      className="inline-block text-[12px] font-medium px-2 py-0.5 rounded-[4px] whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}
    >
      {status}
    </span>
  );
}
