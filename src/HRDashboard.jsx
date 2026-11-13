import { useState, useEffect, useMemo } from "react";
import { BRANCHES, EMPLOYEES, payslip } from "./data.js";

/* ---------------- helpers ---------------- */
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (local)
const monthLabel = new Date().toLocaleString("en-IN", {
  month: "long",
  year: "numeric",
});
const NAVY = "#0B1F3A";
const DEPTS = [
  "HR",
  "Accounts",
  "Sales",
  "Front Office",
  "Site Engineer",
  "IT",
  "Marketing",
];
const LEAVE_TYPES = ["Casual", "Sick", "Earned", "Maternity", "Unpaid"];
const STAGES = ["Applied", "Screening", "Interview", "Offer", "Joined"];

const useLocal = (k, init) => {
  const [v, s] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(k)) || init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  }, [k, v]);
  return [v, s];
};

const seedEmps = () =>
  EMPLOYEES.map((e, i) => ({
    ...e,
    phone: "98" + String(10000000 + ((i * 7919) % 89999999)),
    joined: `202${2 + (i % 4)}-0${1 + (i % 9)}-1${i % 9}`,
    status: "P",
  }));

/* ---------------- tiny UI kit ---------------- */
const Panel = ({ t, right, children, className = "" }) => (
  <section
    className={
      "bg-white rounded-2xl border border-slate-100 shadow-[0_12px_32px_-16px_rgba(11,31,58,.25)] p-4 sm:p-5 " +
      className
    }
  >
    {(t || right) && (
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="font-bold text-[#0B1F3A]">{t}</h2>
        {right}
      </div>
    )}
    {children}
  </section>
);
const Kpi = ({ l, v, icon, tone = "#C9971C", sub }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow p-4 hover:-translate-y-1 hover:shadow-xl transition">
    <div
      className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
      style={{ background: tone }}
    />
    <div className="flex items-center justify-between">
      <p className="text-xs text-slate-500">{l}</p>
      <span className="text-lg">{icon}</span>
    </div>
    <p className="text-2xl font-extrabold mt-1" style={{ color: NAVY }}>
      {v}
    </p>
    {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
  </div>
);
const Bar = ({ l, v, max, c = NAVY }) => (
  <div className="mb-3 text-sm">
    <div className="flex justify-between mb-1">
      <span className="text-slate-600">{l}</span>
      <b>{v}</b>
    </div>
    <div className="h-2 bg-slate-100 rounded-full">
      <div
        className="h-2 rounded-full"
        style={{
          width: Math.min((v / (max || 1)) * 100, 100) + "%",
          background: c,
        }}
      />
    </div>
  </div>
);
const Pill = ({ s }) => {
  const m = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    P: "bg-green-100 text-green-700",
    A: "bg-red-100 text-red-700",
    L: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={
        "text-xs px-2.5 py-1 rounded-full font-medium " +
        (m[s] || "bg-slate-100 text-slate-600")
      }
    >
      {s}
    </span>
  );
};
const Avatar = ({ name }) => (
  <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#E6C36A] to-[#C9971C] grid place-items-center font-bold text-[#0B1F3A] text-sm">
    {(name || "?")[0]}
  </span>
);
const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
    onClick={onClose}
  >
    <div
      className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 max-h-[92vh] overflow-y-auto fade-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4 no-print">
        <h3 className="font-bold text-lg text-[#0B1F3A]">{title}</h3>
        <button
          onClick={onClose}
          className="text-3xl leading-none text-slate-400"
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);
const Field = ({ label, children }) => (
  <label className="block text-sm text-slate-600">
    <span className="block mb-1">{label}</span>
    {children}
  </label>
);
const inp = "border border-slate-200 p-2.5 rounded-xl text-sm w-full bg-white";
const btnGold = "btn-gold px-4 py-2.5 rounded-xl text-sm";
const btnNavy = "btn-navy px-4 py-2.5 rounded-xl text-sm";
const Pager = ({ page, pages, set }) => (
  <div className="flex items-center justify-center gap-3 mt-4 text-sm">
    <button
      disabled={page === 0}
      onClick={() => set(page - 1)}
      className="border px-3 py-1.5 rounded-lg disabled:opacity-40"
    >
      ‹ Prev
    </button>
    <span className="text-slate-500">
      {page + 1} / {pages}
    </span>
    <button
      disabled={page + 1 >= pages}
      onClick={() => set(page + 1)}
      className="border px-3 py-1.5 rounded-lg disabled:opacity-40"
    >
      Next ›
    </button>
  </div>
);
const download = (name, rows) => {
  const t = rows
    .map((r) =>
      r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(","),
    )
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" }));
  a.download = name;
  a.click();
};

/* ======================================================= */
export default function HRDashboard() {
  const TABS = [
    ["Dashboard", "▦"],
    ["Employees", "👥"],
    ["Attendance", "🗓"],
    ["Leave", "🏖"],
    ["Payroll", "💳"],
    ["Recruitment", "🧲"],
  ];
  const [tab, setTab] = useState("Dashboard");
  const [emps, setEmps] = useLocal("sg_hr_emps", seedEmps());
  const [att, setAtt] = useLocal("sg_hr_att", {});
  const [leaves, setLeaves] = useLocal("sg_hr_leaves", [
    {
      id: 1,
      emp: "SG0004",
      name: "Priya S",
      type: "Casual",
      from: "2026-11-14",
      to: "2026-11-15",
      reason: "Family function",
      st: "Pending",
    },
    {
      id: 2,
      emp: "SG0010",
      name: "Latha K",
      type: "Sick",
      from: "2026-11-13",
      to: "2026-11-13",
      reason: "Fever",
      st: "Pending",
    },
    {
      id: 3,
      emp: "SG0007",
      name: "Arun R",
      type: "Earned",
      from: "2026-11-20",
      to: "2026-11-24",
      reason: "Vacation",
      st: "Approved",
    },
  ]);
  const [cands, setCands] = useLocal("sg_hr_cands", [
    { id: 1, name: "Rohit S", role: "Sales Executive", stage: "Interview" },
    { id: 2, name: "Neha P", role: "CRM Executive", stage: "Screening" },
    { id: 3, name: "Ajay K", role: "Site Engineer", stage: "Applied" },
    { id: 4, name: "Sana M", role: "Relationship Manager", stage: "Offer" },
    { id: 5, name: "Arjun R", role: "Sales Executive", stage: "Joined" },
    { id: 6, name: "Divya T", role: "Telecaller", stage: "Applied" },
  ]);

  const reset = () => {
    if (!window.confirm("Reset all HRMS demo data?")) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith("sg_hr_"))
      .forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl p-5 sm:p-7 text-white relative overflow-hidden bg-gradient-to-r from-[#0B1F3A] to-[#1b3a66]">
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-[#C9971C]/25 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[#E6C36A] text-xs tracking-widest uppercase">
              Samruddhi Groups • HRMS
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Human Resource Management
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Employees · Attendance · Leave · Payroll · Hiring
            </p>
          </div>
          <button
            onClick={reset}
            className="text-xs border border-[#E6C36A]/60 text-[#E6C36A] px-3 py-1.5 rounded-full"
          >
            Reset demo data
          </button>
        </div>
      </div>

      {/* Tabs (scrollable on mobile) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map(([t, ic]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "shrink-0 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 " +
              (tab === t
                ? "btn-navy shadow-lg"
                : "bg-white border border-slate-100 shadow-sm text-slate-600")
            }
          >
            <span>{ic}</span>
            {t}
            {t === "Leave" && leaves.some((l) => l.st === "Pending") && (
              <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5">
                {leaves.filter((l) => l.st === "Pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Dashboard" && (
        <Overview emps={emps} att={att} leaves={leaves} cands={cands} go={setTab} />
      )}
      {tab === "Employees" && <Employees emps={emps} setEmps={setEmps} />}
      {tab === "Attendance" && (
        <Attendance emps={emps} att={att} setAtt={setAtt} />
      )}
      {tab === "Leave" && (
        <Leave emps={emps} leaves={leaves} setLeaves={setLeaves} />
      )}
      {tab === "Payroll" && <Payroll emps={emps} />}
      {tab === "Recruitment" && <Recruitment cands={cands} setCands={setCands} />}
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ emps, att, leaves, cands, go }) {
  const d = att[today()] || {};
  const st = (e) => d[e.id] || "P";
  const present = emps.filter((e) => st(e) === "P").length;
  const absent = emps.filter((e) => st(e) === "A").length;
  const onLeave = emps.filter((e) => st(e) === "L").length;
  const total = emps.length || 1;
  const pp = (present / total) * 100,
    ap = (absent / total) * 100;
  const payroll = emps.reduce((s, e) => s + Number(e.salary), 0);
  const by = (k) =>
    emps.reduce((o, e) => ((o[e[k]] = (o[e[k]] || 0) + 1), o), {});
  const bD = by("dept"),
    bB = by("branch");
  const pending = leaves.filter((l) => l.st === "Pending");
  const hiring = [
    ["Jun", 12],
    ["Jul", 18],
    ["Aug", 15],
    ["Sep", 22],
    ["Oct", 19],
    ["Nov", 14],
  ];
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi l="Total Employees" v={emps.length} icon="👥" sub="across 4 branches" />
        <Kpi l="Present Today" v={present} icon="✅" tone="#16a34a" />
        <Kpi l="On Leave / Absent" v={onLeave + absent} icon="🏖" tone="#dc2626" />
        <Kpi l="Monthly Payroll" v={inr(payroll)} icon="💳" />
        <Kpi l="Pending Leaves" v={pending.length} icon="⏳" tone="#f59e0b" />
        <Kpi
          l="Open Candidates"
          v={cands.filter((c) => c.stage !== "Joined").length}
          icon="🧲"
        />
        <Kpi l="Branches" v={BRANCHES.length} icon="🏢" />
        <Kpi
          l="Avg Salary"
          v={inr(Math.round(payroll / total))}
          icon="📈"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <Panel t="Today's Attendance">
          <div className="flex items-center gap-5">
            <div
              className="w-32 h-32 rounded-full shrink-0 grid place-items-center"
              style={{
                background: `conic-gradient(#16a34a 0 ${pp}%, #dc2626 ${pp}% ${pp + ap}%, #f59e0b ${pp + ap}% 100%)`,
              }}
            >
              <div className="w-20 h-20 bg-white rounded-full grid place-items-center text-center">
                <b className="text-xl text-[#0B1F3A]">{Math.round(pp)}%</b>
              </div>
            </div>
            <ul className="text-sm space-y-2">
              <li>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600 mr-2" />
                Present <b>{present}</b>
              </li>
              <li>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 mr-2" />
                Absent <b>{absent}</b>
              </li>
              <li>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />
                Leave <b>{onLeave}</b>
              </li>
            </ul>
          </div>
          <button onClick={() => go("Attendance")} className={btnNavy + " mt-4 w-full"}>
            Mark attendance
          </button>
        </Panel>

        <Panel t="Pending Leave Approvals" className="lg:col-span-2">
          {pending.length ? (
            <ul className="divide-y">
              {pending.map((l) => (
                <li key={l.id} className="py-3 flex items-center gap-3">
                  <Avatar name={l.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {l.name} · {l.type}
                    </p>
                    <p className="text-xs text-slate-500">
                      {l.from} → {l.to}
                    </p>
                  </div>
                  <Pill s={l.st} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Nothing pending 🎉</p>
          )}
          <button onClick={() => go("Leave")} className="text-sm text-[#C9971C] font-semibold mt-3">
            Open leave manager →
          </button>
        </Panel>

        <Panel t="Employees by Branch">
          {BRANCHES.map((b) => (
            <Bar key={b} l={b} v={bB[b] || 0} max={emps.length} c="#C9971C" />
          ))}
        </Panel>
        <Panel t="Employees by Department">
          {Object.entries(bD).map(([k, v]) => (
            <Bar key={k} l={k} v={v} max={Math.max(...Object.values(bD))} />
          ))}
        </Panel>
        <Panel t="Monthly Hiring">
          <div className="flex items-end gap-2 h-40">
            {hiring.map((h) => (
              <div key={h[0]} className="flex-1 text-center text-xs">
                <div
                  className="rounded-t-lg"
                  style={{
                    height: h[1] * 5,
                    background: "linear-gradient(180deg,#E6C36A,#C9971C)",
                  }}
                />
                <p className="mt-1 text-slate-500">{h[0]}</p>
                <b>{h[1]}</b>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel t="Reminders">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {[
            ["⚖", "PF return due", "15 Nov"],
            ["⚖", "ESI filing due", "15 Nov"],
            ["📄", "Contract renewal: 3 staff", "30 Nov"],
            ["🎂", "Birthday: Priya S", "Today"],
          ].map((r) => (
            <div key={r[1]} className="rounded-xl bg-slate-50 p-3 flex gap-3 items-center">
              <span className="text-xl">{r[0]}</span>
              <div>
                <p className="font-medium">{r[1]}</p>
                <p className="text-xs text-slate-500">{r[2]}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ---------------- Employees ---------------- */
function Employees({ emps, setEmps }) {
  const [q, setQ] = useState(""),
    [br, setBr] = useState(""),
    [dp, setDp] = useState(""),
    [page, setPage] = useState(0),
    [form, setForm] = useState(null),
    [isNew, setIsNew] = useState(false);
  const list = emps.filter(
    (e) =>
      (e.name + e.id).toLowerCase().includes(q.toLowerCase()) &&
      (!br || e.branch === br) &&
      (!dp || e.dept === dp),
  );
  const per = 10,
    pages = Math.max(1, Math.ceil(list.length / per)),
    cur = list.slice(page * per, page * per + per);
  const nextId = () =>
    "SG" +
    String(Math.max(0, ...emps.map((e) => +e.id.slice(2) || 0)) + 1).padStart(4, "0");
  const openNew = () => {
    setForm({
      id: nextId(),
      name: "",
      branch: BRANCHES[0],
      dept: DEPTS[0],
      salary: 15000,
      phone: "",
      joined: today(),
      lop: 0,
      status: "P",
    });
    setIsNew(true);
  };
  const save = () => {
    if (!String(form.name).trim()) return alert("Name is required");
    const row = { ...form, salary: Number(form.salary) || 0 };
    setEmps(isNew ? [row, ...emps] : emps.map((e) => (e.id === row.id ? row : e)));
    setForm(null);
  };
  const del = (e) =>
    window.confirm("Delete " + e.name + "?") &&
    setEmps(emps.filter((x) => x.id !== e.id));
  const set = (k) => (ev) => setForm({ ...form, [k]: ev.target.value });
  return (
    <Panel
      t={`Employees (${list.length})`}
      right={
        <div className="flex gap-2">
          <button
            onClick={() =>
              download("employees.csv", [
                ["ID", "Name", "Branch", "Dept", "Salary", "Phone", "Joined"],
                ...list.map((e) => [e.id, e.name, e.branch, e.dept, e.salary, e.phone, e.joined]),
              ])
            }
            className="border px-3 py-2 rounded-xl text-sm"
          >
            ⬇ CSV
          </button>
          <button onClick={openNew} className={btnGold}>
            + Add
          </button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-3 gap-2 mb-4">
        <input
          className={inp}
          placeholder="Search name / ID"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        <select className={inp} value={br} onChange={(e) => { setBr(e.target.value); setPage(0); }}>
          <option value="">All branches</option>
          {BRANCHES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <select className={inp} value={dp} onChange={(e) => { setDp(e.target.value); setPage(0); }}>
          <option value="">All departments</option>
          {DEPTS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* mobile cards */}
      <div className="md:hidden space-y-3">
        {cur.map((e) => (
          <div key={e.id} className="border border-slate-100 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar name={e.name} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{e.name}</p>
                <p className="text-xs text-slate-500">
                  {e.id} · {e.dept}
                </p>
              </div>
              <b className="text-sm">{inr(e.salary)}</b>
            </div>
            <p className="text-xs text-slate-500 mt-2">{e.branch}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <button className="text-blue-700" onClick={() => { setForm(e); setIsNew(false); }}>
                Edit
              </button>
              <button className="text-red-600" onClick={() => del(e)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              {["Employee", "ID", "Branch", "Dept", "Joined", "Salary", ""].map((h) => (
                <th key={h} className="py-2 pr-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cur.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={e.name} />
                    {e.name}
                  </div>
                </td>
                <td className="pr-3">{e.id}</td>
                <td className="pr-3">{e.branch}</td>
                <td className="pr-3">{e.dept}</td>
                <td className="pr-3">{e.joined}</td>
                <td className="pr-3 font-semibold">{inr(e.salary)}</td>
                <td className="whitespace-nowrap">
                  <button className="text-blue-700 mr-3" onClick={() => { setForm(e); setIsNew(false); }}>
                    Edit
                  </button>
                  <button className="text-red-600" onClick={() => del(e)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page} pages={pages} set={setPage} />

      {form && (
        <Modal title={(isNew ? "Add" : "Edit") + " Employee"} onClose={() => setForm(null)}>
          <div className="space-y-3">
            <Field label="Employee ID">
              <input className={inp + " bg-slate-50"} value={form.id} readOnly />
            </Field>
            <Field label="Full name">
              <input className={inp} value={form.name} onChange={set("name")} />
            </Field>
            <Field label="Phone">
              <input className={inp} value={form.phone || ""} onChange={set("phone")} />
            </Field>
            <Field label="Branch">
              <select className={inp} value={form.branch} onChange={set("branch")}>
                {BRANCHES.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Department">
              <select className={inp} value={form.dept} onChange={set("dept")}>
                {DEPTS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Monthly salary (₹)">
              <input type="number" className={inp} value={form.salary} onChange={set("salary")} />
            </Field>
            <Field label="Joining date">
              <input type="date" className={inp} value={form.joined} onChange={set("joined")} />
            </Field>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setForm(null)} className="border px-4 py-2.5 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={save} className={btnGold}>
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Panel>
  );
}

/* ---------------- Attendance ---------------- */
function Attendance({ emps, att, setAtt }) {
  const [date, setDate] = useState(today());
  const [q, setQ] = useState(""),
    [br, setBr] = useState(""),
    [page, setPage] = useState(0);
  const day = att[date] || {};
  const st = (e) => day[e.id] || "P";
  const mark = (id, v) => setAtt({ ...att, [date]: { ...day, [id]: v } });
  const list = emps.filter(
    (e) =>
      (e.name + e.id).toLowerCase().includes(q.toLowerCase()) &&
      (!br || e.branch === br),
  );
  const per = 10,
    pages = Math.max(1, Math.ceil(list.length / per)),
    cur = list.slice(page * per, page * per + per);
  const c = (s) => emps.filter((e) => st(e) === s).length;
  const markAll = (v) => {
    const m = { ...day };
    list.forEach((e) => (m[e.id] = v));
    setAtt({ ...att, [date]: m });
  };
  const Seg = ({ e }) => (
    <div className="inline-flex rounded-xl overflow-hidden border border-slate-200 text-xs">
      {[
        ["P", "Present", "bg-green-600"],
        ["A", "Absent", "bg-red-600"],
        ["L", "Leave", "bg-amber-500"],
      ].map(([v, l, bg]) => (
        <button
          key={v}
          onClick={() => mark(e.id, v)}
          className={
            "px-3 py-1.5 " + (st(e) === v ? bg + " text-white" : "bg-white text-slate-600")
          }
        >
          {l}
        </button>
      ))}
    </div>
  );
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Kpi l="Present" v={c("P")} icon="✅" tone="#16a34a" />
        <Kpi l="Absent" v={c("A")} icon="❌" tone="#dc2626" />
        <Kpi l="Leave" v={c("L")} icon="🏖" tone="#f59e0b" />
      </div>
      <Panel
        t="Daily Attendance"
        right={
          <div className="flex gap-2">
            <button onClick={() => markAll("P")} className="border px-3 py-2 rounded-xl text-xs">
              All present (filtered)
            </button>
            <button
              onClick={() =>
                download("attendance-" + date + ".csv", [
                  ["ID", "Name", "Branch", "Status"],
                  ...emps.map((e) => [e.id, e.name, e.branch, st(e)]),
                ])
              }
              className="border px-3 py-2 rounded-xl text-xs"
            >
              ⬇ CSV
            </button>
          </div>
        }
      >
        <div className="grid sm:grid-cols-3 gap-2 mb-4">
          <input type="date" className={inp} value={date} onChange={(e) => setDate(e.target.value)} />
          <input
            className={inp}
            placeholder="Search name / ID"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
          />
          <select className={inp} value={br} onChange={(e) => { setBr(e.target.value); setPage(0); }}>
            <option value="">All branches</option>
            {BRANCHES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <ul className="divide-y">
          {cur.map((e) => (
            <li key={e.id} className="py-3 flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={e.name} />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{e.name}</p>
                  <p className="text-xs text-slate-500">
                    {e.id} · {e.branch}
                  </p>
                </div>
              </div>
              <Seg e={e} />
            </li>
          ))}
        </ul>
        <Pager page={page} pages={pages} set={setPage} />
      </Panel>
    </>
  );
}

/* ---------------- Leave ---------------- */
function Leave({ emps, leaves, setLeaves }) {
  const [f, setF] = useState({
    emp: "",
    type: "Casual",
    from: today(),
    to: today(),
    reason: "",
  });
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("All");
  const apply = () => {
    const e = emps.find((x) => x.id.toLowerCase() === f.emp.trim().toLowerCase());
    if (!e) return setErr("Employee ID not found (example: SG0004)");
    if (f.to < f.from) return setErr("'To' date cannot be before 'From' date");
    setErr("");
    setLeaves([
      { id: Date.now(), emp: e.id, name: e.name, ...f, st: "Pending" },
      ...leaves,
    ]);
    setF({ ...f, emp: "", reason: "" });
  };
  const setSt = (id, st) => setLeaves(leaves.map((l) => (l.id === id ? { ...l, st } : l)));
  const days = (l) => Math.round((new Date(l.to) - new Date(l.from)) / 864e5) + 1;
  const shown = leaves.filter((l) => filter === "All" || l.st === filter);
  return (
    <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
      <Panel t="Apply Leave (on behalf of employee)">
        <div className="space-y-3">
          <Field label="Employee ID">
            <input className={inp} placeholder="SG0004" value={f.emp} onChange={(e) => setF({ ...f, emp: e.target.value })} />
          </Field>
          <Field label="Leave type">
            <select className={inp} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              {LEAVE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="From">
              <input type="date" className={inp} value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} />
            </Field>
            <Field label="To">
              <input type="date" className={inp} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} />
            </Field>
          </div>
          <Field label="Reason">
            <input className={inp} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} />
          </Field>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button onClick={apply} className={btnGold + " w-full"}>
            Submit request
          </button>
        </div>
      </Panel>
      <Panel
        t={`Leave Requests (${shown.length})`}
        className="lg:col-span-2"
        right={
          <select className="border rounded-xl p-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        }
      >
        <ul className="divide-y">
          {shown.map((l) => (
            <li key={l.id} className="py-3">
              <div className="flex items-start gap-3">
                <Avatar name={l.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    {l.name} <span className="text-slate-400 font-normal">({l.emp})</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {l.type} · {l.from} → {l.to} · {days(l)} day(s)
                  </p>
                  {l.reason && <p className="text-xs text-slate-400 mt-0.5">“{l.reason}”</p>}
                </div>
                <Pill s={l.st} />
              </div>
              {l.st === "Pending" && (
                <div className="flex gap-2 mt-2 ml-12">
                  <button onClick={() => setSt(l.id, "Approved")} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg">
                    Approve
                  </button>
                  <button onClick={() => setSt(l.id, "Rejected")} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg">
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
          {!shown.length && <p className="text-sm text-slate-500 py-4">No requests.</p>}
        </ul>
      </Panel>
    </div>
  );
}

/* ---------------- Payroll ---------------- */
function Payroll({ emps }) {
  const [q, setQ] = useState(""),
    [br, setBr] = useState(""),
    [page, setPage] = useState(0),
    [slip, setSlip] = useState(null);
  const rows = useMemo(
    () => emps.map((e) => ({ e, s: payslip({ ...e, salary: Number(e.salary) }) })),
    [emps],
  );
  const tot = rows.reduce(
    (a, { s }) => ({
      gross: a.gross + s.gross,
      pf: a.pf + s.pf,
      esi: a.esi + s.esi,
      pt: a.pt + s.pt,
      net: a.net + s.net,
    }),
    { gross: 0, pf: 0, esi: 0, pt: 0, net: 0 },
  );
  const list = rows.filter(
    ({ e }) =>
      (e.name + e.id).toLowerCase().includes(q.toLowerCase()) &&
      (!br || e.branch === br),
  );
  const per = 10,
    pages = Math.max(1, Math.ceil(list.length / per)),
    cur = list.slice(page * per, page * per + per);
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi l={"Gross · " + monthLabel} v={inr(tot.gross)} icon="💰" />
        <Kpi l="PF (employee)" v={inr(tot.pf)} icon="🏦" />
        <Kpi l="ESI + PT" v={inr(tot.esi + tot.pt)} icon="🧾" />
        <Kpi l="Net payable" v={inr(tot.net)} icon="✅" tone="#16a34a" />
      </div>
      <Panel
        t="Payroll Register"
        right={
          <button
            onClick={() =>
              download("payroll.csv", [
                ["ID", "Name", "Gross", "PF", "ESI", "PT", "Net"],
                ...list.map(({ e, s }) => [e.id, e.name, s.gross, s.pf, s.esi, s.pt, s.net]),
              ])
            }
            className="border px-3 py-2 rounded-xl text-sm"
          >
            ⬇ Export CSV
          </button>
        }
      >
        <div className="grid sm:grid-cols-2 gap-2 mb-4">
          <input className={inp} placeholder="Search name / ID" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
          <select className={inp} value={br} onChange={(e) => { setBr(e.target.value); setPage(0); }}>
            <option value="">All branches</option>
            {BRANCHES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                {["Employee", "Gross", "PF", "ESI", "PT", "Net", ""].map((h) => (
                  <th key={h} className="py-2 pr-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cur.map(({ e, s }) => (
                <tr key={e.id} className="border-t">
                  <td className="py-2.5 pr-3 whitespace-nowrap">
                    {e.name} <span className="text-slate-400 text-xs">{e.id}</span>
                  </td>
                  <td className="pr-3">{inr(s.gross)}</td>
                  <td className="pr-3">{inr(s.pf)}</td>
                  <td className="pr-3">{inr(s.esi)}</td>
                  <td className="pr-3">{inr(s.pt)}</td>
                  <td className="pr-3 font-bold">{inr(s.net)}</td>
                  <td>
                    <button className="text-[#C9971C] font-semibold" onClick={() => setSlip({ e, s })}>
                      Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={pages} set={setPage} />
        <p className="text-xs text-slate-400 mt-3">
          PF/ESI/PT use the rules in data.js — confirm with your CA before real use.
        </p>
      </Panel>

      {slip && (
        <Modal title="Payslip" onClose={() => setSlip(null)}>
          <div className="print-area">
            <div className="text-center border-b pb-3 mb-3">
              <p className="font-display text-xl font-bold text-[#0B1F3A]">Samruddhi Groups</p>
              <p className="text-xs text-slate-500">Payslip · {monthLabel}</p>
            </div>
            <div className="text-sm space-y-1 mb-3">
              <p><b>{slip.e.name}</b> ({slip.e.id})</p>
              <p className="text-slate-500">{slip.e.dept} · {slip.e.branch}</p>
              <p className="text-slate-500">LOP days: {slip.e.lop || 0}</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Gross earnings", slip.s.gross],
                  ["PF (12%)", -slip.s.pf],
                  ["ESI (0.75%)", -slip.s.esi],
                  ["Professional Tax", -slip.s.pt],
                ].map(([l, v]) => (
                  <tr key={l} className="border-t">
                    <td className="py-2">{l}</td>
                    <td className="text-right">{v < 0 ? "− " + inr(-v) : inr(v)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#0B1F3A] font-bold">
                  <td className="py-2">Net pay</td>
                  <td className="text-right">{inr(slip.s.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={() => window.print()} className={btnNavy + " w-full mt-4 no-print"}>
            🖨 Print / Save as PDF
          </button>
        </Modal>
      )}
    </>
  );
}

/* ---------------- Recruitment ---------------- */
function Recruitment({ cands, setCands }) {
  const [form, setForm] = useState(null);
  const move = (id, dir) =>
    setCands(
      cands.map((c) => {
        if (c.id !== id) return c;
        const i = STAGES.indexOf(c.stage) + dir;
        return i < 0 || i >= STAGES.length ? c : { ...c, stage: STAGES[i] };
      }),
    );
  const add = () => {
    if (!form.name.trim()) return alert("Name is required");
    setCands([{ id: Date.now(), ...form, stage: "Applied" }, ...cands]);
    setForm(null);
  };
  return (
    <Panel
      t={`Hiring Pipeline (${cands.length} candidates)`}
      right={
        <button onClick={() => setForm({ name: "", role: "Sales Executive" })} className={btnGold}>
          + Add candidate
        </button>
      }
    >
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
        {STAGES.map((s) => (
          <div key={s} className="snap-start shrink-0 w-64 bg-slate-50 rounded-2xl p-3">
            <div className="flex justify-between text-sm font-semibold text-[#0B1F3A] mb-3">
              {s}
              <span className="bg-white rounded-full px-2 text-xs shadow">
                {cands.filter((c) => c.stage === s).length}
              </span>
            </div>
            <div className="space-y-2">
              {cands
                .filter((c) => c.stage === s)
                .map((c) => (
                  <div key={c.id} className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.role}</p>
                    <div className="flex justify-between mt-2 text-xs">
                      <button disabled={s === STAGES[0]} onClick={() => move(c.id, -1)} className="px-2 py-1 border rounded disabled:opacity-30">
                        ‹
                      </button>
                      <button
                        onClick={() => window.confirm("Remove " + c.name + "?") && setCands(cands.filter((x) => x.id !== c.id))}
                        className="text-red-500"
                      >
                        remove
                      </button>
                      <button disabled={s === STAGES[STAGES.length - 1]} onClick={() => move(c.id, 1)} className="px-2 py-1 border rounded disabled:opacity-30">
                        ›
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {form && (
        <Modal title="Add Candidate" onClose={() => setForm(null)}>
          <div className="space-y-3">
            <Field label="Name">
              <input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Applied for">
              <input className={inp} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </Field>
            <div className="flex justify-end gap-2">
              <button onClick={() => setForm(null)} className="border px-4 py-2.5 rounded-xl text-sm">
                Cancel
              </button>
              <button onClick={add} className={btnGold}>
                Add
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Panel>
  );
}