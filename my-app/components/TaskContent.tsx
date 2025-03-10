'use client';

import { useState } from 'react';
import { Task } from '../../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

interface TaskContentProps {
  tasks: Task[];
  filter: string;
  loading: boolean;
  onToggleStatus: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onAddTask: (task: { name: string; description: string }) => void;
}

export default function TaskContent({ 
  tasks, 
  filter, 
  loading, 
  onToggleStatus, 
  onDelete,
  onAddTask
}: TaskContentProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddTask = (task: { name: string; description: string }) => {
    onAddTask(task);
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
            {filter === 'all' 
              ? '全部待辦事項' 
              : filter === 'completed' 
                ? '已完成事項' 
                : '未完成事項'}
          </h1>
          
          <button
            onClick={toggleAddForm}
            className="md:hidden bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
            aria-label="新增任務"
          >
            {showAddForm ? '✕' : '➕'}
          </button>
        </div>
        
        {/* Mobile Add Task Form */}
        {showAddForm && (
          <div className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-3">新增待辦事項</h2>
            <TaskForm onSubmit={handleAddTask} />
          </div>
        )}
        
        {/* Desktop Add Task Form */}
        <div className="hidden md:block mb-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-700 mb-3">新增待辦事項</h2>
          <TaskForm onSubmit={onAddTask} />
        </div>
        
        {/* Task List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">載入中...</p>
          </div>
        ) : tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">
              {filter === 'all' 
                ? '📋' 
                : filter === 'completed' 
                  ? '✅' 
                  : '⏳'}
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {filter === 'all' 
                ? '目前沒有任何待辦事項' 
                : filter === 'completed' 
                  ? '沒有已完成的事項' 
                  : '沒有未完成的事項'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? '點擊添加按鈕來創建您的第一個任務' 
                : filter === 'completed' 
                  ? '完成一些任務後，它們將顯示在這裡' 
                  : '所有任務都已完成！'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
