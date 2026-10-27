import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import {  Bot, Building, Building2, CalendarCheck, ChartBarDecreasing, KanbanSquare, LayoutDashboard, Users, } from "lucide-react";


interface NavItem {
    label: string;
    path:string;
    roles?: string[];
    icon: React.ReactNode;
}

const navItems:NavItem[] =[
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard/> },
    { label: "Employees", path: "/employees", roles: ["admin", "manager"], icon: <Users /> },
    { label: "Departments", path: "/departments", roles: ["admin"], icon:<Building2 /> },
    { label: "Leave Requests", path: "/leave-requests", icon: <CalendarCheck />},
    { label: "Projects", path: "/projects" ,icon:<KanbanSquare />},
    { label: "Reports", path: "/reports", icon: <ChartBarDecreasing/> },
    { label: "AI Assistant", path: "/ai-assistant",icon: <Bot /> },
]




export default function Sidebar() {
    const auth = useContext(AuthContext);
    const roleName = auth?.user?.role?.name;
   

    // filter the navitem only allowed to the authenticated user
     const visibleItems = navItems.filter(
    (item) => !item.roles || (roleName && item.roles.includes(roleName))
  );
    return (
        <aside className="w-56 bg-slate-900 text-slate-200 p-4 space-y-1">
            {
                visibleItems.map((item) => (
                    <NavLink key={item.path} to={item.path}
                     className={({ isActive }) =>
                        `flex gap-2 items-center justify-start px-3 py-2 rounded-md text-sm ${
                        isActive ? "bg-slate-700 text-white" : "hover:bg-slate-800"
                        }`
                    }>
                        {item.icon}
                        <span className="inline-block">{item.label}</span>
                    </NavLink>
                ))
           }
        </aside>

    );
}