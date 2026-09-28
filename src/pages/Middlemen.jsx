import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { api, money } from "../api.js";
import { ErrorNotice } from "./Dashboard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { TextInput, Button } from "../components/Field.jsx";

export default function Middlemen() {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", company: "", notes: "" });

  const load = () => api.get("/middlemen", { params: { search } }).then((r) => setList(r.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [search]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/middlemen", form);
    setShowForm(false);
    setForm({ name: "", phone: "", company: "", notes: "" });
    load();
  };

  if (error) return <ErrorNotice error={error} />;

  return (
    <div>
      <PageHeader
        title="Middlemen"
        action={<Button onClick={() => setShowForm((s) => !s)}><span className="inline-flex items-center gap-1.5"><Plus size={15} />{showForm ? "Cancel" : "New middleman"}</span></Button>}
      />

      {showForm && (
        <Panel className="mb-5">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextInput placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextInput placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <TextInput placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button className="sm:col-span-2">Add middleman</Button>
          </form>
        </Panel>
      )}

      <TextInput placeholder="Search name, phone, company…" className="w-full sm:w-72 mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="md:hidden space-y-3">
        {list.map((m) => (
          <div key={m.id} className="bg-paper-raised border border-line rounded-[10px] p-4">
            <Link className="font-medium text-ink hover:text-brass" to={"/middlemen/" + m.id}>{m.name}</Link>
            <div className="text-slate text-sm">{m.phone}{m.company ? " · " + m.company : ""}</div>
            <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t border-line">
              <div><div className="text-slate text-[12px]">Clients</div><div className="font-serif tabular-nums">{m.client_count}</div></div>
              <div><div className="text-slate text-[12px]">Jobs</div><div className="font-serif tabular-nums">{m.job_count}</div></div>
              <div><div className="text-slate text-[12px]">Business value</div><div className="font-serif tabular-nums">{money(m.total_business_value)}</div></div>
              <div><div className="text-slate text-[12px]">Outstanding</div><div className="font-serif tabular-nums">{money(m.total_outstanding)}</div></div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="p-6 text-center text-slate">No middlemen yet.</p>}
      </div>
      <div className="hidden md:block bg-paper-raised border border-line rounded-[10px] overflow-hidden">
        <div className="table-wrap w-full overflow-x-auto">
<table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-left text-slate text-[12.5px] border-b border-line">
              <th className="p-3 font-medium">Name</th><th className="font-medium">Phone</th><th className="font-medium">Company</th><th className="font-medium">Clients</th><th className="font-medium">Jobs</th><th className="font-medium">Business value</th><th className="font-medium">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id} className="border-b border-line last:border-0 hover:bg-paper transition-colors">
                <td className="p-3"><Link className="font-medium text-ink hover:text-brass" to={`/middlemen/${m.id}`}>{m.name}</Link></td>
                <td className="text-slate">{m.phone}</td>
                <td className="text-slate">{m.company}</td>
                <td className="font-serif tabular-nums">{m.client_count}</td>
                <td className="font-serif tabular-nums">{m.job_count}</td>
                <td className="font-serif tabular-nums">{money(m.total_business_value)}</td>
                <td className="font-serif tabular-nums">{money(m.total_outstanding)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate">No middlemen yet.</td></tr>}
          </tbody>
        </table>
</div>
      </div>
    </div>
  );
}
