import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../api.js";
import { ErrorNotice } from "./Dashboard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { TextInput, Select, Button } from "../components/Field.jsx";

const emptyForm = { name: "", phone: "", email: "", address: "", middleman_id: "", referral_notes: "" };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [middlemen, setMiddlemen] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get("/clients", { params: { search } }).then((r) => setClients(r.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [search]);
  useEffect(() => { api.get("/middlemen").then((r) => setMiddlemen(r.data)); }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      middleman_id: c.middleman_id || "",
      referral_notes: c.referral_notes || "",
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, middleman_id: form.middleman_id || null };
    if (editingId) {
      await api.put(`/clients/${editingId}`, payload);
    } else {
      await api.post("/clients", payload);
    }
    cancelForm();
    load();
  };

  const removeClient = async (id, name) => {
    if (!window.confirm(`Delete client "${name}"? This cannot be undone.`)) return;
    await api.delete(`/clients/${id}`);
    load();
  };

  if (error) return <ErrorNotice error={error} />;

  return (
    <div>
      <PageHeader
        title="Clients"
        action={<Button onClick={() => (showForm ? cancelForm() : startCreate())}><span className="inline-flex items-center gap-1.5"><Plus size={15} />{showForm ? "Cancel" : "New client"}</span></Button>}
      />

      {showForm && (
        <Panel className="mb-5">
          <form onSubmit={submit} className="grid grid-cols-2 gap-3">
            <TextInput required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextInput placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextInput placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextInput placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Select value={form.middleman_id} onChange={(e) => setForm({ ...form, middleman_id: e.target.value })}>
              <option value="">No middleman / referrer</option>
              {middlemen.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </Select>
            <TextInput placeholder="How were they referred?" value={form.referral_notes} onChange={(e) => setForm({ ...form, referral_notes: e.target.value })} />
            <Button className="col-span-2">{editingId ? "Save changes" : "Add client"}</Button>
          </form>
        </Panel>
      )}

      <TextInput placeholder="Search name, phone, email…" className="w-72 mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate text-[12.5px] border-b border-line">
              <th className="p-3 font-medium">Name</th><th className="font-medium">Phone</th><th className="font-medium">Email</th><th className="font-medium">Referred by</th><th className="font-medium">Jobs</th><th className="font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3"><Link className="font-medium text-ink hover:text-brass" to={`/clients/${c.id}`}>{c.name}</Link></td>
                <td className="text-slate">{c.phone}</td>
                <td className="text-slate">{c.email}</td>
                <td>{c.middleman_name || "—"}</td>
                <td className="font-serif tabular-nums">{c.job_count}</td>
                <td className="text-right pr-3">
                  <div className="inline-flex items-center gap-2.5">
                    <button onClick={() => startEdit(c)} className="text-slate hover:text-ink" title="Edit client">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => removeClient(c.id, c.name)} className="text-rust/70 hover:text-rust" title="Delete client">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate">No clients found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
