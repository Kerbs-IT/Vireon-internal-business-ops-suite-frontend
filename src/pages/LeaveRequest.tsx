import { useState } from "react";
import MyRequests from "./LeaveRequestComponent/MyRequests";
import TeamRequests from "./LeaveRequestComponent/TeamRequests";
import Calendar from "./LeaveRequestComponent/Calendar";

const tabs = {
  "my-request": { label: "My Requests", Component: MyRequests },
  "team-request": { label: "Team Requests", Component: TeamRequests },
  calendar: { label: "Calendar", Component: Calendar },
} as const;

type TabKey = keyof typeof tabs;

export default function LeaveRequest() {
  const [mode, setMode] = useState<TabKey>("my-request");
  const ActiveTab = tabs[mode].Component;

  return (
    <div className="page">
      <div className="flex gap-2 w-full justify-start items-center">
        {(Object.keys(tabs) as TabKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`p-2 rounded shadow  ${
              mode === key ? "bg-gray-50 text-black" : "bg-white opacity-60"
            }`}
          >
            {tabs[key].label}
          </button>
        ))}
      </div>

      <div className="main-content">
        <ActiveTab />
      </div>
    </div>
  );
}
