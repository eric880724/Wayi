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
    const response = await axios.post(API_URL, { 
      ...task, 
      is_completed: false 
    });
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

export const updateTaskStatus = async (id: string, isCompleted: boolean): Promise<Task | null> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, { 
      is_completed: !isCompleted,
      updated_at: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    return null;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};