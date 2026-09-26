import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { TextInput, Button } from "../components/Field.jsx";

export default function Settings() {
  const [stages, setStages] = useState([]);
  const [name, setName] = useState("");

  const load = () => api.get("/stages").then((r) => setStages(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/stages", { name: name.trim(), sort_order: stages.length + 1 });
    setName("");
    load();
  };

  const remove = async (id) => { await api.delete(`/stages/${id}`); load(); };

  return (
    <div className="max-w-lg">
      <PageHeader title="Settings" />
      <Panel title="Job stages">
        <p className="text-[13px] text-slate mb-3 -mt-1">
          These are the stages a job can move through. Add your own — a job's stage
          is just a label, so anything you add here works immediately on the Jobs page.
        </p>
        <ul className="mb-3">
          {stages.map((s) => (
            <li key={s.id} className="flex justify-between items-center text-sm border-b border-line py-2 last:border-0">
              <span>{s.name}</span>
              <button onClick={() => remove(s.id)} className="text-rust/70 hover:text-rust"><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
        <form onSubmit={add} className="flex gap-2">
          <TextInput placeholder="New stage name" className="flex-1" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
      </Panel>
    </div>
  );
}
