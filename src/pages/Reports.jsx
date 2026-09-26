import { useState } from "react";
import { Download } from "lucide-react";
import { api } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { TextInput, Label, Button } from "../components/Field.jsx";

const REPORTS = [
  { key: "jobs", label: "Jobs report", desc: "Every job with its stage, totals, and outstanding balance." },
  { key: "payments", label: "Payments / revenue report", desc: "Every payment recorded, with job and client." },
  { key: "middlemen", label: "Middlemen referral report", desc: "Referral counts and total business value per middleman." },
];

export default function Reports() {
  const [range, setRange] = useState({ from: "", to: "" });

  const download = async (key) => {
    const res = await api.get(`/reports/${key}`, {
      params: { from: range.from || undefined, to: range.to || undefined, format: "csv" },
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${key}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Reports" />

      <Panel className="mb-5">
        <div className="flex gap-3 items-end">
          <Label>From
            <TextInput type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
          </Label>
          <Label>To
            <TextInput type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
          </Label>
          <span className="text-[12px] text-slate pb-2">Leave blank for all time</span>
        </div>
      </Panel>

      <div className="flex flex-col gap-3">
        {REPORTS.map((r) => (
          <Panel key={r.key} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-ink">{r.label}</div>
              <div className="text-[12.5px] text-slate mt-0.5">{r.desc}</div>
            </div>
            <Button onClick={() => download(r.key)}>
              <span className="inline-flex items-center gap-1.5"><Download size={14} />CSV</span>
            </Button>
          </Panel>
        ))}
      </div>
    </div>
  );
}
