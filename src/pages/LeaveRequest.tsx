import { useContext, useState } from "react";
import MyRequests from "./LeaveRequestComponent/MyRequests";
import TeamRequests from "./LeaveRequestComponent/TeamRequests";
import Calendar from "./LeaveRequestComponent/Calendar";
import { AuthContext } from "@/context/AuthContext";

const ROLE = { ADMIN: 1, MANAGER: 2 }; // adjust to your real role ids

type TabKey = "my-request" | "team-request" | "calendar";

type Tab = {
  label: string;
  Component: React.ComponentType;
  roles?: number[]; // omitted = visible to everyone
};

const tabs: Record<TabKey, Tab> = {
  "my-request": { label: "My Requests", Component: MyRequests },
  "team-request": {
    label: "Team Requests",
    Component: TeamRequests,
    roles: [ROLE.ADMIN, ROLE.MANAGER],
  },
  calendar: {
    label: "Calendar",
    Component: Calendar,
    roles: [ROLE.ADMIN, ROLE.MANAGER],
  },
};

export default function LeaveRequest() {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState<TabKey>("my-request");
  const visibleTabs = (Object.keys(tabs) as TabKey[]).filter((key) => {
    const { roles } = tabs[key];
    return !roles || roles.includes(user.role.id);
  });

  // safety net: if `mode` points at a tab this user can't see, fall back
  const activeKey: TabKey = visibleTabs.includes(mode) ? mode : "my-request";
  const ActiveComponent = tabs[activeKey].Component;

  

  return (
    <div className="page">
      <div className="flex gap-2 w-full justify-start items-center">
        {visibleTabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`py-2 px-3 rounded shadow-md ${
              activeKey === key
                ? "bg-gray-50 text-black"
                : "bg-white opacity-60"
            }`}
          >
            {tabs[key].label}
          </button>
        ))}
      </div>

      <div className="main-content">
        <ActiveComponent />
      </div>
    </div>
  );
}
