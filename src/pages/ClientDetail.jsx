import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api, money, shortDate } from "../api.js";
import { StageBadge, PaymentBadge } from "../components/StatusBadge.jsx";
import { ErrorNotice } from "./Dashboard.jsx";
import Panel from "../components/Panel.jsx";

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/clients/${id}`).then((r) => setClient(r.data)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <ErrorNotice error={error} />;
  if (!client) return <div className="text-slate">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/clients" className="text-[13px] text-slate hover:text-ink inline-flex items-center gap-1 mb-3">
        <ArrowLeft size={13} /> Clients
      </Link>
      <h1 className="font-serif text-[28px] text-ink">{client.name}</h1>
      <div className="rule-brass mt-3 mb-5" />

      <Panel className="mb-6">
        <div className="text-sm space-y-1">
          <div><span className="text-slate">Phone</span> · {client.phone || "—"}</div>
          <div><span className="text-slate">Email</span> · {client.email || "—"}</div>
          <div><span className="text-slate">Address</span> · {client.address || "—"}</div>
          {client.middleman_name && (
            <div><span className="text-slate">Referred by</span> · <Link className="text-ink hover:text-brass" to={`/middlemen/${client.middleman_id}`}>{client.middleman_name}</Link></div>
          )}
        </div>
      </Panel>

      <h2 className="text-[13px] font-medium text-slate mb-2">Jobs</h2>
      <div className="bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate text-[12.5px] border-b border-line">
              <th className="p-3 font-medium">Job #</th><th className="font-medium">Type</th><th className="font-medium">Stage</th><th className="font-medium">Total</th><th className="font-medium">Outstanding</th><th className="font-medium">Payment</th><th className="font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {client.jobs.map((j) => (
              <tr key={j.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3"><Link className="font-mono text-[13px] text-ink hover:text-brass" to={`/jobs/${j.id}`}>{j.job_number}</Link></td>
                <td className="text-slate">{j.license_type}</td>
                <td><StageBadge stage={j.current_stage} /></td>
                <td className="font-serif tabular-nums">{money(j.total_amount)}</td>
                <td className="font-serif tabular-nums">{money(j.outstanding_balance)}</td>
                <td><PaymentBadge status={j.payment_status} /></td>
                <td className="text-slate">{shortDate(j.date_received)}</td>
              </tr>
            ))}
            {client.jobs.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate">No jobs yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
