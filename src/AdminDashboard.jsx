import { useState, useEffect } from "react";
import {
  BRANCHES,
  USERS,
  MODULES,
  EMPLOYEES,
  LEADS,
  PROJECTS,
} from "./data.js";
import HRDashboard from "./HRDashboard.jsx";
import SalesDashboard from "./SalesDashboard.jsx";
import AccountsDashboard from "./AccountsDashboard.jsx";
import LegalDashboard from "./LegalDashboard.jsx";
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
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
  }, [v]);
  return [v, s];
};
const S = ({ t, children }) => (
  <section className="bg-white rounded-xl shadow p-5">
    <h2 className="font-bold text-brand mb-3 border-b-2 border-gold/60 pb-1">
      {t}
    </h2>
    {children}
  </section>
);
const Bar = ({ l, v, max, c = "bg-brand", show }) => (
  <div className="mb-2 text-sm">
    <div className="flex justify-between">
      <span>{l}</span>
      <b>{show ?? v}</b>
    </div>
    <div className="h-2 bg-slate-100 rounded">
      <div
        className={c + " h-2 rounded"}
        style={{ width: Math.min((v / (max || 1)) * 100, 100) + "%" }}
      />
    </div>
  </div>
);
const inp = "border p-2 rounded text-sm w-full";

function Crud({
  title,
  fields,
  rows,
  setRows,
  idKey,
  newRow,
  log,
  canAdd = true,
  canDelete = true,
  filterKey,
  filterOpts = [],
}) {
  const [q, setQ] = useState(""),
    [fv, setFv] = useState(""),
    [page, setPage] = useState(0),
    [form, setForm] = useState(null),
    [isNew, setIsNew] = useState(false);
  const list = rows.filter(
    (r) =>
      JSON.stringify(Object.values(r))
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (!fv || r[filterKey] === fv),
  );
  const per = 12,
    pages = Math.max(1, Math.ceil(list.length / per)),
    cur = list.slice(page * per, page * per + per);
  const open = (r, n) => {
    setForm(r);
    setIsNew(n);
  };
  const save = () => {
    const f = isNew
      ? fields.find((x) => !x.auto && !x.optional)
      : fields.find((x) => !x.ro && !x.optional);
    if (f && !String(form[f.k]).trim()) return alert(f.label + " is required");
    const row = { ...form };
    fields.forEach((x) => {
      if (x.type === "number") row[x.k] = Number(row[x.k]) || 0;
    });
    if (isNew) {
      setRows([row, ...rows]);
      log(title + " added: " + row[fields[1]?.k || idKey]);
    } else {
      setRows(rows.map((r) => (r[idKey] === row[idKey] ? row : r)));
      log(title + " updated: " + row[fields[1]?.k || idKey]);
    }
    setForm(null);
  };
  const del = (r) => {
    if (
      window.confirm(
        "Delete " + r[fields[1]?.k || idKey] + "? This cannot be undone.",
      )
    ) {
      setRows(rows.filter((x) => x[idKey] !== r[idKey]));
      log(title + " deleted: " + r[fields[1]?.k || idKey]);
    }
  };
  const csv = () => {
    const t = [fields.map((f) => f.label).join(",")]
      .concat(
        list.map((r) =>
          fields
            .map((f) => '"' + String(r[f.k]).replace(/"/g, '""') + '"')
            .join(","),
        ),
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" }));
    a.download = title + ".csv";
    a.click();
  };
  return (
    <S t={title + " (" + list.length + ")"}>
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          className="border p-2 rounded text-sm"
          placeholder="Search..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        {filterKey && (
          <select
            className="border p-2 rounded text-sm"
            value={fv}
            onChange={(e) => {
              setFv(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All {filterKey}</option>
            {filterOpts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        )}
        {canAdd && (
          <button
            onClick={() => open(newRow(), true)}
            className="bg-brand text-gold px-4 rounded text-sm"
          >
            + Add New
          </button>
        )}
        <button onClick={csv} className="border px-3 rounded text-sm">
          ⬇ Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              {fields.map((f) => (
                <th key={f.k} className="py-1 pr-3">
                  {f.label}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cur.map((r) => (
              <tr key={r[idKey]} className="border-t">
                {fields.map((f) => (
                  <td key={f.k} className="py-2 pr-3">
                    {f.type === "number" && f.money
                      ? inr(r[f.k])
                      : f.k === "password"
                        ? "••••••"
                        : r[f.k]}
                  </td>
                ))}
                <td className="whitespace-nowrap">
                  <button
                    onClick={() => open(r, false)}
                    className="text-blue-700 mr-3"
                  >
                    Edit
                  </button>
                  {canDelete && (
                    <button onClick={() => del(r)} className="text-red-600">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3 mt-3 text-sm">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 rounded disabled:opacity-40"
        >
          Prev
        </button>
        Page {page + 1} / {pages}
        <button
          disabled={page + 1 >= pages}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
      {form && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-brand">
              {isNew ? "Add" : "Edit"} {title}
            </h3>
            {fields.map((f) => (
              <label key={f.k} className="block text-sm">
                {f.label}
                {f.options ? (
                  <select
                    className={inp}
                    value={form[f.k]}
                    onChange={(e) =>
                      setForm({ ...form, [f.k]: e.target.value })
                    }
                  >
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={inp}
                    type={f.type || "text"}
                    readOnly={(f.ro && !isNew) || f.auto}
                    value={form[f.k]}
                    onChange={(e) =>
                      setForm({ ...form, [f.k]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setForm(null)}
                className="border px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-brand text-gold px-4 py-2 rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </S>
  );
}

export default function AdminDashboard() {
  const TABS = [
    "Overview",
    "Employees",
    "Branches",
    "Projects",
    "Leads",
    "Users & Logins",
    "Department Views",
  ];
  const [tab, setTab] = useState("Overview"),
    [view, setView] = useState("HR");
  const [emps, setEmps] = useLocal("sg_a_emps", EMPLOYEES);
  const [brs, setBrs] = useLocal(
    "sg_a_br",
    BRANCHES.map((b, i) => ({
      name: b,
      city: ["Bengaluru", "Bengaluru", "Mysuru", "Pune"][i],
      head: "Branch Head " + (i + 1),
      phone: "+91 00000 0000" + i,
    })),
  );
  const [pros, setPros] = useLocal(
    "sg_a_pro",
    PROJECTS.map((p, i) => ({
      id: "P" + (i + 1),
      name: p[0],
      type: p[1],
      status: p[2],
      units: [120, 200, 40][i],
    })),
  );
  const [leads, setLeads] = useLocal(
    "sg_a_leads",
    LEADS.map((l, i) => ({
      id: "L" + (i + 1),
      name: l[0],
      phone: l[1],
      project: l[2],
      stage: l[3],
    })),
  );
  const [users, setUsers] = useLocal(
    "sg_a_users",
    Object.entries(USERS).map(([role, u]) => ({ role, ...u })),
  );
  const [logs, setLogs] = useLocal("sg_a_log", []);
  const log = (m) =>
    setLogs((l) =>
      [{ m, t: new Date().toLocaleString("en-IN") }, ...l].slice(0, 10),
    );
  useEffect(() => {
    localStorage.setItem(
      "sg_users",
      JSON.stringify(
        Object.fromEntries(
          users.map((u) => [
            u.role,
            { email: u.email, password: u.password, name: u.name },
          ]),
        ),
      ),
    );
  }, [users]);
  const bn = brs.map((b) => b.name),
    depts = [
      "HR",
      "Accounts",
      "Sales",
      "Front Office",
      "Site Engineer",
      "IT",
      "Marketing",
      "Legal",
      "Admin",
    ];
  const by = (k, arr) =>
    arr.reduce((o, e) => ((o[e[k]] = (o[e[k]] || 0) + 1), o), {});
  const payroll = emps.reduce((s, e) => s + Number(e.salary), 0),
    bD = by("dept", emps),
    bB = by("branch", emps);
  const nextId = () =>
    "SG" +
    String(Math.max(0, ...emps.map((e) => +e.id.slice(2) || 0)) + 1).padStart(
      4,
      "0",
    );
  const kpis = [
    ["Employees", emps.length],
    ["Branches", brs.length],
    ["Monthly Payroll", inr(payroll)],
    ["Projects", pros.length],
    ["Total Leads", leads.length],
    ["Leads Booked", leads.filter((l) => l.stage === "Booked").length],
    ["Login Accounts", users.length],
    ["Avg Salary", inr(Math.round(payroll / (emps.length || 1)))],
  ];
  const reset = () => {
    if (
      window.confirm("Reset ALL admin data back to the original demo data?")
    ) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sg_a_") || k === "sg_users")
        .forEach((k) => localStorage.removeItem(k));
      location.reload();
    }
  };
  const VIEWS = {
    HR: <HRDashboard />,
    Sales: <SalesDashboard />,
    Accounts: <AccountsDashboard />,
    Legal: <LegalDashboard />,
  };
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-brand to-slate-800 text-white rounded-xl p-5 flex justify-between border-b-4 border-gold">
        <div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-gold text-sm">
            Samruddhi Groups • Manage everything in one place
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs border border-gold text-gold px-3 py-1 rounded self-center"
        >
          Reset demo data
        </button>
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
            <S t="Employees by Branch">
              {bn.map((b) => (
                <Bar
                  key={b}
                  l={b}
                  v={bB[b] || 0}
                  max={emps.length}
                  c="bg-gold"
                />
              ))}
            </S>
            <S t="Employees by Department">
              {Object.entries(bD).map(([d, v]) => (
                <Bar key={d} l={d} v={v} max={Math.max(...Object.values(bD))} />
              ))}
            </S>
            <S t="Lead Stages">
              {[
                "New",
                "Contacted",
                "Site Visit",
                "Negotiation",
                "Booked",
                "Lost",
              ].map((s) => (
                <Bar
                  key={s}
                  l={s}
                  v={leads.filter((l) => l.stage === s).length}
                  max={leads.length}
                  c="bg-gold"
                />
              ))}
            </S>
            <S t="Recent Admin Activity">
              {logs.length ? (
                <ul className="text-sm divide-y">
                  {logs.map((l, i) => (
                    <li key={i} className="py-2 flex justify-between gap-2">
                      <span>{l.m}</span>
                      <span className="text-gray-500 whitespace-nowrap">
                        {l.t}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No changes yet. Edit anything and it appears here.
                </p>
              )}
            </S>
          </div>
        </>
      )}
      {tab === "Employees" && (
        <Crud
          title="Employees"
          idKey="id"
          rows={emps}
          setRows={setEmps}
          log={log}
          filterKey="branch"
          filterOpts={bn}
          newRow={() => ({
            id: nextId(),
            name: "",
            branch: bn[0],
            dept: depts[0],
            salary: 15000,
          })}
          fields={[
            { k: "id", label: "ID", ro: 1, auto: 1 },
            { k: "name", label: "Name" },
            { k: "branch", label: "Branch", options: bn },
            { k: "dept", label: "Department", options: depts },
            { k: "salary", label: "Monthly Salary", type: "number", money: 1 },
          ]}
        />
      )}
      {tab === "Branches" && (
        <Crud
          title="Branches"
          idKey="name"
          rows={brs}
          setRows={setBrs}
          log={log}
          newRow={() => ({ name: "", city: "", head: "", phone: "" })}
          fields={[
            { k: "name", label: "Branch Name", ro: 1 },
            { k: "city", label: "City", optional: 1 },
            { k: "head", label: "Branch Head", optional: 1 },
            { k: "phone", label: "Phone", optional: 1 },
          ]}
        />
      )}
      {tab === "Projects" && (
        <Crud
          title="Projects"
          idKey="id"
          rows={pros}
          setRows={setPros}
          log={log}
          newRow={() => ({
            id: "P" + Date.now().toString().slice(-5),
            name: "",
            type: "",
            status: "New Launch",
            units: 0,
          })}
          fields={[
            { k: "id", label: "ID", ro: 1, auto: 1 },
            { k: "name", label: "Project Name" },
            { k: "type", label: "Type", optional: 1 },
            {
              k: "status",
              label: "Status",
              options: [
                "New Launch",
                "Under Construction",
                "Ready",
                "Completed",
              ],
            },
            { k: "units", label: "Total Units", type: "number" },
          ]}
        />
      )}
      {tab === "Leads" && (
        <Crud
          title="Leads"
          idKey="id"
          rows={leads}
          setRows={setLeads}
          log={log}
          filterKey="stage"
          filterOpts={[
            "New",
            "Contacted",
            "Site Visit",
            "Negotiation",
            "Booked",
            "Lost",
          ]}
          newRow={() => ({
            id: "L" + Date.now().toString().slice(-5),
            name: "",
            phone: "",
            project: pros[0]?.name || "",
            stage: "New",
          })}
          fields={[
            { k: "id", label: "ID", ro: 1, auto: 1 },
            { k: "name", label: "Name" },
            { k: "phone", label: "Phone", optional: 1 },
            {
              k: "project",
              label: "Project",
              options: pros.map((p) => p.name),
            },
            {
              k: "stage",
              label: "Stage",
              options: [
                "New",
                "Contacted",
                "Site Visit",
                "Negotiation",
                "Booked",
                "Lost",
              ],
            },
          ]}
        />
      )}
      {tab === "Users & Logins" && (
        <>
          <Crud
            title="Logins"
            idKey="role"
            rows={users}
            setRows={setUsers}
            log={log}
            canAdd={false}
            canDelete={false}
            newRow={() => ({})}
            fields={[
              { k: "role", label: "Role", ro: 1 },
              { k: "name", label: "Display Name" },
              { k: "email", label: "Login Email" },
              { k: "password", label: "Password" },
            ]}
          />
          <S t="Which role sees which page">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th>Page</th>
                    {users.map((u) => (
                      <th key={u.role} className="capitalize">
                        {u.role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((m) => (
                    <tr key={m.path} className="border-t">
                      <td className="py-2">{m.label}</td>
                      {users.map((u) => (
                        <td key={u.role}>
                          {u.role === "admin" || m.roles.includes(u.role)
                            ? "✔"
                            : "–"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </>
      )}
      {tab === "Department Views" && (
        <>
          <div className="flex gap-2">
            {Object.keys(VIEWS).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={
                  "px-4 py-2 rounded text-sm " +
                  (view === v
                    ? "bg-gold text-brand font-semibold"
                    : "bg-white shadow")
                }
              >
                {v}
              </button>
            ))}
          </div>
          {VIEWS[view]}
        </>
      )}
    </div>
  );
}
