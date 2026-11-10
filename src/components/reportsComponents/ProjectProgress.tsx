import React from 'react'
import { Progress, ProgressLabel, ProgressValue } from '../ui/progress';
import type { Project } from '@/types/project';

interface ProjectProgressProps{
    project: Project;
    value: number;
}
function ProjectProgress({ project, value }: ProjectProgressProps) {
    const done = 20;
    const total = 40;
  return (
    <Progress key={project.id} value={value ?? 20} className="mb-3 w-full ">
      <ProgressLabel className={`text-black text-sm capitalize`}>
        {project.name}
      </ProgressLabel>
      <ProgressValue className='text-slate-600'>{() => `${done}/${total} · ${value}%`}</ProgressValue>
    </Progress>
  );
}

export default ProjectProgress;
