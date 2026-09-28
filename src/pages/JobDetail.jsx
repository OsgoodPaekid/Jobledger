import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { api, money, shortDate } from "../api.js";
import { StageBadge, PaymentBadge } from "../components/StatusBadge.jsx";
import { STAGES } from "./Jobs.jsx";
import { ErrorNotice } from "./Dashboard.jsx";
import Panel from "../components/Panel.jsx";
import { TextInput, Select, Button } from "../components/Field.jsx";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [newStage, setNewStage] = useState("");
  const [stageNotes, setStageNotes] = useState("");
  const [payForm, setPayForm] = useState({ amount: "", payment_date: "", method: "Cash", reference: "", notes: "" });

  const load = () => api.get(`/jobs/${id}`).then((r) => { setJob(r.data); setNewStage(r.data.current_stage); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id]);

  const changeStage = async (e) => {
    e.preventDefault();
    await api.post(`/jobs/${id}/stage`, { stage: newStage, notes: stageNotes });
    setStageNotes("");
    load();
  };

  const addPayment = async (e) => {
    e.preventDefault();
    await api.post("/payments", { ...payForm, job_id: Number(id), amount: Number(payForm.amount) });
    setPayForm({ amount: "", payment_date: "", method: "Cash", reference: "", notes: "" });
    load();
  };

  const deletePayment = async (paymentId) => {
    await api.delete(`/payments/${paymentId}`);
    load();
  };

  if (error) return <ErrorNotice error={error} />;
  if (!job) return <div className="text-slate">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/jobs" className="text-[13px] text-slate hover:text-ink inline-flex items-center gap-1 mb-3">
        <ArrowLeft size={13} /> Jobs
      </Link>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-serif text-[28px] text-ink">{job.job_number}</h1>
        <StageBadge stage={job.current_stage} />
        <PaymentBadge status={job.payment_status} />
      </div>
      <div className="rule-brass mb-6" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Panel title="Client">
          <Link to={`/clients/${job.client_id}`} className="font-medium text-ink hover:text-brass">{job.client_name}</Link>
          <div className="text-slate text-sm mt-0.5">{job.client_phone} · {job.client_email}</div>
          {job.middleman_name && (
            <div className="text-slate text-sm mt-1.5">Referred by <Link to={`/middlemen/${job.middleman_id}`} className="text-ink hover:text-brass">{job.middleman_name}</Link></div>
          )}
        </Panel>
        <Panel title="Job info">
          <div className="text-sm space-y-0.5">
            <div>{job.license_type}</div>
            <div className="text-slate">Received {shortDate(job.date_received)}</div>
            <div className="text-slate">Expected {shortDate(job.expected_completion_date)}</div>
            <div className="text-slate">Completed {shortDate(job.actual_completion_date)}</div>
          </div>
          {job.description && <div className="mt-2 text-sm text-slate border-t border-line pt-2">{job.description}</div>}
        </Panel>
        <Panel title="Money">
          <div className="flex items-baseline justify-between text-sm py-0.5"><span className="text-slate">Total</span><span className="font-serif tabular-nums">{money(job.total_amount)}</span></div>
          <div className="flex items-baseline justify-between text-sm py-0.5"><span className="text-slate">Paid</span><span className="font-serif tabular-nums">{money(job.total_paid)}</span></div>
          <div className="flex items-baseline justify-between text-sm py-0.5 border-t border-line mt-1 pt-1.5"><span className="text-ink font-medium">Outstanding</span><span className="font-serif tabular-nums text-[17px]">{money(job.outstanding_balance)}</span></div>
        </Panel>
        <Panel title="Move stage">
          <form onSubmit={changeStage} className="flex flex-col gap-2">
            <Select value={newStage} onChange={(e) => setNewStage(e.target.value)}>
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <TextInput placeholder="Notes (optional)" value={stageNotes} onChange={(e) => setStageNotes(e.target.value)} />
            <Button type="submit">Update stage</Button>
          </form>
        </Panel>
      </div>

      <Panel title="Stage history" className="mb-6">
        <ol className="border-l border-line ml-1 space-y-4">
          {job.stage_history.map((h) => (
            <li key={h.id} className="pl-4 relative">
              <span className="absolute -left-[4.5px] top-1.5 w-[7px] h-[7px] rounded-full bg-brass" />
              <div className="text-sm font-medium text-ink">{h.stage}</div>
              <div className="text-[12px] text-slate">{new Date(h.changed_at).toLocaleString()}</div>
              {h.notes && <div className="text-[13px] text-slate mt-0.5">{h.notes}</div>}
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Payments">
        <form onSubmit={addPayment} className="grid grid-cols-2 gap-2 mb-5">
          <TextInput required type="number" step="0.01" placeholder="Amount" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
          <TextInput type="date" value={payForm.payment_date} onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })} />
          <Select value={payForm.method} onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}>
            <option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Other</option>
          </Select>
          <TextInput placeholder="Reference" value={payForm.reference} onChange={(e) => setPayForm({ ...payForm, reference: e.target.value })} />
          <TextInput placeholder="Notes" className="col-span-2" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} />
          <Button className="col-span-2" type="submit">Record payment</Button>
        </form>
        <div className="table-wrap w-full overflow-x-auto">
<table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-slate text-[12.5px] border-b border-line">
              <th className="font-medium pb-2">Date</th><th className="font-medium">Amount</th><th className="font-medium">Method</th><th className="font-medium">Reference</th><th></th>
            </tr>
          </thead>
          <tbody>
            {job.payments.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="py-2 text-slate">{shortDate(p.payment_date)}</td>
                <td className="font-serif tabular-nums">{money(p.amount)}</td>
                <td>{p.method}</td>
                <td className="text-slate">{p.reference}</td>
                <td className="text-right"><button onClick={() => deletePayment(p.id)} className="text-rust/70 hover:text-rust"><Trash2 size={14} /></button></td>
              </tr>
            ))}
            {job.payments.length === 0 && <tr><td colSpan={5} className="text-center text-slate py-4">No payments yet.</td></tr>}
          </tbody>
        </table>
</div>
      </Panel>
    </div>
  );
}
