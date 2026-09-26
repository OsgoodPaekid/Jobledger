import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api, money, shortDate } from "../api.js";
import { StageBadge, PaymentBadge } from "../components/StatusBadge.jsx";
import { StatRow } from "../components/Stat.jsx";
import { ErrorNotice } from "./Dashboard.jsx";

export default function MiddlemanDetail() {
  const { id } = useParams();
  const [m, setM] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/middlemen/${id}`).then((r) => setM(r.data)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <ErrorNotice error={error} />;
  if (!m) return <div className="text-slate">Loading…</div>;

  return (
    <div className="max-w-4xl">
      <Link to="/middlemen" className="text-[13px] text-slate hover:text-ink inline-flex items-center gap-1 mb-3">
        <ArrowLeft size={13} /> Middlemen
      </Link>
      <h1 className="font-serif text-[28px] text-ink">{m.name}</h1>
      <div className="text-sm text-slate mt-0.5">{m.phone} · {m.company}</div>
      <div className="rule-brass mt-3 mb-5" />

      <StatRow
        items={[
          { label: "Clients brought", value: m.totals.client_count },
          { label: "Jobs referred", value: m.totals.job_count },
          { label: "Completed", value: m.totals.completed_jobs },
          { label: "Pending", value: m.totals.pending_jobs },
          { label: "Business value", value: money(m.totals.total_business_value) },
          { label: "Outstanding", value: money(m.totals.total_outstanding) },
        ]}
      />

      <h2 className="text-[13px] font-medium text-slate mt-6 mb-2">Clients brought</h2>
      <div className="bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate text-[12.5px] border-b border-line"><th className="p-3 font-medium">Name</th><th className="font-medium">Phone</th><th className="font-medium">Referred</th></tr></thead>
          <tbody>
            {m.clients.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="p-3"><Link className="text-ink hover:text-brass" to={`/clients/${c.id}`}>{c.name}</Link></td>
                <td className="text-slate">{c.phone}</td>
                <td className="text-slate">{shortDate(c.referral_date)}</td>
              </tr>
            ))}
            {m.clients.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-slate">None yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="text-[13px] font-medium text-slate mt-6 mb-2">Jobs referred</h2>
      <div className="bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate text-[12.5px] border-b border-line"><th className="p-3 font-medium">Job #</th><th className="font-medium">Client</th><th className="font-medium">Stage</th><th className="font-medium">Total</th><th className="font-medium">Payment</th></tr></thead>
          <tbody>
            {m.jobs.map((j) => (
              <tr key={j.id} className="border-b border-line last:border-0">
                <td className="p-3"><Link className="font-mono text-[13px] text-ink hover:text-brass" to={`/jobs/${j.id}`}>{j.job_number}</Link></td>
                <td>{j.client_name}</td>
                <td><StageBadge stage={j.current_stage} /></td>
                <td className="font-serif tabular-nums">{money(j.total_amount)}</td>
                <td><PaymentBadge status={j.payment_status} /></td>
              </tr>
            ))}
            {m.jobs.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate">None yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
