export function TextInput(props) {
  return (
    <input
      {...props}
      className={`border border-line rounded-md px-3 py-2 text-sm bg-paper-raised text-ink placeholder:text-slate/60 transition-shadow focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass ${props.className || ""}`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`border border-line rounded-md px-3 py-2 text-sm bg-paper-raised text-ink transition-shadow focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass ${props.className || ""}`}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`border border-line rounded-md px-3 py-2 text-sm bg-paper-raised text-ink placeholder:text-slate/60 transition-shadow focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass ${props.className || ""}`}
    />
  );
}

export function Label({ children, className = "" }) {
  return <label className={`text-[11px] text-slate flex flex-col gap-1 ${className}`}>{children}</label>;
}

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-ink text-paper hover:bg-ink-soft shadow-sm hover:shadow active:scale-[0.98]",
    ghost: "border border-line text-ink bg-paper-raised hover:bg-paper active:scale-[0.98]",
    danger: "text-rust hover:underline",
  };
  return (
    <button
      {...props}
      className={`text-sm font-medium px-3.5 py-2 rounded-md transition-all disabled:opacity-50 disabled:active:scale-100 ${styles[variant]} ${className}`}
    />
  );
}
