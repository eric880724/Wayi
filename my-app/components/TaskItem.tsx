// app/components/TaskItem.tsx - Create a component for each task item
'use client';

import { useState } from 'react';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggleStatus, onDelete }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 安全地獲取任務屬性，防止錯誤
  const getTaskName = () => {
    try {
      return task?.name || "未知任務";
    } catch (error) {
      console.error("獲取任務名稱時發生錯誤:", error);
      return "未知任務";
    }
  };
  
  const getTaskDescription = () => {
    try {
      return task?.description || "";
    } catch (error) {
      console.error("獲取任務描述時發生錯誤:", error);
      return "";
    }
  };
  
  const getTaskId = () => {
    try {
      return task?.id || "";
    } catch (error) {
      console.error("獲取任務ID時發生錯誤:", error);
      return "";
    }
  };
  
  const isTaskCompleted = () => {
    try {
      return !!task?.is_completed;
    } catch (error) {
      console.error("獲取任務完成狀態時發生錯誤:", error);
      return false;
    }
  };
  
  const getTaskDate = () => {
    try {
      const dateString = task?.updated_at || task?.created_at;
      if (!dateString) return '無日期資訊';
      
      try {
        return new Date(dateString).toLocaleString();
      } catch (dateError) {
        console.error("解析日期時發生錯誤:", dateError);
        return '日期格式錯誤';
      }
    } catch (error) {
      console.error("獲取任務日期時發生錯誤:", error);
      return '無日期資訊';
    }
  };
  
  // 安全地處理點擊事件
  const handleToggleClick = () => {
    try {
      const id = getTaskId();
      const isCompleted = isTaskCompleted();
      if (id) {
        onToggleStatus(id, isCompleted);
      } else {
        console.error("無法切換任務狀態: 任務ID為空");
      }
    } catch (error) {
      console.error("處理任務狀態切換時發生錯誤:", error);
    }
  };
  
  const handleDeleteClick = () => {
    try {
      const id = getTaskId();
      if (id) {
        // 直接刪除，不顯示確認對話框
        onDelete(id);
      } else {
        console.error("無法刪除任務: 任務ID為空");
      }
    } catch (error) {
      console.error("處理任務刪除時發生錯誤:", error);
    }
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const isCompleted = isTaskCompleted();
  const taskName = getTaskName();
  const taskDescription = getTaskDescription();
  const hasDescription = !!taskDescription.trim();
  
  return (
    <li className="task-item-hover bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <button
            onClick={handleToggleClick}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-1
              ${isCompleted 
                ? "bg-green-500 border-green-500 text-white" 
                : "border-gray-300 hover:border-indigo-500"
              }`}
            aria-label={isCompleted ? "標記為未完成" : "標記為已完成"}
          >
            {isCompleted && "✓"}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 
                className={`font-medium text-lg break-words ${isCompleted ? "line-through text-gray-500" : "text-gray-900"}`}
                onClick={toggleExpand}
              >
                {taskName}
              </h3>
              
              <div className="flex items-center ml-2 space-x-1">
                {hasDescription && (
                  <button
                    onClick={toggleExpand}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    aria-label={isExpanded ? "收起詳情" : "展開詳情"}
                  >
                    {isExpanded ? "▲" : "▼"}
                  </button>
                )}
                
                <button
                  className="p-1 text-red-400 hover:text-red-600"
                  onClick={handleDeleteClick}
                  aria-label="刪除任務"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-1">
              {getTaskDate()}
            </div>
            
            {hasDescription && isExpanded && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-800">
                {taskDescription}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
