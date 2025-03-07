// app/components/TaskForm.tsx - Create a component for the task form
'use client';

import { useState } from 'react';
import { NewTask } from '@/types';

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [newTask, setNewTask] = useState<NewTask>({ name: '', description: '' });
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.name.trim()) {
      setError('任務名稱為必填');
      return;
    }
    
    onSubmit(newTask);
    setNewTask({ name: '', description: '' });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <input
        className="border p-2 w-full rounded"
        placeholder="任務名稱 (最多10字)"
        maxLength={10}
        value={newTask.name}
        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
      />
      <input
        className="border p-2 w-full rounded mt-2"
        placeholder="任務描述 (最多30字)"
        maxLength={30}
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded mt-2 w-full"
      >
        ➕ 新增任務
      </button>
    </form>
  );
}