// A row of label/value pairs separated by dividers — deliberately not a grid
// of identical bordered cards, so the numbers read as one ledger line, not
// a wall of matching widgets. On narrow screens it becomes a 2-column grid
// instead, since a horizontal divider makes no sense once items wrap.
export function StatRow({ items }) {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap divide-y sm:divide-y-0 sm:divide-x divide-line border border-line rounded-[10px] bg-paper-raised overflow-hidden shadow-[0_1px_2px_rgba(22,33,58,0.04)]">
      {items.map((it, i) => (
        <div key={i} className="flex-1 sm:min-w-[130px] px-4 sm:px-5 py-3.5 sm:py-4 border-r border-line sm:border-r-0 last:border-r-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r min-w-0">
          <div className="text-[12px] text-slate">{it.label}</div>
          <div
            className="font-serif text-ink mt-0.5 tabular-nums truncate"
            style={{ fontSize: "clamp(15px, 4vw, 22px)" }}
            title={String(it.value)}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroStat({ label, value, sub }) {
  return (
    <div className="min-w-0">
      <div className="text-[13px] text-slate mb-1">{label}</div>
      <div
        className="font-serif leading-none text-ink tabular-nums"
        style={{ fontSize: "clamp(28px, 7vw, 52px)" }}
      >
        {value}
      </div>
      <div className="w-14 h-[3px] bg-brass mt-3 mb-2" />
      {sub && <div className="text-[13px] text-slate">{sub}</div>}
    </div>
  );
}
