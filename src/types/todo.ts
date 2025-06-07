export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error: string;
}
