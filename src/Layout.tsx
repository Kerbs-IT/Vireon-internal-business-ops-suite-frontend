import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toaster } from "./components/ui/toast";

export function Layout(){

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-slate-100">
                    <Outlet />
                    <Toaster />
                </main>
            </div>
        </div>
    );
}