import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Todo, ValidationResult } from '../types/todo';
import './TodoApp.css';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    // localStorage からデータを読み込む（初期化時のみ）
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos: Todo[] = JSON.parse(savedTodos);
        return parsedTodos;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse todos from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [dueDateValue, setDueDateValue] = useState<string>('');
  const [isManualDate, setIsManualDate] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [editingDateId, setEditingDateId] = useState<number | null>(null);
  const [editingDate, setEditingDate] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [editDateError, setEditDateError] = useState<string>('');

  // localStorageに保存するヘルパー関数
  const saveTodosToLocalStorage = (todosToSave: Todo[]): void => {
    if (!isClearing) {
      localStorage.setItem('todos', JSON.stringify(todosToSave));
    }
  };

  // 日付バリデーション関数
  const validateDate = (dateString: string): ValidationResult => {
    if (!dateString.trim()) {
      return { isValid: true, error: '' }; // 空の場合は有効（期限なしとして扱う）
    }

    // YYYY-MM-DD形式の正規表現チェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return { isValid: false, error: 'YYYY-MM-DD形式で入力してください' };
    }

    // 実際の日付として有効かチェック
    const date = new Date(dateString);
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    // Dateオブジェクトが正しく構築され、入力値と一致するかチェック
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    ) {
      return { isValid: false, error: '存在しない日付です' };
    }

    // 過去日チェック（今日より前の日付は無効）
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時間をリセットして日付のみで比較
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      return { isValid: false, error: '過去の日付は設定できません' };
    }

    return { isValid: true, error: '' };
  };

  const addTodo = (): void => {
    if (inputValue.trim() !== '') {
      // 手動入力の場合のみバリデーション
      if (isManualDate && dueDateValue) {
        const validation = validateDate(dueDateValue);
        if (!validation.isValid) {
          setDateError(validation.error);
          return;
        }
      }

      setDateError(''); // エラーをクリア
      const newTodos: Todo[] = [
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
          dueDate: dueDateValue || null,
        },
      ];
      setTodos(newTodos);
      saveTodosToLocalStorage(newTodos);
      setInputValue('');
      setDueDateValue('');
    }
  };

  const toggleTodo = (id: number): void => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
  };

  const deleteTodo = (id: number): void => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
  };

  const startEditing = (id: number, text: string): void => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id: number): void => {
    if (editingText.trim() !== '') {
      const newTodos = todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      );
      setTodos(newTodos);
      saveTodosToLocalStorage(newTodos);
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    id: number
  ): void => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const startEditingDate = (id: number, dueDate: string | null): void => {
    setEditingDateId(id);
    setEditingDate(dueDate || '');
  };

  const saveDateEdit = (id: number): void => {
    // 日付バリデーション
    if (editingDate) {
      const validation = validateDate(editingDate);
      if (!validation.isValid) {
        setEditDateError(validation.error);
        return;
      }
    }

    setEditDateError(''); // エラーをクリア
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, dueDate: editingDate || null } : todo
    );
    setTodos(newTodos);
    saveTodosToLocalStorage(newTodos);
    setEditingDateId(null);
    setEditingDate('');
  };

  const cancelDateEdit = (): void => {
    setEditingDateId(null);
    setEditingDate('');
    setEditDateError(''); // エラーもクリア
  };

  const handleDateEditKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    id: number
  ): void => {
    if (e.key === 'Enter') {
      saveDateEdit(id);
    } else if (e.key === 'Escape') {
      cancelDateEdit();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (
      e.key === 'Enter' &&
      (e.target as HTMLInputElement).className === 'todo-input'
    ) {
      addTodo();
    }
  };

  const handleDateValueChange = (value: string): void => {
    setDueDateValue(value);
    if (dateError) {
      setDateError(''); // 入力時にエラーをクリア
    }
  };

  const handleEditDateChange = (value: string): void => {
    setEditingDate(value);
    if (editDateError) {
      setEditDateError(''); // 入力時にエラーをクリア
    }
  };

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

  const clearAllData = (): void => {
    const confirmClear = window.confirm(
      'すべてのTODOデータを削除します。この操作は元に戻せません。よろしいですか？'
    );

    if (confirmClear) {
      setIsClearing(true);
      localStorage.removeItem('todos');
      setTodos([]);
      setTimeout(() => setIsClearing(false), 100);
    }
  };

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h1>TODOアプリ</h1>

        <div className="todo-input-section">
          <div className="main-input-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="新しいタスクを入力..."
              className="todo-input"
            />
            <button onClick={addTodo} className="add-button">
              追加
            </button>
          </div>

          <div className="date-input-section">
            <div className="date-input-toggle">
              <label>
                期限日（任意）:
                <button
                  type="button"
                  onClick={() => setIsManualDate(!isManualDate)}
                  className="toggle-date-input"
                >
                  {isManualDate ? 'カレンダー入力' : '手動入力'}
                </button>
              </label>
            </div>

            {isManualDate ? (
              <>
                <input
                  type="text"
                  value={dueDateValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDateValueChange(e.target.value)
                  }
                  placeholder="YYYY-MM-DD 形式で入力"
                  className={`date-input manual ${dateError ? 'error' : ''}`}
                />
                {dateError && (
                  <span className="error-message">{dateError}</span>
                )}
              </>
            ) : (
              <input
                type="date"
                value={dueDateValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateValueChange(e.target.value)
                }
                className="date-input calendar"
              />
            )}
          </div>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-message">
              まだタスクがありません。新しいタスクを追加してください。
            </p>
          ) : (
            todos.map((todo: Todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''} ${isDueToday(todo.dueDate) && !todo.completed ? 'due-today' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <div className="todo-content">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEditingText(e.target.value)
                      }
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                        handleEditKeyDown(e, todo.id)
                      }
                      onBlur={() => saveEdit(todo.id)}
                      className="todo-edit-input"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="todo-text"
                      onClick={() => startEditing(todo.id, todo.text)}
                      style={{ cursor: 'pointer' }}
                    >
                      {todo.text}
                    </span>
                  )}
                  {editingDateId === todo.id ? (
                    <div className="todo-date-edit">
                      <input
                        type="text"
                        value={editingDate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleEditDateChange(e.target.value)
                        }
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                          handleDateEditKeyDown(e, todo.id)
                        }
                        onBlur={() => saveDateEdit(todo.id)}
                        className={`todo-date-edit-input ${editDateError ? 'error' : ''}`}
                        placeholder="YYYY-MM-DD 形式で入力"
                        autoFocus
                      />
                      <span className="edit-hint">
                        Enter: 保存 | Esc: キャンセル | 空: 削除
                      </span>
                      {editDateError && (
                        <span className="error-message">{editDateError}</span>
                      )}
                    </div>
                  ) : (
                    <>
                      {todo.dueDate ? (
                        <span
                          className="todo-due-date"
                          onClick={() =>
                            startEditingDate(todo.id, todo.dueDate)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          期限: {formatDate(todo.dueDate)}
                        </span>
                      ) : (
                        <span
                          className="todo-add-date"
                          onClick={() => startEditingDate(todo.id, '')}
                          style={{ cursor: 'pointer' }}
                        >
                          期限を追加
                        </span>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  削除
                </button>
              </div>
            ))
          )}
        </div>

        <div className="todo-stats">
          <p>
            全体: {todos.length} | 完了:{' '}
            {todos.filter((todo: Todo) => todo.completed).length} | 未完了:{' '}
            {todos.filter((todo: Todo) => !todo.completed).length}
          </p>
          <button onClick={clearAllData} className="clear-data-button">
            すべてのデータを削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
