import React from 'react'
import { Progress, ProgressLabel, ProgressValue } from '../ui/progress';
import type { Employee } from '@/types/task';

interface EmployeeWorloadProps{
    employee: Employee;
    value: number;
}
function EmployeeWorkload({ employee, value }: EmployeeWorloadProps) {
    const fullName = employee.first_name ? `${employee.first_name} ${employee.last_name?.charAt(0) ?? ''}` : 'none';
    const done = 20;
    const total = 40;
  return (
    <Progress key={employee.id} value={value ?? 20} className="mb-3 w-full ">
      <ProgressLabel className={`capitalize flex gap-2 items-center`}>
        <span className="text-black text-sm ">{fullName.trim()}</span>
        <span className="text-xs text-slate-500 mb-0">
          {employee.position ?? "none"}
        </span>
      </ProgressLabel>
      <ProgressValue className="text-slate-600">
        {() => `${done}/${total} · ${value} overdue`}
      </ProgressValue>
    </Progress>
  );
}

export default EmployeeWorkload;
