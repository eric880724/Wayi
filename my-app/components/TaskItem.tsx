// app/components/TaskItem.tsx - Create a component for each task item
'use client';

import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleStatus, onDelete }: TaskItemProps) {
  return (
    <li className="p-3 border-b hover:bg-gray-50 transition-colors flex justify-between items-center">
      <div className="flex-1">
        <h3 className={`font-medium ${task.is_completed ? "line-through text-gray-500" : ""}`}>
          {task.name}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {new Date(task.updated_at || task.created_at).toLocaleString()}
        </div>
      </div>
      <div className="flex">
        <button
          className={`mr-2 p-2 rounded ${task.is_completed ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"} hover:opacity-80 transition-opacity`}
          onClick={() => onToggleStatus(task.id, task.is_completed)}
          aria-label={task.is_completed ? "標記為未完成" : "標記為已完成"}
        >
          {task.is_completed ? "↩️" : "✓"}
        </button>
        <button
          className="p-2 rounded bg-red-100 text-red-600 hover:opacity-80 transition-opacity"
          onClick={() => onDelete(task.id)}
          aria-label="刪除任務"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}