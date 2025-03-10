// app/page.tsx - Main page component
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task } from '../../types';
import { fetchTasks, addTask, updateTaskStatus, deleteTask } from '../api/tasks';
import Sidebar from '../components/Sidebar';
import TaskContent from '../components/TaskContent';

export default function TodoApp() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // 獲取所有任務
  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks('all');
      setAllTasks(data);
      filterTasks(data, filter);
    } catch (error) {
      console.error("獲取任務時發生錯誤:", error);
    } finally {
      setLoading(false);
    }
  };

  // 驗證任務數據
  const validateTask = (task: any): task is Task => {
    return (
      task &&
      typeof task === 'object' &&
      typeof task.id === 'string' &&
      typeof task.name === 'string' &&
      typeof task.is_completed === 'boolean'
    );
  };

  // 根據過濾條件顯示任務
  const filterTasks = useCallback((tasks: Task[], currentFilter: string) => {
    if (!Array.isArray(tasks)) {
      tasks = [];
    }
    
    // 過濾掉無效的任務數據
    const validTasks = tasks.filter(validateTask);
    
    switch (currentFilter) {
      case 'completed':
        setDisplayedTasks(validTasks.filter(task => task.is_completed));
        break;
      case 'uncompleted':
        setDisplayedTasks(validTasks.filter(task => !task.is_completed));
        break;
      default:
        setDisplayedTasks(validTasks);
        break;
    }
  }, []);

  // 計算任務數量
  const getTaskCounts = useCallback(() => {
    if (!Array.isArray(allTasks)) {
      return { all: 0, completed: 0, uncompleted: 0 };
    }
    
    const validTasks = allTasks.filter(validateTask);
    const completed = validTasks.filter(task => task.is_completed).length;
    
    return {
      all: validTasks.length,
      completed,
      uncompleted: validTasks.length - completed
    };
  }, [allTasks]);

  // 初始加載和過濾器變更時獲取任務
  useEffect(() => {
    fetchAllTasks();
  }, []);

  // 當過濾器變更時，重新過濾任務
  useEffect(() => {
    filterTasks(allTasks, filter);
  }, [filter, allTasks, filterTasks]);

  const handleAddTask = async (newTask: { name: string; description: string }) => {
    try {
      // 驗證任務名稱不為空
      if (!newTask.name.trim()) {
        console.error("任務名稱不能為空");
        return;
      }
      
      const result = await addTask(newTask);
      
      if (result && validateTask(result)) {
        // 更新所有任務列表
        setAllTasks(prevTasks => {
          const tasksArray = Array.isArray(prevTasks) ? prevTasks : [];
          return [result, ...tasksArray];
        });
      } else {
        console.error("添加任務失敗: API 返回無效結果");
      }
    } catch (error) {
      console.error("添加任務時發生錯誤:", error);
    }
  };
  
  const handleToggleStatus = async (id: string, isCompleted: boolean) => {
    try {
      // 驗證任務ID
      if (!id) {
        console.error("任務ID不能為空");
        return;
      }
      
      // 安全地獲取當前任務
      let currentTask: Task | undefined;
      
      try {
        currentTask = allTasks.find(task => task.id === id);
      } catch (findError) {
        console.error("查找任務時發生錯誤:", findError);
      }
      
      if (!currentTask) {
        console.error("找不到指定ID的任務:", id);
        return;
      }
      
      // 創建一個更新後的任務對象
      const now = new Date().toISOString();
      const updatedTask: Task = {
        ...currentTask,
        is_completed: !isCompleted,
        updated_at: now
      };
      
      // 安全地更新UI，提供即時反饋
      setAllTasks(prevTasks => {
        const tasksArray = Array.isArray(prevTasks) ? prevTasks : [];
        return tasksArray.map(task => task.id === id ? updatedTask : task);
      });
      
      // 嘗試調用API更新任務狀態
      try {
        await updateTaskStatus(id, isCompleted);
      } catch (apiError) {
        console.error("調用API更新任務狀態時發生錯誤:", apiError);
        
        // 如果API調用失敗，恢復原始狀態
        setAllTasks(prevTasks => {
          const tasksArray = Array.isArray(prevTasks) ? prevTasks : [];
          return tasksArray.map(task => task.id === id ? currentTask! : task);
        });
      }
    } catch (error) {
      console.error("處理任務狀態切換時發生錯誤:", error);
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    try {
      // 驗證任務ID
      if (!id) {
        console.error("任務ID不能為空");
        return;
      }
      
      // 保存被刪除的任務，以便在API調用失敗時恢復
      const deletedTask = allTasks.find(task => task.id === id);
      const deletedTaskIndex = allTasks.findIndex(task => task.id === id);
      
      // 安全地從UI中移除任務，提供即時反饋
      setAllTasks(prevTasks => {
        const tasksArray = Array.isArray(prevTasks) ? prevTasks : [];
        return tasksArray.filter(task => task.id !== id);
      });
      
      // 嘗試調用API刪除任務，但不阻止UI刪除操作
      try {
        // 檢查是否為本地生成的ID（以"local-"開頭）
        if (id.startsWith('local-')) {
          console.log("刪除本地任務，無需調用API");
          return; // 本地任務不需要調用API刪除
        }
        
        const success = await deleteTask(id);
        if (!success) {
          console.error("API刪除任務失敗，但UI已更新");
        }
      } catch (apiError) {
        console.error("調用API刪除任務時發生錯誤:", apiError);
        // 即使API調用失敗，也保持UI刪除狀態
      }
    } catch (error) {
      console.error("處理任務刪除時發生錯誤:", error);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    // 在移動設備上，選擇過濾器後關閉側邊欄
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-600">待辦事項清單</h1>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          aria-label={isMobileMenuOpen ? "關閉選單" : "開啟選單"}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>
      
      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleMobileMenu}>
          <div className="w-[80%] max-w-xs h-full bg-white" onClick={e => e.stopPropagation()}>
            <Sidebar 
              activeFilter={filter} 
              onFilterChange={handleFilterChange} 
              onAddTask={handleAddTask}
              taskCounts={getTaskCounts()}
            />
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          activeFilter={filter} 
          onFilterChange={handleFilterChange} 
          onAddTask={handleAddTask}
          taskCounts={getTaskCounts()}
        />
      </div>
      
      {/* Main Content */}
      <TaskContent 
        tasks={displayedTasks}
        filter={filter}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteTask}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
