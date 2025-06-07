import React, { useState } from 'react';
import { Todo } from '../../types/todo';
import Button from './Button';
import Input from './Input';
import './TodoItem.css';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEditText: (id: number, text: string) => void;
  onEditDate: (id: number, date: string | null) => void;
  onStartEditingText: (id: number, text: string) => void;
  onStartEditingDate: (id: number, date: string | null) => void;
  isEditingText?: boolean;
  isEditingDate?: boolean;
  editingText?: string;
  editingDate?: string;
  onEditingTextChange?: (text: string) => void;
  onEditingDateChange?: (date: string) => void;
  onCancelEdit?: () => void;
  onCancelDateEdit?: () => void;
  editDateError?: string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEditText,
  onEditDate,
  onStartEditingText,
  onStartEditingDate,
  isEditingText = false,
  isEditingDate = false,
  editingText = '',
  editingDate = '',
  onEditingTextChange,
  onEditingDateChange,
  onCancelEdit,
  onCancelDateEdit,
  editDateError,
}) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const isOverdue = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const isDueToday = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  };

  const handleTextEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEditText(todo.id, editingText.trim());
    } else if (e.key === 'Escape') {
      onCancelEdit?.();
    }
  };

  const handleDateEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEditDate(todo.id, editingDate || null);
    } else if (e.key === 'Escape') {
      onCancelDateEdit?.();
    }
  };

  const itemClasses = [
    'todo-item',
    todo.completed ? 'todo-item--completed completed' : '',
    isOverdue(todo.dueDate) && !todo.completed ? 'todo-item--overdue overdue' : '',
    isDueToday(todo.dueDate) && !todo.completed ? 'todo-item--due-today due-today' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={itemClasses}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-item__checkbox todo-checkbox"
      />
      
      <div className="todo-item__content">
        {isEditingText ? (
          <Input
            value={editingText}
            onChange={(e) => onEditingTextChange?.(e.target.value)}
            onKeyDown={handleTextEditKeyDown}
            onBlur={() => onEditText(todo.id, editingText.trim())}
            className="todo-item__edit-input todo-edit-input"
            autoFocus
          />
        ) : (
          <span
            className="todo-item__text todo-text"
            onClick={() => onStartEditingText(todo.id, todo.text)}
          >
            {todo.text}
          </span>
        )}

        {isEditingDate ? (
          <div className="todo-item__date-edit">
            <Input
              value={editingDate}
              onChange={(e) => onEditingDateChange?.(e.target.value)}
              onKeyDown={handleDateEditKeyDown}
              onBlur={() => onEditDate(todo.id, editingDate || null)}
              placeholder="YYYY-MM-DD 形式で入力"
              className="todo-item__date-edit-input todo-date-edit-input"
              error={editDateError}
              autoFocus
            />
            <span className="todo-item__edit-hint">
              Enter: 保存 | Esc: キャンセル | 空: 削除
            </span>
          </div>
        ) : (
          <>
            {todo.dueDate ? (
              <span
                className="todo-item__due-date todo-due-date"
                onClick={() => onStartEditingDate(todo.id, todo.dueDate)}
              >
                期限: {formatDate(todo.dueDate)}
              </span>
            ) : (
              <span
                className="todo-item__add-date todo-add-date"
                onClick={() => onStartEditingDate(todo.id, '')}
              >
                期限を追加
              </span>
            )}
          </>
        )}
      </div>

      <Button
        variant="danger"
        size="small"
        onClick={() => onDelete(todo.id)}
        className="todo-item__delete-button delete-button"
      >
        削除
      </Button>
    </div>
  );
};

export default TodoItem;