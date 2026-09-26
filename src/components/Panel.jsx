export default function Panel({ title, className = "", children }) {
  return (
    <div className={`bg-paper-raised border border-line rounded-[10px] p-4 sm:p-5 shadow-[0_1px_2px_rgba(22,33,58,0.04)] ${className}`}>
      {title && (
        <h2 className="text-[13px] font-medium text-slate mb-3 pb-2.5 border-b border-line">{title}</h2>
      )}
      {children}
    </div>
  );
}
