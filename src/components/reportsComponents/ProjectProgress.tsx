import React from 'react'
import { Progress, ProgressLabel, ProgressValue } from '../ui/progress';
import type { Project,ProjectCompletionReport } from '@/types/project';

interface ProjectCompletion{
  project: ProjectCompletionReport;
}
function ProjectProgress({project}: ProjectCompletion) {
  const done = project.completed_tasks_count;
  const total = project.total_tasks;
  const percentage = total > 0? Math.round((done / total) * 100) : 0;
  return (
    <Progress  value={percentage ?? 0} className="mb-3 w-full ">
      <ProgressLabel className={`text-black text-sm capitalize`}>
        {project.name}
      </ProgressLabel>
      <ProgressValue className="text-slate-600">
        {() => `${done}/${total} · ${percentage?? 0}%`}
      </ProgressValue>
    </Progress>
  );
}

export default ProjectProgress;
