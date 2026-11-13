import { useState } from "react";
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
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
      <b>{inr(v)}</b>
    </div>
    <div className="h-2 bg-slate-100 rounded">
      <div
        className={c + " h-2 rounded"}
        style={{ width: Math.min((v / max) * 100, 100) + "%" }}
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
const Badge = ({ s }) => (
  <span
    className={
      "text-xs px-2 py-0.5 rounded " +
      ({
        Paid: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Overdue: "bg-red-100 text-red-700",
      }[s] || "bg-slate-100")
    }
  >
    {s}
  </span>
);
const BR = [
  "Samruddhi Tech",
  "Samruddhi Construction",
  "Samruddhi Realty",
  "Samruddhi Developers",
];
const TABS = [
  "Overview",
  "Invoices",
  "Expenses",
  "Customer Payments",
  "GST & Taxes",
];
export default function AccountsDashboard() {
  const [tab, setTab] = useState("Overview");
  const [inv, setInv] = useState(
    [
      ["INV-101", "Customer A - Heights Flat 302", 500000, "Paid"],
      ["INV-102", "Vendor B - Cement Supply", 120000, "Pending"],
      ["INV-103", "Customer C - Green City Plot 14", 850000, "Overdue"],
      ["INV-104", "Samruddhi Tech - Client XYZ", 240000, "Paid"],
      ["INV-105", "Customer D - Villa 7", 1500000, "Pending"],
    ].map((r, i) => ({ id: r[0], party: r[1], amt: r[2], st: r[3] })),
  );
  const [ex, setEx] = useState([
    {
      d: "10 Nov",
      cat: "Site Material",
      desc: "Steel & cement",
      br: BR[1],
      amt: 420000,
    },
    {
      d: "09 Nov",
      cat: "Marketing",
      desc: "Facebook & Google ads",
      br: BR[2],
      amt: 85000,
    },
    {
      d: "08 Nov",
      cat: "Salaries",
      desc: "October payroll",
      br: BR[0],
      amt: 1820000,
    },
    {
      d: "05 Nov",
      cat: "Office",
      desc: "Rent & electricity",
      br: BR[3],
      amt: 62000,
    },
  ]);
  const [f, setF] = useState({ party: "", amt: "" }),
    [g, setG] = useState({
      cat: "Site Material",
      desc: "",
      br: BR[0],
      amt: "",
    });
  const addInv = () => {
    if (!f.party || !f.amt) return;
    setInv([
      {
        id: "INV-" + (106 + inv.length - 5),
        party: f.party,
        amt: +f.amt,
        st: "Pending",
      },
      ...inv,
    ]);
    setF({ party: "", amt: "" });
  };
  const addEx = () => {
    if (!g.desc || !g.amt) return;
    setEx([{ d: "Today", ...g, amt: +g.amt }, ...ex]);
    setG({ ...g, desc: "", amt: "" });
  };
  const sum = (a, st) =>
    a.filter((x) => !st || x.st === st).reduce((s, x) => s + x.amt, 0);
  const kpis = [
    ["Revenue (Month)", "₹4.2 Cr"],
    ["Collections", "₹3.1 Cr"],
    ["Receivables Due", "₹1.9 Cr"],
    ["Expenses", "₹1.6 Cr"],
    ["Net Profit", "₹1.5 Cr"],
    ["GST Payable", "₹32 L"],
    ["Payroll (Nov)", "₹1.82 Cr"],
    ["Vendor Dues", "₹46 L"],
  ];
  const inp = "border p-2 rounded text-sm";
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-brand to-slate-800 text-white rounded-xl p-5 flex justify-between border-b-4 border-gold">
        <div>
          <h1 className="text-2xl font-bold">Accounts Dashboard</h1>
          <p className="text-gold text-sm">
            Samruddhi Groups • Income, Expenses, GST & Payments
          </p>
        </div>
        <span className="text-gold font-bold self-center">Finance Center</span>
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
            <S t="Income vs Expenses (Lakhs)">
              <div className="flex items-end gap-4 h-40">
                {[
                  ["Jun", 30, 22],
                  ["Jul", 38, 25],
                  ["Aug", 34, 24],
                  ["Sep", 45, 30],
                  ["Oct", 40, 28],
                  ["Nov", 42, 16],
                ].map((m) => (
                  <div key={m[0]} className="flex-1 text-center text-xs">
                    <div className="flex items-end justify-center gap-1 h-32">
                      <div
                        className="w-3 bg-gold"
                        style={{ height: m[1] * 2.8 }}
                      />
                      <div
                        className="w-3 bg-brand"
                        style={{ height: m[2] * 2.8 }}
                      />
                    </div>
                    {m[0]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Gold = Income • Navy = Expenses
              </p>
            </S>
            <S t="Expenses by Category">
              <Bar l="Salaries" v={1820000} max={1820000} />
              <Bar l="Site Material" v={420000} max={1820000} c="bg-gold" />
              <Bar l="Marketing" v={185000} max={1820000} />
              <Bar l="Office & Admin" v={162000} max={1820000} c="bg-gold" />
            </S>
            <S t="Bank Balances">
              <T
                head={["Account", "Balance"]}
                rows={[
                  ["HDFC Current - Realty", inr(8450000)],
                  ["SBI Current - Construction", inr(5210000)],
                  ["ICICI - Samruddhi Tech", inr(2380000)],
                  ["Petty Cash", inr(45000)],
                ]}
              />
            </S>
            <S t="Recent Transactions">
              <T
                head={["Item", "Amount"]}
                rows={ex.slice(0, 4).map((e) => [e.desc, inr(e.amt)])}
              />
            </S>
          </div>
        </>
      )}
      {tab === "Invoices" && (
        <S t="Invoices & Bills">
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            <div className="bg-green-50 p-3 rounded">
              Paid <b>{inr(sum(inv, "Paid"))}</b>
            </div>
            <div className="bg-amber-50 p-3 rounded">
              Pending <b>{inr(sum(inv, "Pending"))}</b>
            </div>
            <div className="bg-red-50 p-3 rounded">
              Overdue <b>{inr(sum(inv, "Overdue"))}</b>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              className={inp}
              placeholder="Party / description"
              value={f.party}
              onChange={(e) => setF({ ...f, party: e.target.value })}
            />
            <input
              className={inp}
              type="number"
              placeholder="Amount"
              value={f.amt}
              onChange={(e) => setF({ ...f, amt: e.target.value })}
            />
            <button
              onClick={addInv}
              className="bg-brand text-gold px-4 rounded text-sm"
            >
              + Add Invoice
            </button>
          </div>
          <T
            head={["No.", "Party", "Amount", "Status", "Change"]}
            rows={inv.map((i) => [
              i.id,
              i.party,
              inr(i.amt),
              <Badge s={i.st} />,
              <select
                className="border rounded p-1"
                value={i.st}
                onChange={(e) =>
                  setInv(
                    inv.map((z) =>
                      z.id === i.id ? { ...z, st: e.target.value } : z,
                    ),
                  )
                }
              >
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>,
            ])}
          />
        </S>
      )}
      {tab === "Expenses" && (
        <S t="Expenses">
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              className={inp}
              value={g.cat}
              onChange={(e) => setG({ ...g, cat: e.target.value })}
            >
              {[
                "Site Material",
                "Salaries",
                "Marketing",
                "Office",
                "Legal",
                "Travel",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className={inp}
              value={g.br}
              onChange={(e) => setG({ ...g, br: e.target.value })}
            >
              {BR.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <input
              className={inp}
              placeholder="Description"
              value={g.desc}
              onChange={(e) => setG({ ...g, desc: e.target.value })}
            />
            <input
              className={inp}
              type="number"
              placeholder="Amount"
              value={g.amt}
              onChange={(e) => setG({ ...g, amt: e.target.value })}
            />
            <button
              onClick={addEx}
              className="bg-brand text-gold px-4 rounded text-sm"
            >
              + Add Expense
            </button>
          </div>
          <T
            head={["Date", "Category", "Description", "Branch", "Amount"]}
            rows={ex.map((e) => [e.d, e.cat, e.desc, e.br, inr(e.amt)])}
          />
          <p className="mt-3 font-bold text-brand">Total: {inr(sum(ex))}</p>
        </S>
      )}
      {tab === "Customer Payments" && (
        <S t="Customer Installments (Flats / Plots)">
          <T
            head={[
              "Customer",
              "Unit",
              "Total",
              "Received",
              "Balance",
              "Next Due",
              "Progress",
            ]}
            rows={[
              ["Rahul Mehta", "Heights 302", 6500000, 4550000, "20 Nov"],
              ["Kavya N", "Villa 7", 12500000, 5000000, "25 Nov"],
              ["Anil Kumar", "Plot 14", 3200000, 3200000, "-"],
              ["Sneha Rao", "Heights 508", 5800000, 1740000, "30 Nov"],
            ].map((r) => [
              r[0],
              r[1],
              inr(r[2]),
              inr(r[3]),
              inr(r[2] - r[3]),
              r[4],
              <div className="w-24 h-2 bg-slate-100 rounded">
                <div
                  className="h-2 bg-gold rounded"
                  style={{ width: (r[3] / r[2]) * 100 + "%" }}
                />
              </div>,
            ])}
          />
        </S>
      )}
      {tab === "GST & Taxes" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <S t="GST Summary (Month)">
            <T
              head={["Item", "Amount"]}
              rows={[
                ["GST collected (output)", inr(1240000)],
                ["Input tax credit", inr(920000)],
                ["Net GST payable", <b>{inr(320000)}</b>],
              ]}
            />
          </S>
          <S t="Statutory Dues">
            <T
              head={["Item", "Amount", "Due Date"]}
              rows={[
                ["GSTR-3B", inr(320000), "20 Nov"],
                ["TDS", inr(185000), "07 Dec"],
                ["PF", inr(1450000), "15 Nov"],
                ["ESI", inr(210000), "15 Nov"],
                ["Professional Tax", inr(64000), "30 Nov"],
              ]}
            />
          </S>
        </div>
      )}
    </div>
  );
}
