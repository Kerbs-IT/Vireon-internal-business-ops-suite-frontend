import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toaster } from "./components/ui/toast";

export function Layout(){

    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-6 bg-slate-100 overflow-y-auto">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </div>
    );
}