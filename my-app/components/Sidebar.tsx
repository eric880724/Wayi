'use client';

import { useState } from 'react';
import { Task } from '../../types';
import TaskForm from './TaskForm';

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onAddTask: (task: { name: string; description: string }) => void;
  taskCounts: {
    all: number;
    completed: number;
    uncompleted: number;
  };
}

export default function Sidebar({ activeFilter, onFilterChange, onAddTask, taskCounts }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAddTaskClick = () => {
    setShowAddTaskForm(!showAddTaskForm);
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const handleTaskSubmit = (task: { name: string; description: string }) => {
    onAddTask(task);
    setShowAddTaskForm(false);
  };

  return (
    <aside 
      className={`sidebar-transition bg-white shadow-lg rounded-r-xl flex flex-col h-screen sticky top-0 left-0 z-10 
        ${isCollapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'}
        lg:h-[calc(100vh-2rem)] lg:my-4
        md:h-[calc(100vh-1.5rem)] md:my-3
        sm:h-[calc(100vh-1rem)] sm:my-2
        xs:h-screen xs:my-0
      `}
      style={{
        width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
        transition: 'width 0.3s ease'
      }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-indigo-600">待辦事項</h2>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          aria-label={isCollapsed ? "展開側邊欄" : "收起側邊欄"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          <li>
            <button
              onClick={() => onFilterChange('all')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors
                ${activeFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-xl mr-3">📋</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">全部待辦事項</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                    {taskCounts.all}
                  </span>
                </>
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onFilterChange('uncompleted')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors
                ${activeFilter === 'uncompleted' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-xl mr-3">⏳</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">未完成</span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                    {taskCounts.uncompleted}
                  </span>
                </>
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => onFilterChange('completed')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors
                ${activeFilter === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-xl mr-3">✅</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">已完成</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {taskCounts.completed}
                  </span>
                </>
              )}
            </button>
          </li>
        </ul>
      </nav>

      {/* Add Task Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleAddTaskClick}
          className={`w-full flex items-center justify-center p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors ${showAddTaskForm ? 'bg-indigo-700' : ''}`}
        >
          <span className="text-xl mr-2">➕</span>
          {!isCollapsed && <span>添加事項</span>}
        </button>
      </div>

      {/* Add Task Form Modal */}
      {showAddTaskForm && !isCollapsed && (
        <div className="absolute bottom-20 left-0 w-full p-4 bg-white shadow-lg rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">新增待辦事項</h3>
            <button 
              onClick={() => setShowAddTaskForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <TaskForm onSubmit={handleTaskSubmit} />
        </div>
      )}
    </aside>
  );
}
