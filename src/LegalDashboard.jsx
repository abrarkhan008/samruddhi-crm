import { useState } from "react";
const S = ({ t, children }) => (
  <section className="bg-white rounded-xl shadow p-5">
    <h2 className="font-bold text-brand mb-3 border-b-2 border-gold/60 pb-1">
      {t}
    </h2>
    {children}
  </section>
);
const Bar = ({ l, v, max, c = "bg-brand" }) => (
  <div className="mb-2 text-sm">
    <div className="flex justify-between">
      <span>{l}</span>
      <b>{v}</b>
    </div>
    <div className="h-2 bg-slate-100 rounded">
      <div
        className={c + " h-2 rounded"}
        style={{ width: (v / max) * 100 + "%" }}
      />
    </div>
  </div>
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
const Tick = ({ v }) => (
  <span className={v ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
    {v ? "✔ Done" : "✘ Pending"}
  </span>
);
const TABS = [
  "Overview",
  "Court Cases",
  "Property Documents",
  "Agreements",
  "Compliance",
];
const PROJ = ["Samruddhi Heights", "Green City Plots", "Samruddhi Villas"];
const DOCS = [
  "Title Deed",
  "Encumbrance Certificate",
  "NA / Conversion Order",
  "Building Plan Approval",
  "RERA Registration",
  "Occupancy Certificate",
];
export default function LegalDashboard() {
  const [tab, setTab] = useState("Overview");
  const [cases, setCases] = useState([
    {
      no: "CS-214/2025",
      title: "Boundary dispute - Plot 22",
      court: "Civil Court",
      next: "18 Nov",
      st: "Hearing",
    },
    {
      no: "RERA-88/2026",
      title: "Delay complaint - Heights 401",
      court: "RERA Authority",
      next: "24 Nov",
      st: "Notice Sent",
    },
    {
      no: "WP-1203/2026",
      title: "Land approval writ",
      court: "High Court",
      next: "02 Dec",
      st: "Arguments",
    },
    {
      no: "CC-45/2026",
      title: "Cheque bounce - Vendor",
      court: "Magistrate",
      next: "10 Dec",
      st: "Filed",
    },
  ]);
  const [f, setF] = useState({ no: "", title: "", court: "Civil Court" });
  const [docs, setDocs] = useState(
    PROJ.map((p, i) =>
      DOCS.map((d, j) => !(i === 2 && j >= 3) && !(i === 1 && j === 5)),
    ),
  );
  const [ag, setAg] = useState(
    [
      ["Sale Agreement - Rahul Mehta", "Heights 302", "Review"],
      ["Sale Deed - Anil Kumar", "Plot 14", "Registered"],
      ["JDA - Landowner Patil", "Green City", "Draft"],
      ["Sale Agreement - Sneha Rao", "Heights 508", "Signed"],
    ].map((r, i) => ({ id: i, n: r[0], u: r[1], st: r[2] })),
  );
  const add = () => {
    if (!f.no || !f.title) return;
    setCases([{ ...f, next: "TBD", st: "Filed" }, ...cases]);
    setF({ no: "", title: "", court: "Civil Court" });
  };
  const kpis = [
    ["Active Cases", cases.length + 10],
    ["Hearings (Month)", 6],
    ["Documents Pending", docs.flat().filter((x) => !x).length],
    [
      "Agreements Pending",
      ag.filter((a) => a.st === "Draft" || a.st === "Review").length,
    ],
    ["Legal Notices", 4],
    ["RERA Projects", 3],
    ["Cases Resolved (YTD)", 21],
    ["Compliance Alerts", 3],
  ];
  const inp = "border p-2 rounded text-sm";
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-brand to-slate-800 text-white rounded-xl p-5 flex justify-between border-b-4 border-gold">
        <div>
          <h1 className="text-2xl font-bold">Legal & Advocate Dashboard</h1>
          <p className="text-gold text-sm">
            Samruddhi Groups • Cases, Documents & Agreements
          </p>
        </div>
        <span className="text-gold font-bold self-center">Legal Center</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "px-4 py-2 rounded text-sm " +
              (tab === t
                ? "bg-brand text-gold font-semibold"
                : "bg-white shadow")
            }
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <>
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
            <S t="Upcoming Hearings">
              <T
                head={["Date", "Case", "Court"]}
                rows={cases.slice(0, 4).map((c) => [c.next, c.title, c.court])}
              />
            </S>
            <S t="Cases by Type">
              <Bar l="Civil / Property" v={8} max={8} />
              <Bar l="RERA Complaints" v={5} max={8} c="bg-gold" />
              <Bar l="Consumer Court" v={3} max={8} />
              <Bar l="Criminal / Cheque Bounce" v={2} max={8} c="bg-gold" />
            </S>
            <S t="Project Legal Clearance">
              {PROJ.map((p, i) => (
                <Bar
                  key={p}
                  l={p}
                  v={docs[i].filter(Boolean).length}
                  max={6}
                  c={docs[i].every(Boolean) ? "bg-green-600" : "bg-gold"}
                />
              ))}
            </S>
            <S t="Recent Legal Activity">
              <T
                head={["Activity", "When"]}
                rows={[
                  ["Notice sent to builder - Plot 22", "Today"],
                  ["Sale deed registered - Plot 14", "Yesterday"],
                  ["RERA reply filed", "2 days ago"],
                  ["Title search ordered - Villas", "3 days ago"],
                ]}
              />
            </S>
          </div>
        </>
      )}
      {tab === "Court Cases" && (
        <S t="Court Cases">
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              className={inp}
              placeholder="Case no."
              value={f.no}
              onChange={(e) => setF({ ...f, no: e.target.value })}
            />
            <input
              className={inp}
              placeholder="Case title"
              value={f.title}
              onChange={(e) => setF({ ...f, title: e.target.value })}
            />
            <select
              className={inp}
              value={f.court}
              onChange={(e) => setF({ ...f, court: e.target.value })}
            >
              {[
                "Civil Court",
                "High Court",
                "RERA Authority",
                "Consumer Court",
                "Magistrate",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={add}
              className="bg-brand text-gold px-4 rounded text-sm"
            >
              + Add Case
            </button>
          </div>
          <T
            head={["Case No.", "Title", "Court", "Next Hearing", "Status"]}
            rows={cases.map((c) => [
              c.no,
              c.title,
              c.court,
              c.next,
              <select
                className="border rounded p-1"
                value={c.st}
                onChange={(e) =>
                  setCases(
                    cases.map((z) =>
                      z.no === c.no ? { ...z, st: e.target.value } : z,
                    ),
                  )
                }
              >
                {[
                  "Filed",
                  "Notice Sent",
                  "Hearing",
                  "Arguments",
                  "Judgment",
                  "Closed",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>,
            ])}
          />
        </S>
      )}
      {tab === "Property Documents" && (
        <S t="Property Document Checklist (click to mark done)">
          <T
            head={["Document", ...PROJ]}
            rows={DOCS.map((d, j) => [
              d,
              ...PROJ.map((p, i) => (
                <button
                  onClick={() =>
                    setDocs(
                      docs.map((r, a) =>
                        a === i ? r.map((x, b) => (b === j ? !x : x)) : r,
                      ),
                    )
                  }
                >
                  <Tick v={docs[i][j]} />
                </button>
              )),
            ])}
          />
        </S>
      )}
      {tab === "Agreements" && (
        <S t="Agreements & Registrations">
          <T
            head={["Agreement", "Unit", "Status"]}
            rows={ag.map((a) => [
              a.n,
              a.u,
              <select
                className="border rounded p-1"
                value={a.st}
                onChange={(e) =>
                  setAg(
                    ag.map((z) =>
                      z.id === a.id ? { ...z, st: e.target.value } : z,
                    ),
                  )
                }
              >
                {["Draft", "Review", "Signed", "Registered"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>,
            ])}
          />
        </S>
      )}
      {tab === "Compliance" && (
        <S t="Compliance & Reminders">
          <T
            head={["Item", "Due Date", "Status"]}
            rows={[
              ["RERA quarterly update - Heights", "30 Nov", "Pending"],
              ["RERA annual audit report", "31 Dec", "Upcoming"],
              ["Property tax payment - Green City", "15 Dec", "Pending"],
              ["Trade licence renewal", "31 Jan", "Upcoming"],
              ["Fire NOC renewal - Heights", "20 Nov", "Urgent"],
            ]}
          />
        </S>
      )}
    </div>
  );
}
