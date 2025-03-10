// app/api/tasks.ts - Create this file for API functions
import axios from 'axios';
import { Task, NewTask } from '../../types';

const API_URL = "https://wayi.league-funny.com/api/task";

export const fetchTasks = async (filter: string = 'all'): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_URL}?type=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const addTask = async (task: NewTask): Promise<Task | null> => {
  try {
    // 確保任務名稱和描述不為空
    if (!task.name.trim()) {
      console.error("Task name cannot be empty");
      return null;
    }
    
    const now = new Date().toISOString();
    const taskData = { 
      ...task, 
      is_completed: false,
      created_at: now,
      updated_at: now
    };
    
    try {
      const response = await axios.post(API_URL, taskData);
      
      // 驗證返回的數據
      if (response.data && typeof response.data === 'object') {
        // 如果API返回的數據不完整，使用本地創建的任務數據補充
        if (!response.data.id) {
          console.warn("API response missing ID, generating local ID");
          response.data.id = 'local-' + Date.now();
        }
        
        if (response.data.name === undefined) {
          response.data.name = task.name;
        }
        
        if (response.data.description === undefined) {
          response.data.description = task.description || '';
        }
        
        if (response.data.is_completed === undefined) {
          response.data.is_completed = false;
        }
        
        if (!response.data.created_at) {
          response.data.created_at = now;
        }
        
        if (!response.data.updated_at) {
          response.data.updated_at = now;
        }
        
        return response.data as Task;
      } else {
        // 如果API返回的數據無效，創建一個本地任務對象
        console.error("Invalid response data:", response.data);
        return {
          id: 'local-' + Date.now(),
          name: task.name,
          description: task.description || '',
          is_completed: false,
          created_at: now,
          updated_at: now
        };
      }
    } catch (apiError) {
      console.error("API error:", apiError);
      // 如果API調用失敗，創建一個本地任務對象
      return {
        id: 'local-' + Date.now(),
        name: task.name,
        description: task.description || '',
        is_completed: false,
        created_at: now,
        updated_at: now
      };
    }
  } catch (error) {
    console.error("Error in addTask function:", error);
    return null;
  }
};

export const updateTaskStatus = async (id: string, isCompleted: boolean): Promise<Task | null> => {
  try {
    if (!id) {
      console.error("Task ID is required");
      return null;
    }
    
    const now = new Date().toISOString();
    const newStatus = !isCompleted;
    const updateData = { 
      is_completed: newStatus,
      updated_at: now
    };
    
    try {
      const response = await axios.patch(`${API_URL}/${id}`, updateData);
      
      // 驗證返回的數據
      if (response.data && typeof response.data === 'object') {
        // 確保返回的數據包含必要的字段
        if (!response.data.id) {
          response.data.id = id;
        }
        
        if (response.data.is_completed === undefined) {
          response.data.is_completed = newStatus;
        }
        
        if (!response.data.updated_at) {
          response.data.updated_at = now;
        }
        
        return response.data as Task;
      } else {
        console.error("Invalid response data:", response.data);
        // 如果API返回的數據無效，返回一個模擬的更新後的任務
        // 注意：這需要在前端保存任務的完整數據
        return null;
      }
    } catch (apiError) {
      console.error("API error:", apiError);
      return null;
    }
  } catch (error) {
    console.error("Error in updateTaskStatus function:", error);
    return null;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      console.error("Task ID is required");
      return false;
    }
    
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};
