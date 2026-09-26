import { useEffect, useState } from "react";
import { api, money } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import Panel from "../components/Panel.jsx";
import { HeroStat, StatRow } from "../components/Stat.jsx";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";

const tickStyle = { fontSize: 11, fontFamily: "IBM Plex Sans, sans-serif", fill: "#626C7A" };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorNotice error={error} />;
  if (!data) return <div className="text-slate">Loading…</div>;

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-6 mb-6">
        <Panel className="flex flex-col justify-center">
          <HeroStat
            label="Total outstanding"
            value={money(data.total_outstanding)}
            sub={`${data.unpaid} unpaid · ${data.partially_paid} partially paid`}
          />
        </Panel>
        <div className="flex flex-col gap-3 justify-center">
          <StatRow
            items={[
              { label: "Total jobs", value: data.total_jobs },
              { label: "Not started", value: data.not_started },
              { label: "In progress", value: data.in_progress },
              { label: "Completed", value: data.completed },
              { label: "On hold", value: data.on_hold },
            ]}
          />
          <StatRow
            items={[
              { label: "Clients", value: data.client_count },
              { label: "Middlemen", value: data.middleman_count },
              { label: "Expected", value: money(data.total_expected) },
              { label: "Collected", value: money(data.total_collected) },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel title="Jobs by stage">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.jobs_by_stage} margin={{ left: -20 }}>
              <XAxis dataKey="stage" tick={tickStyle} interval={0} angle={-30} textAnchor="end" height={70} axisLine={{ stroke: "#E1DCCC" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={tickStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: 13, borderRadius: 8, border: "1px solid #E1DCCC" }} />
              <Bar dataKey="count" fill="#16213A" radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Monthly collections">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.monthly_collections} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E1DCCC" vertical={false} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={{ stroke: "#E1DCCC" }} tickLine={false} />
              <YAxis tickFormatter={(v) => money(v)} width={78} tick={tickStyle} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => money(v)} contentStyle={{ fontFamily: "IBM Plex Sans, sans-serif", fontSize: 13, borderRadius: 8, border: "1px solid #E1DCCC" }} />
              <Line type="monotone" dataKey="total" stroke="#AD7A2C" strokeWidth={2.5} dot={{ r: 3, fill: "#AD7A2C" }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Top middlemen by business value">
        <table className="w-full text-sm">
          <tbody>
            {data.top_middlemen.map((m, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                <td className="py-2.5 text-ink">{m.name}</td>
                <td className="py-2.5 text-slate text-right w-24">{m.job_count} jobs</td>
                <td className="py-2.5 text-right font-serif tabular-nums w-32">{money(m.total_value)}</td>
              </tr>
            ))}
            {data.top_middlemen.length === 0 && (
              <tr><td className="py-4 text-center text-slate">No referrals recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

export function ErrorNotice({ error }) {
  return (
    <div className="bg-rust-tint border border-rust/20 text-rust rounded-[10px] p-4 text-sm">
      Couldn't reach the backend: {error}. Make sure the backend server is running and DATABASE_URL is set.
    </div>
  );
}
