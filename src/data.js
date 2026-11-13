// EDIT THIS FILE: company name, branches, demo logins
export const COMPANY = "Samruddhi Groups";
export const BRANCHES = [
  "Samruddhi Tech",
  "Samruddhi Construction",
  "Samruddhi Realty",
  "Samruddhi Developers",
];
export const USERS = {
  // demo logins (replace with real backend later)
  admin: {
    email: "admin@samruddhi123",
    password: "admin123",
    name: "Super Admin",
  },
  hr: { email: "hr@123", password: "hr123", name: "HR Manager" },
  accounts: {
    email: "accounts@123",
    password: "acc123",
    name: "Accounts Head",
  },
  advocate: {
    email: "add@123",
    password: "add123",
    name: "Legal Advisor",
  },
  sales: { email: "sales@123", password: "sales123", name: "Sales Manager" },
  frontoffice: {
    email: "front@123",
    password: "front123",
    name: "Receptionist",
  },
};
export const MODULES = [
  // which roles see which page (admin sees all)
  {
    path: "dashboard",
    label: "Dashboard",
    roles: ["hr", "accounts", "sales", "frontoffice", "advocate"],
  },
  { path: "employees", label: "Employees", roles: ["hr"] },
  { path: "attendance", label: "Attendance", roles: ["hr"] },
  { path: "payroll", label: "Payroll (PF/ESI)", roles: ["hr", "accounts"] },
  { path: "leads", label: "Sales Leads", roles: ["sales"] },
  { path: "visitors", label: "Front Office", roles: ["frontoffice"] },
  { path: "accounts", label: "Accounts", roles: ["accounts"] },
];
const N = [
  "Ravi",
  "Anita",
  "Suresh",
  "Priya",
  "Kiran",
  "Meena",
  "Arun",
  "Divya",
  "Manoj",
  "Latha",
  "Vijay",
  "Sunita",
];
const D = [
  "HR",
  "Accounts",
  "Sales",
  "Front Office",
  "Site Engineer",
  "IT",
  "Marketing",
];
export const EMPLOYEES = Array.from({ length: 400 }, (_, i) => ({
  id: "SG" + String(i + 1).padStart(4, "0"),
  name: N[i % 12] + " " + ["K", "S", "R", "M", "P"][i % 5],
  branch: BRANCHES[i % 4],
  dept: D[i % 7],
  salary: 12000 + ((i * 3719) % 48000),
  lop: i % 9 === 0 ? 2 : 0,
  status: "P",
}));
export const LEADS = [
  ["Rahul Mehta", "98450xxxxx", "Samruddhi Heights", "Site Visit"],
  ["Sneha Rao", "99020xxxxx", "Green City Plots", "New"],
  ["Imran Khan", "98860xxxxx", "Samruddhi Villas", "Negotiation"],
  ["Kavya N", "97410xxxxx", "Samruddhi Heights", "Booked"],
];
export const PROJECTS = [
  ["Samruddhi Heights", "2 & 3 BHK Apartments", "Under Construction"],
  ["Green City Plots", "Residential Plots", "Ready"],
  ["Samruddhi Villas", "4 BHK Villas", "New Launch"],
];
// Indian payroll rules (confirm with your CA before real use)
export function payslip(e) {
  const basic = e.salary * 0.5;
  const paid = (e.salary * (30 - e.lop)) / 30,
    b = (basic * (30 - e.lop)) / 30;
  const pf = Math.round(Math.min(b, 15000) * 0.12);
  const esi = e.salary <= 21000 ? Math.ceil(paid * 0.0075) : 0;
  const pt = paid > 15000 ? 200 : 0;
  return {
    gross: Math.round(paid),
    pf,
    esi,
    pt,
    net: Math.round(paid - pf - esi - pt),
  };
}
