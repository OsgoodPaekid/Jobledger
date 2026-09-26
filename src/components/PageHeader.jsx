export default function PageHeader({ title, action }) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-[28px] text-ink">{title}</h1>
        {action}
      </div>
      <div className="rule-brass mt-3" />
    </div>
  );
}
