import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { AdminSidebar } from "../components/layout/AdminSidebar";
export function AdminLayout() { return <><Header /><div className="lg:flex"><AdminSidebar /><div className="min-w-0 flex-1 bg-slate-50"><Outlet /></div></div></>; }
