// app/page.tsx - Main page component
'use client';

import { useEffect, useState } from 'react';
import { Task } from '../../types';
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from '../api/tasks';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import FilterTabs from '../components/FilterTabs';

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      const data = await fetchTasks(filter);
      setTasks(data);
      setLoading(false);
    };
    getTasks();
  }, [filter]);

  const handleAddTask = async (newTask: { name: string; description: string }) => {
    const result = await addTask(newTask);
    if (result) {
      setTasks([result, ...tasks]);
    }
  };

  const handleToggleStatus = async (id: string, isCompleted: boolean) => {
    const result = await updateTaskStatus(id, isCompleted);
    if (result) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, is_completed: !isCompleted } : task
      ));
    }
  };

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">📋 待辦事項清單</h1>
        
        <TaskForm onSubmit={handleAddTask} />
        
        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
        
        {loading ? (
          <div className="py-10 text-center text-gray-500">載入中...</div>
        ) : tasks.length > 0 ? (
          <ul className="border rounded-lg divide-y">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {filter === 'all' 
              ? '目前沒有任何待辦事項' 
              : filter === 'completed' 
                ? '沒有已完成的事項' 
                : '沒有未完成的事項'}
          </div>
        )}
      </div>
    </div>
  );
}