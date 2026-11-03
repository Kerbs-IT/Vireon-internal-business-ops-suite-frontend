import ProjectFormDialog from "@/components/DialogForm/ProjectFormDialog";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const statusItems = {
  all: "All Status",
  active: "Active",
  "on-hold": "On-hold",
  completed: "Completed",
};

const statusColorPlatte = {
  active: "bg-orange-100 text-orange-500",
  "on-hold": "bg-slate-100 text-slate-500",
  completed: "bg-green-100 text-green-500",
};
const sampleData = [
  {
    id: 1,
    name: "Project 1",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus quod facere ipsa possimus fugit suscipit omnis. Architecto ea eligendi ducimus! Aliquam excepturi doloribus cupiditate ut eaque ratione nihil in quo.",
    status: "active",
    end_date: "Dec 23",
  },
  {
    id: 2,
    name: "Project 2",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus quod facere ipsa possimus fugit suscipit omnis. Architecto ea eligendi ducimus! Aliquam excepturi doloribus cupiditate ut eaque ratione nihil in quo.",
    status: "on-hold",
    end_date: "Nov 10",
  },
  {
    id: 3,
    name: "Project 3",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus quod facere ipsa possimus fugit suscipit omnis. Architecto ea eligendi ducimus! Aliquam excepturi doloribus cupiditate ut eaque ratione nihil in quo.",
    status: "completed",
    end_date: "Nov 28",
  },
];

type Member = {
  id: number;
  first_name: string;
  last_name: string;
};

const members: Member[] = [
  { id: 1, first_name: "Ana", last_name: "Reyes" },
  { id: 2, first_name: "Mark", last_name: "Cruz" },
  { id: 3, first_name: "James", last_name: "Lee" },
  { id: 4, first_name: "Sofia", last_name: "Santos" },
  { id: 5, first_name: "Carlo", last_name: "Dizon" },
];

const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-sky-500",
];

function Projects() {
  const [status, setStatus] = useState("all");
  const MAX = 3;
  const visible = members.slice(0, MAX);
  const extra = members.length - MAX;
  return (
    <div className="page">
      <div className="mb-5 flex justify-between items-center">
        <div className="left flex gap-1">
          <div className="search relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="search-bar"
              placeholder="Search by name or email.."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 "
            />
          </div>
          <div className="departments-dropdown">
            <Select
              value={status}
              onValueChange={(val) => setStatus(val)}
              items={statusItems}
            >
              <SelectTrigger
                id="checkout-exp-month-ts6"
                className="p-4.5 bg-white min-w-30"
                value="All-status"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(statusItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="right">
          <ProjectFormDialog
            trigger={
              <Button className="bg-linear-to-r from-orange-600 to-orange-400 hover:cursor-pointer">
                <Plus></Plus>
                New Project
              </Button>
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:grid-cols-2 md:grid-cols-2">
        {sampleData.map((project) => (
          <div
            key={project.id}
            className="projet-con group hover:cursor-pointer hover:shadow-lg p-4  transition duration-300 ease-in-out bg-white  rounded-md"
          >
            <div className="mb-2 flex justify-between items-center">
              <span
                className={`inline-block py-1.5 px-2 text-xs rounded-full  ${statusColorPlatte[project.status]} capitalize`}
              >
                {project.status}
              </span>
              <Pencil className="h-4 w-4 text-slate-500 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
            </div>

            <Link
              to={`/projects/${project.id}`}
              className=" hover:text-blue-500"
            >
              <h1 className="font-bold text-lg">{project.name}</h1>
            </Link>
            <p className="capitalize mb-2 text-wrap w-full line-clamp-2">
              {project.description ?? "none"}
            </p>
            {/* progres bar */}
            <Progress value={56} className="mb-3 w-full max-w-sm ">
              <ProgressLabel className={`text-slate-400 text-sm`}>
                Progress
              </ProgressLabel>
              <ProgressValue />
            </Progress>
            <div className="bottom-part flex justify-between items-center">
              <div className="flex items-center -space-x-1">
                {visible.map((m, i) => (
                  <div
                    key={m.id}
                    title={`${m.first_name} ${m.last_name}`}
                    className={`flex size-6 items-center justify-center rounded-full text-xs font-medium text-white ring-2 ring-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  >
                    {m.first_name.charAt(0)}
                    {m.last_name.charAt(0)}
                  </div>
                ))}
                {extra > 0 && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold ring-2 ring-white">
                    +{extra}
                  </div>
                )}
              </div>
              <div className="date flex gap-1 items-center justify-center">
                <Calendar className="text-slate-500 h-4 w-5" />
                <p className="text-xs text-slate-500 pb-0 mb-0">
                  {project.end_date ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
