import { useState } from "react";
const S = ({ t, children }) => (
  <section className="bg-white rounded-xl shadow p-5">
    <h2 className="font-bold text-brand mb-3 border-b-2 border-gold/60 pb-1">
      {t}
    </h2>
    {children}
  </section>
);
const Bar = ({ l, v, max, c = "bg-brand", suffix = "" }) => (
  <div className="mb-2 text-sm">
    <div className="flex justify-between">
      <span>{l}</span>
      <b>
        {v}
        {suffix}
      </b>
    </div>
    <div className="h-2 bg-slate-100 rounded">
      <div
        className={c + " h-2 rounded"}
        style={{ width: Math.min((v / max) * 100, 100) + "%" }}
      />
    </div>
  </div>
);
const L = ({ rows }) => (
  <ul className="text-sm divide-y">
    {rows.map((r, i) => (
      <li key={i} className="py-2 flex justify-between gap-2">
        <span>{r[0]}</span>
        <span className="text-gray-500 whitespace-nowrap">{r[1]}</span>
      </li>
    ))}
  </ul>
);
const T = ({ head, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-left text-gray-500">
        <tr>
          {head.map((h) => (
            <th key={h} className="py-1 pr-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t">
            {r.map((c, j) => (
              <td key={j} className="py-2 pr-3">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const STAGES = [
  "New",
  "Contacted",
  "Site Visit",
  "Negotiation",
  "Booked",
  "Lost",
];
const START = [
  ["Rahul Mehta", "98450 xxxxx", "Samruddhi Heights", "Facebook", "Site Visit"],
  ["Sneha Rao", "99020 xxxxx", "Green City Plots", "Google", "New"],
  ["Imran Khan", "98860 xxxxx", "Samruddhi Villas", "Walk-in", "Negotiation"],
  ["Kavya N", "97410 xxxxx", "Samruddhi Heights", "Referral", "Booked"],
  ["Anil Kumar", "98800 xxxxx", "Green City Plots", "Housing.com", "Contacted"],
  ["Pooja S", "99160 xxxxx", "Samruddhi Villas", "Facebook", "New"],
];
const months = [
  ["Jun", 8],
  ["Jul", 12],
  ["Aug", 10],
  ["Sep", 16],
  ["Oct", 14],
  ["Nov", 11],
];
export default function SalesDashboard() {
  const [leads, setLeads] = useState(
    START.map((l, i) => ({
      id: i,
      n: l[0],
      p: l[1],
      pr: l[2],
      src: l[3],
      st: l[4],
    })),
  );
  const [q, setQ] = useState("");
  const shown = leads.filter((l) =>
    (l.n + l.pr).toLowerCase().includes(q.toLowerCase()),
  );
  const kpis = [
    ["Total Leads", 482],
    ["New Leads Today", 18],
    ["Site Visits Today", 9],
    ["Bookings (Month)", 11],
    ["Sales Value", "₹6.8 Cr"],
    ["Conversion Rate", "7.4%"],
    ["Follow-ups Due", 26],
    ["Target Achieved", "72%"],
  ];
  const pipe = [
    ["New", 482],
    ["Contacted", 360],
    ["Site Visit", 140],
    ["Negotiation", 52],
    ["Booked", 36],
  ];
  const src = [
    ["Facebook / Instagram", 160],
    ["Google Ads", 110],
    ["Walk-in", 70],
    ["Referral", 65],
    ["Housing / 99acres", 77],
  ];
  const team = [
    ["Samruddhi Realty", 85, 100],
    ["Samruddhi Developers", 72, 100],
    ["Samruddhi Construction", 64, 100],
    ["Samruddhi Tech", 90, 100],
  ];
  const proj = [
    ["Samruddhi Heights", 120, 78],
    ["Green City Plots", 200, 134],
    ["Samruddhi Villas", 40, 19],
  ];
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-brand to-slate-800 text-white rounded-xl p-5 flex justify-between border-b-4 border-gold">
        <div>
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <p className="text-gold text-sm">
            Samruddhi Groups • Leads, Site Visits & Bookings
          </p>
        </div>
        <span className="text-gold font-bold self-center">
          Sales Command Center
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k[0]}
            className="bg-white rounded-xl shadow p-4 border-l-4 border-gold"
          >
            <p className="text-xs text-gray-500">{k[0]}</p>
            <p className="text-2xl font-bold text-brand">{k[1]}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <S t="Lead Pipeline">
          {pipe.map((p, i) => (
            <div
              key={p[0]}
              className="mb-1 mx-auto text-white text-sm text-center py-1 rounded bg-brand"
              style={{ width: 100 - i * 14 + "%", opacity: 1 - i * 0.12 }}
            >
              {p[0]}: {p[1]}
            </div>
          ))}
        </S>
        <S t="Lead Sources">
          {src.map((s) => (
            <Bar key={s[0]} l={s[0]} v={s[1]} max={160} c="bg-gold" />
          ))}
        </S>
        <S t="Target vs Achieved (by Branch)">
          {team.map((t) => (
            <Bar key={t[0]} l={t[0]} v={t[1]} max={t[2]} suffix="%" />
          ))}
        </S>
        <S t="Monthly Bookings">
          <div className="flex items-end gap-3 h-36">
            {months.map((m) => (
              <div key={m[0]} className="flex-1 text-center text-xs">
                <div
                  className="bg-gold rounded-t"
                  style={{ height: m[1] * 8 }}
                />
                {m[0]}
                <br />
                <b>{m[1]}</b>
              </div>
            ))}
          </div>
        </S>
        <S t="Project-wise Sales">
          <T
            head={["Project", "Total Units", "Sold", "Available"]}
            rows={proj.map((p) => [p[0], p[1], p[2], p[1] - p[2]])}
          />
        </S>
        <S t="Top Performers">
          <T
            head={["Executive", "Bookings", "Value"]}
            rows={[
              ["Arjun R", 5, "₹2.1 Cr"],
              ["Meena K", 4, "₹1.7 Cr"],
              ["Vijay S", 3, "₹1.2 Cr"],
              ["Divya N", 2, "₹0.9 Cr"],
            ]}
          />
        </S>
        <S t="Today's Follow-ups">
          <T
            head={["Client", "Time", "Task"]}
            rows={[
              ["Rahul Mehta", "11:00", "Call - site visit feedback"],
              ["Anil Kumar", "12:30", "Send brochure"],
              ["Sneha Rao", "15:00", "Call - budget discussion"],
              ["Pooja S", "17:00", "Book site visit"],
            ]}
          />
        </S>
        <S t="Site Visits Scheduled">
          <T
            head={["Client", "Project", "When"]}
            rows={[
              ["Imran Khan", "Samruddhi Villas", "Today 10:30"],
              ["Kavya N", "Samruddhi Heights", "Today 14:00"],
              ["Anil Kumar", "Green City Plots", "Tomorrow 11:00"],
            ]}
          />
        </S>
      </div>
      <S t="Lead Management (change stage using the dropdown)">
        <input
          className="border p-2 rounded mb-3 text-sm"
          placeholder="Search name / project"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <T
          head={["Name", "Phone", "Project", "Source", "Stage"]}
          rows={shown.map((l) => [
            l.n,
            l.p,
            l.pr,
            l.src,
            <select
              className="border rounded p-1"
              value={l.st}
              onChange={(e) =>
                setLeads(
                  leads.map((z) =>
                    z.id === l.id ? { ...z, st: e.target.value } : z,
                  ),
                )
              }
            >
              {STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>,
          ])}
        />
      </S>
      <div className="grid lg:grid-cols-2 gap-5">
        <S t="Incentives (This Month)">
          <L
            rows={[
              ["Total incentive pool", "₹8.4 L"],
              ["Approved", "₹5.2 L"],
              ["Pending approval", "₹3.2 L"],
              ["Top earner: Arjun R", "₹1.1 L"],
            ]}
          />
        </S>
        <S t="Notifications">
          <L
            rows={[
              ["🔔 Site visit in 30 minutes", "Today"],
              ["🏆 Monthly target 72% done", "Update"],
              ["📄 Booking agreement pending: Kavya N", "Today"],
              ["🎂 Birthday: Vijay S", "Today"],
            ]}
          />
        </S>
      </div>
    </div>
  );
}
