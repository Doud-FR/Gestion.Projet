import React from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

interface GanttChartProps {
  tasks: Task[];
  viewMode?: ViewMode;
  onTaskClick?: (task: Task) => void;
  onDateChange?: (task: Task, start: Date, end: Date) => void;
  onProgressChange?: (task: Task, progress: number) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  viewMode = ViewMode.Day,
  onTaskClick,
  onDateChange,
  onProgressChange
}) => {
  return (
    <div className="gantt-container bg-white dark:bg-gray-800 rounded-lg p-4">
      {tasks.length > 0 && (
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onClick={onTaskClick}
          onDateChange={onDateChange}
          onProgressChange={onProgressChange}
          listCellWidth=""
          columnWidth={65}
          ganttHeight={400}
        />
      )}
    </div>
  );
};

export default GanttChart;
