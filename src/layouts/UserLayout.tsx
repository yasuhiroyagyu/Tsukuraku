import { Outlet } from "react-router-dom";
import { BottomNavigation } from "../components/layout/BottomNavigation";
import { Header } from "../components/layout/Header";
export function UserLayout() { return <><Header /><Outlet /><BottomNavigation /></>; }
