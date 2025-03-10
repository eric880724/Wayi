// app/components/TaskForm.tsx - Create a component for the task form
'use client';

import { useState } from 'react';
import { NewTask } from '../../types';

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-black"
          placeholder="任務名稱 (最多20字)"
          maxLength={20}
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          required
          autoFocus
        />
      </div>
      
      <div>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-black"
          placeholder="任務描述 (選填，最多50字)"
          maxLength={50}
          rows={2}
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
      >
        <span className="mr-2">➕</span>
        新增任務
      </button>
    </form>
  );
}
