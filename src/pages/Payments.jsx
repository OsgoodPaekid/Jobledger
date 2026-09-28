import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money, shortDate } from "../api.js";
import { ErrorNotice } from "./Dashboard.jsx";
import PageHeader from "../components/PageHeader.jsx";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/payments").then((r) => setPayments(r.data)).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorNotice error={error} />;

  return (
    <div>
      <PageHeader title="Payments" />
      <div className="md:hidden space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="bg-paper-raised border border-line rounded-[10px] p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link className="font-mono text-[13px] text-ink hover:text-brass" to={"/jobs/" + p.job_id}>#{p.job_number}</Link>
              <span className="text-slate text-sm">{shortDate(p.payment_date)}</span>
            </div>
            <div className="font-medium">{p.client_name}</div>
            <div className="font-serif tabular-nums text-lg mt-1">{money(p.amount)}</div>
            <div className="text-slate text-sm mt-2">{p.method}{p.reference ? " · " + p.reference : ""}</div>
          </div>
        ))}
        {payments.length === 0 && <p className="p-6 text-center text-slate">No payments recorded yet.</p>}
      </div>
      <div className="hidden md:block bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <div className="table-wrap">
<table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate text-[12.5px] border-b border-line">
              <th className="p-3 font-medium">Date</th><th className="font-medium">Job #</th><th className="font-medium">Client</th><th className="font-medium">Amount</th><th className="font-medium">Method</th><th className="font-medium">Reference</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3 text-slate">{shortDate(p.payment_date)}</td>
                <td><Link className="font-mono text-[13px] text-ink hover:text-brass" to={`/jobs/${p.job_id}`}>{p.job_number}</Link></td>
                <td>{p.client_name}</td>
                <td className="font-serif tabular-nums">{money(p.amount)}</td>
                <td>{p.method}</td>
                <td className="text-slate">{p.reference}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate">No payments recorded yet.</td></tr>}
          </tbody>
        </table>
</div>
      </div>
    </div>
  );
}
