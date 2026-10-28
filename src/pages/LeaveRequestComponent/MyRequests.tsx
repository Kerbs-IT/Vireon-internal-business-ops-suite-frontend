import RequestLeaveFormDialog from "@/components/DialogForm/RequestLeaveFormDialog";
import { Button } from "@/components/ui/button";
import { HeartPulse, Plus, TreePalm, User } from "lucide-react";

export default function MyRequests(){

    return (
      <div className="page">
        <div className="header-part w-full flex items-center justify-between my-5">
          <h3 className="text-slate-500">
            Your leave history and upcoming time off
          </h3>
          <RequestLeaveFormDialog
            trigger={
              <Button className="bg-orange-500 hover:bg-orange-600 hover:cursor-pointer">
                <Plus></Plus>
                Request leave
              </Button>
            }
          />
        </div>
        <div className="main-content w-full flex flex-col gap-2">
          <div className="item bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between">
            <div className="left-side flex gap-3 items-center">
              <TreePalm className="bg-orange-100  text-orange-500 rounded-sm h-10 w-10 p-2" />
              <div className="info">
                <h1 className="title font-bold">Vacation Leave</h1>
                <h3 className="text-slate-500 text-sm">
                  Mar 25, 2024 - Mar 28, 2024 · 4 days
                </h3>
              </div>
            </div>
            <div className="right-side">
              <span className="bg-red-100 text-sm text-red-900 p-2 rounded-2xl border-1 border-red-200">
                Rejected
              </span>
            </div>
          </div>
          {/* second item */}

          <div className="item bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between">
            <div className="left-side flex gap-3 items-center">
              <HeartPulse className="bg-orange-100  text-orange-500 rounded-sm h-10 w-10 p-2" />
              <div className="info">
                <h1 className="title font-bold">Sick Leave</h1>
                <h3 className="text-slate-500 text-sm">
                  Feb 25, 2024 - Feb 6, 2024 · 2 days
                </h3>
              </div>
            </div>
            <div className="right-side">
              <span className="bg-green-100 text-sm text-green-900 p-2 rounded-2xl border-1 border-green-200">
                Approved
              </span>
            </div>
          </div>
          {/* 3rd item */}
          <div className="item bg-white shadow-sm p-5 rounded-lg w-full flex items-center justify-between">
            <div className="left-side flex gap-3 items-center">
              <User className="bg-orange-100  text-orange-500 rounded-sm h-10 w-10 p-2" />
              <div className="info">
                <h1 className="title font-bold">Personal Leave</h1>
                <h3 className="text-slate-500 text-sm">
                  Jan 25, 2024 - Jan 25, 2024 · 1 days
                </h3>
              </div>
            </div>
            <div className="right-side">
              <span className="bg-green-100 text-sm text-green-900 p-2 rounded-2xl border-1 border-green-200">
                Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    );
}