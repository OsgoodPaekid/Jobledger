import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { api, money, shortDate } from "../api.js";
import { StageBadge, PaymentBadge } from "../components/StatusBadge.jsx";
import { ErrorNotice } from "./Dashboard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { TextInput, Select, TextArea, Label, Button } from "../components/Field.jsx";

const STAGES = [
  "New / Not Started", "Documents Received", "Documents Being Processed",
  "Application Submitted", "Awaiting Approval", "Approved",
  "Ready for Collection", "Completed", "On Hold", "Cancelled",
];
const PAYMENT_STATUSES = ["Unpaid", "Partially Paid", "Fully Paid"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: "", stage: "", payment_status: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_id: "", license_type: "", total_amount: "", date_received: "", expected_completion_date: "", description: "" });

  const load = () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    api.get("/jobs", { params }).then((r) => setJobs(r.data)).catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, [filters]);
  useEffect(() => { api.get("/clients").then((r) => setClients(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/jobs", { ...form, client_id: Number(form.client_id), total_amount: Number(form.total_amount) || 0 });
    setShowForm(false);
    setForm({ client_id: "", license_type: "", total_amount: "", date_received: "", expected_completion_date: "", description: "" });
    load();
  };

  const removeJob = async (id, job_number) => {
    if (!window.confirm(`Delete job #${job_number}? This cannot be undone.`)) return;
    await api.delete(`/jobs/${id}`);
    load();
  };

  if (error) return <ErrorNotice error={error} />;

  return (
    <div>
      <PageHeader
        title="Jobs"
        action={<Button onClick={() => setShowForm((s) => !s)}><span className="inline-flex items-center gap-1.5"><Plus size={15} />{showForm ? "Cancel" : "New job"}</span></Button>}
      />

      {showForm && (
        <Panel className="mb-5">
          <form onSubmit={submit} className="grid grid-cols-2 gap-3">
            <Select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
              <option value="">Select client…</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <TextInput required placeholder="License / job type" value={form.license_type} onChange={(e) => setForm({ ...form, license_type: e.target.value })} />
            <TextInput type="number" step="0.01" placeholder="Total amount" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} />
            <Label>Date received
              <TextInput type="date" value={form.date_received} onChange={(e) => setForm({ ...form, date_received: e.target.value })} />
            </Label>
            <Label>Expected completion
              <TextInput type="date" value={form.expected_completion_date} onChange={(e) => setForm({ ...form, expected_completion_date: e.target.value })} />
            </Label>
            <TextArea placeholder="Notes / description" className="col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button className="col-span-2">Create job</Button>
          </form>
        </Panel>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <TextInput placeholder="Search client, phone, job #…" className="w-64" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <Select value={filters.stage} onChange={(e) => setFilters({ ...filters, stage: e.target.value })}>
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={filters.payment_status} onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}>
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <div className="bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <div className="table-wrap">
<table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate text-[12.5px] border-b border-line">
              <th className="p-3 font-medium">Job #</th><th className="font-medium">Client</th><th className="font-medium">Type</th><th className="font-medium">Stage</th>
              <th className="font-medium">Total</th><th className="font-medium">Outstanding</th><th className="font-medium">Payment</th><th className="font-medium">Received</th><th className="font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3"><Link className="font-mono text-[13px] text-ink hover:text-brass" to={`/jobs/${j.id}`}>{j.job_number}</Link></td>
                <td>{j.client_name}</td>
                <td className="text-slate">{j.license_type}</td>
                <td><StageBadge stage={j.current_stage} /></td>
                <td className="font-serif tabular-nums">{money(j.total_amount)}</td>
                <td className="font-serif tabular-nums">{money(j.outstanding_balance)}</td>
                <td><PaymentBadge status={j.payment_status} /></td>
                <td className="text-slate">{shortDate(j.date_received)}</td>
                <td className="text-right pr-3">
                  <button onClick={() => removeJob(j.id, j.job_number)} className="text-rust/70 hover:text-rust" title="Delete job">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-slate">No jobs match these filters yet.</td></tr>}
          </tbody>
        </table>
</div>
      </div>
    </div>
  );
}

export { STAGES, PAYMENT_STATUSES };
