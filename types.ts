// types.ts - Create this file in the root of your project
export interface Task {
    id: string;
    name: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface NewTask {
    name: string;
    description: string;
  }