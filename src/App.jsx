import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  BRANCHES,
  USERS,
  MODULES,
  EMPLOYEES,
  LEADS,
  PROJECTS,
  payslip,
} from "./data.js";
import HRDashboard from "./HRDashboard.jsx";
import SalesDashboard from "./SalesDashboard.jsx";
import AccountsDashboard from "./AccountsDashboard.jsx";
import LegalDashboard from "./LegalDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

const getU = () => JSON.parse(localStorage.getItem("sg_user") || "null");

const ICONS = {
  dashboard: "▦",
  employees: "👥",
  attendance: "🗓",
  payroll: "💳",
  leads: "🎯",
  visitors: "🛎",
  accounts: "🧾",
};
const ROLE_INFO = {
  admin: ["🛡", "Admin", "Control panel"],
  hr: ["👥", "HR / HRMS", "People & payroll"],
  accounts: ["🧾", "Accounts", "Finance & GST"],
  sales: ["🎯", "Sales", "Leads & bookings"],
  advocate: ["⚖", "Legal", "Cases & documents"],
  frontoffice: ["🛎", "Front Office", "Visitors"],
};

const Logo = ({ className = "h-12" }) => {
  const [bad, setBad] = useState(false);
  return bad ? (
    <span className="font-display text-2xl font-bold gold-text">
      Samruddhi Groups
    </span>
  ) : (
    <img
      src="/logo.png"
      alt="Samruddhi Groups"
      className={className}
      onError={() => setBad(true)}
    />
  );
};

const Card = ({ t, v }) => (
  <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gold">
    <p className="text-sm text-gray-500">{t}</p>
    <p className="text-2xl font-bold text-[#0B1F3A]">{v}</p>
  </div>
);
const Table = ({ head, rows }) => (
  <div className="bg-white rounded-xl shadow overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-left text-gray-500">
        <tr>
          {head.map((h) => (
            <th key={h} className="p-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t">
            {r.map((c, j) => (
              <td key={j} className="p-3">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ===================== PUBLIC HOME PAGE ===================== */
function Site() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Projects", "#projects"],
    ["Companies", "#branches"],
    ["Portals", "#portals"],
    ["Contact", "#contact"],
  ];
  return (
    <div className="text-slate-800">
      <header className="fixed top-0 inset-x-0 z-40 glass-dark">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo className="h-10" />
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/90">
            {links.map((l) => (
              <a key={l[0]} href={l[1]} className="hover:text-[#E6C36A]">
                {l[0]}
              </a>
            ))}
            <Link
              to="/login/admin"
              className="btn-gold px-5 py-2 rounded-full text-sm"
            >
              Staff Login
            </Link>
          </nav>
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-3 text-white">
            {links.map((l) => (
              <a
                key={l[0]}
                href={l[1]}
                onClick={() => setOpen(false)}
                className="block py-2 border-b border-white/10"
              >
                {l[0]}
              </a>
            ))}
            <Link
              to="/login/admin"
              className="btn-gold block text-center py-3 rounded-full"
            >
              Staff Login
            </Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="hero-bg relative min-h-screen flex items-center text-white overflow-hidden">
        <svg
          className="absolute bottom-0 inset-x-0 w-full opacity-20"
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
        >
          <path
            fill="#E6C36A"
            d="M0 220V150h60V90h50v60h40V40h70v110h50V100h60v50h50V60h80v90h40V110h60v40h50V70h70v80h50V30h60v120h50V90h60v60h60V120h60v100z"
          />
        </svg>
        <div className="relative max-w-6xl mx-auto px-5 pt-28 pb-24 fade-up">
          <span className="glass inline-block text-xs tracking-widest uppercase px-4 py-1.5 rounded-full text-[#E6C36A]">
            Real Estate • Construction • Technology
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold mt-6 leading-tight">
            Building Homes.
            <br />
            <span className="gold-text">Building Trust.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/75 text-base sm:text-lg">
            Samruddhi Groups brings together four companies to deliver premium
            apartments, plots and villas — with transparency at every step.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn-gold px-7 py-3 rounded-full">
              Explore Projects
            </a>
            <a
              href="#contact"
              className="glass px-7 py-3 rounded-full hover:bg-white/20"
            >
              Contact Us
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            {[
              ["4", "Group Companies"],
              ["400+", "Team Members"],
              ["3", "Live Projects"],
              ["1000+", "Happy Families"],
            ].map((s) => (
              <div key={s[1]} className="glass rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-bold gold-text">
                  {s[0]}
                </p>
                <p className="text-xs text-white/70 mt-1">{s[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#C9971C] font-semibold text-sm tracking-widest uppercase">
            Our Projects
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F3A] mt-2">
            Spaces designed for living
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {PROJECTS.map((p, i) => (
              <div
                key={p[0]}
                className="group rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <div
                  className="h-44 relative"
                  style={{
                    background: [
                      "linear-gradient(135deg,#0B1F3A,#2a5298)",
                      "linear-gradient(135deg,#14532d,#4ade80)",
                      "linear-gradient(135deg,#7c4a03,#E6C36A)",
                    ][i % 3],
                  }}
                >
                  <span className="absolute top-4 left-4 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full">
                    {p[2]}
                  </span>
                  <span className="absolute bottom-3 right-4 text-6xl opacity-30">
                    {["🏢", "🌳", "🏡"][i % 3]}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-[#0B1F3A]">{p[0]}</h3>
                  <p className="text-slate-500 mt-1">{p[1]}</p>
                  <a
                    href="#contact"
                    className="inline-block mt-4 text-sm font-semibold text-[#C9971C]"
                  >
                    Enquire now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section id="branches" className="py-20 px-5 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F3A]">
            Group Companies
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {BRANCHES.map((b, i) => (
              <div
                key={b}
                className="bg-white rounded-2xl p-7 shadow border-t-4 border-[#C9971C] hover:shadow-xl transition"
              >
                <div className="text-4xl">{["💻", "🏗", "🏘", "🏙"][i]}</div>
                <p className="font-semibold mt-3 text-[#0B1F3A]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section id="portals" className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F3A] text-center">
            Staff Portals
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {Object.keys(USERS).map((r) => (
              <Link
                key={r}
                to={"/login/" + r}
                className="rounded-2xl p-5 border border-slate-100 shadow hover:shadow-xl hover:-translate-y-1 transition bg-gradient-to-br from-white to-slate-50"
              >
                <div className="text-3xl">{ROLE_INFO[r]?.[0]}</div>
                <p className="font-bold mt-2 text-[#0B1F3A]">
                  {ROLE_INFO[r]?.[1]}
                </p>
                <p className="text-xs text-slate-500">{ROLE_INFO[r]?.[2]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <section
        id="contact"
        className="hero-bg py-16 px-5 text-center text-white"
      >
        <h2 className="font-display text-3xl font-bold">Let's talk</h2>
        <p className="mt-3 text-white/75">
          Phone: +91 00000 00000 &nbsp;|&nbsp; info@samruddhi.com
        </p>
        <p className="mt-10 text-xs text-white/40">
          © {new Date().getFullYear()} Samruddhi Groups. All rights reserved.
        </p>
      </section>
    </div>
  );
}

/* ===================== LOGIN ===================== */
function Login() {
  const { role } = useParams(),
    nav = useNavigate();
  const [e, setE] = useState(""),
    [p, setP] = useState(""),
    [err, setErr] = useState(""),
    [show, setShow] = useState(false);
  const u = (JSON.parse(localStorage.getItem("sg_users") || "null") || USERS)[
    role
  ];
  if (!u) return <Navigate to="/" />;
  const go = (x) => {
    x.preventDefault();
    if (e === u.email && p === u.password) {
      localStorage.setItem("sg_user", JSON.stringify({ role, name: u.name }));
      nav("/app");
    } else setErr("Wrong email or password");
  };
  return (
    <div className="login-bg min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#C9971C]/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        <div className="hidden lg:block text-white fade-up">
          <Logo className="h-16" />
          <h1 className="font-display text-5xl font-bold mt-8 leading-tight">
            Welcome to the
            <br />
            <span className="gold-text">Samruddhi Portal</span>
          </h1>
          <p className="mt-5 text-white/70 max-w-md">
            One secure workspace for HR, sales, accounts and legal teams across
            all four group companies.
          </p>
        </div>
        <form
          onSubmit={go}
          className="glass rounded-3xl p-7 sm:p-9 w-full max-w-md mx-auto space-y-4 text-white fade-up shadow-2xl"
        >
          <div className="lg:hidden flex justify-center">
            <Logo className="h-14" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#E6C36A]">
              {ROLE_INFO[role]?.[2] || "Portal"}
            </p>
            <h2 className="text-2xl font-bold capitalize">{role} Login</h2>
          </div>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#C9971C]"
            placeholder="Email"
            value={e}
            onChange={(x) => setE(x.target.value)}
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl bg-white/90 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#C9971C]"
              placeholder="Password"
              value={p}
              onChange={(x) => setP(x.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {err && <p className="text-red-300 text-sm">{err}</p>}
          <button className="btn-gold w-full py-3 rounded-xl">Sign in</button>
          <p className="text-xs text-white/60">
            Demo: {u.email} / {u.password}
          </p>
          <div className="pt-3 border-t border-white/15 flex flex-wrap gap-2">
            {Object.keys(USERS).map((r) => (
              <Link
                key={r}
                to={"/login/" + r}
                className={
                  "text-xs capitalize px-3 py-1.5 rounded-full " +
                  (r === role
                    ? "bg-[#C9971C] text-[#0B1F3A] font-semibold"
                    : "bg-white/10 hover:bg-white/20")
                }
              >
                {r}
              </Link>
            ))}
          </div>
          <Link to="/" className="block text-center text-xs text-white/60">
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}

/* ===================== SIMPLE PAGES (other roles) ===================== */
function Pages({ m }) {
  const [emps, setEmps] = useState(EMPLOYEES),
    [q, setQ] = useState(""),
    [br, setBr] = useState("");
  const list = emps.filter(
    (e) =>
      (e.name + e.id).toLowerCase().includes(q.toLowerCase()) &&
      (!br || e.branch === br),
  );
  const filt = (
    <div className="flex flex-wrap gap-2 mb-3">
      <input
        className="border p-2 rounded flex-1 min-w-[160px]"
        placeholder="Search name / ID"
        value={q}
        onChange={(x) => setQ(x.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={br}
        onChange={(x) => setBr(x.target.value)}
      >
        <option value="">All branches</option>
        {BRANCHES.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>
    </div>
  );
  if (m === "dashboard")
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card t="Employees" v={emps.length} />
        <Card t="Branches" v={BRANCHES.length} />
        <Card t="Open Leads" v={LEADS.length} />
        <Card
          t="Present Today"
          v={emps.filter((e) => e.status === "P").length}
        />
      </div>
    );
  if (m === "employees")
    return (
      <>
        {filt}
        <Table
          head={["ID", "Name", "Branch", "Dept", "Salary"]}
          rows={list
            .slice(0, 100)
            .map((e) => [e.id, e.name, e.branch, e.dept, "₹" + e.salary])}
        />
      </>
    );
  if (m === "attendance")
    return (
      <>
        {filt}
        <Table
          head={["ID", "Name", "Branch", "Status"]}
          rows={list.slice(0, 50).map((e) => [
            e.id,
            e.name,
            e.branch,
            <select
              value={e.status}
              onChange={(x) =>
                setEmps(
                  emps.map((z) =>
                    z.id === e.id ? { ...z, status: x.target.value } : z,
                  ),
                )
              }
            >
              <option value="P">Present</option>
              <option value="A">Absent</option>
              <option value="L">Leave</option>
            </select>,
          ])}
        />
      </>
    );
  if (m === "payroll")
    return (
      <>
        {filt}
        <Table
          head={["ID", "Name", "Gross", "PF (12%)", "ESI (0.75%)", "PT", "Net Pay"]}
          rows={list.slice(0, 100).map((e) => {
            const s = payslip(e);
            return [
              e.id,
              e.name,
              "₹" + s.gross,
              "₹" + s.pf,
              "₹" + s.esi,
              "₹" + s.pt,
              <b>₹{s.net}</b>,
            ];
          })}
        />
      </>
    );
  if (m === "leads")
    return <Table head={["Name", "Phone", "Project", "Stage"]} rows={LEADS} />;
  if (m === "visitors")
    return (
      <Table
        head={["Visitor", "Meeting", "Time"]}
        rows={[
          ["Rahul Mehta", "Sales Manager", "10:30"],
          ["Vendor ABC", "Accounts", "11:15"],
        ]}
      />
    );
  if (m === "accounts")
    return (
      <Table
        head={["Invoice", "Party", "Amount", "Status"]}
        rows={[
          ["INV-101", "Customer A", "₹5,00,000", "Paid"],
          ["INV-102", "Vendor B", "₹1,20,000", "Pending"],
        ]}
      />
    );
  return null;
}

/* ===================== APP SHELL (sidebar + topbar) ===================== */
function Shell() {
  const u = getU(),
    nav = useNavigate();
  const [open, setOpen] = useState(false);
  if (!u) return <Navigate to="/login/admin" />;
  const DASH = {
    hr: <HRDashboard />,
    sales: <SalesDashboard />,
    accounts: <AccountsDashboard />,
    advocate: <LegalDashboard />,
    admin: <AdminDashboard />,
  };
  // HR gets one full HRMS portal (employees, attendance, leave, payroll, hiring inside it)
  const mods =
    u.role === "hr"
      ? [{ path: "dashboard", label: "HRMS Portal" }]
      : MODULES.filter((m) => u.role === "admin" || m.roles.includes(u.role));
  const logout = () => {
    localStorage.removeItem("sg_user");
    nav("/");
  };
  return (
    <div className="min-h-screen flex bg-slate-100">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={
          "fixed lg:sticky top-0 h-screen z-40 w-64 shrink-0 text-white p-5 flex flex-col transition-transform " +
          (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        }
        style={{
          background:
            "linear-gradient(180deg,#0B1F3A 0%,#0a1830 60%,#060f1f 100%)",
        }}
      >
        <div className="mb-8 px-1">
          <Logo className="h-12" />
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {mods.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition " +
                (isActive
                  ? "bg-gradient-to-r from-[#C9971C] to-[#E6C36A] text-[#0B1F3A] font-semibold shadow-lg"
                  : "text-white/80 hover:bg-white/10")
              }
            >
              <span>{ICONS[m.path] || "•"}</span>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-4 text-sm text-white/70 hover:text-[#E6C36A] text-left px-3"
        >
          ⎋ Logout
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 px-4 h-14 flex items-center justify-between">
          <button
            className="lg:hidden text-2xl text-[#0B1F3A]"
            onClick={() => setOpen(true)}
            aria-label="menu"
          >
            ☰
          </button>
          <p className="hidden lg:block text-sm text-slate-500">
            Welcome back, <b className="text-[#0B1F3A]">{u.name}</b>
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs capitalize bg-[#0B1F3A] text-[#E6C36A] px-3 py-1 rounded-full">
              {u.role}
            </span>
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E6C36A] to-[#C9971C] grid place-items-center font-bold text-[#0B1F3A]">
              {u.name[0]}
            </span>
          </div>
        </div>
        <main className="premium p-4 sm:p-6">
          <Routes>
            <Route index element={<Navigate to={mods[0].path} />} />
            {mods.map((m) => (
              <Route
                key={m.path}
                path={m.path}
                element={
                  m.path === "dashboard" && DASH[u.role] ? (
                    DASH[u.role]
                  ) : (
                    <Pages m={m.path} />
                  )
                }
              />
            ))}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/app/*" element={<Shell />} />
    </Routes>
  );
}