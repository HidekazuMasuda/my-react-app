import { useState, useEffect } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDateValue, setDueDateValue] = useState('');
  const [isManualDate, setIsManualDate] = useState(false);

  // localStorage からデータを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
      }
    }
  }, []);

  // todosが変更されたらlocalStorageに保存（初期状態は除く）
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    // 初期状態（空配列）かつlocalStorageにデータがない場合は保存しない
    if (todos.length > 0 || savedTodos) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
          dueDate: dueDateValue || null
        }
      ]);
      setInputValue('');
      setDueDateValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.className === 'todo-input') {
      addTodo();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  };

  const clearAllData = () => {
    const confirmClear = window.confirm(
      'すべてのTODOデータを削除します。この操作は元に戻せません。よろしいですか？'
    );
    
    if (confirmClear) {
      localStorage.removeItem('todos');
      setTodos([]);
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
              onChange={(e) => setInputValue(e.target.value)}
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
              <input
                type="text"
                value={dueDateValue}
                onChange={(e) => setDueDateValue(e.target.value)}
                placeholder="YYYY-MM-DD 形式で入力"
                className="date-input manual"
              />
            ) : (
              <input
                type="date"
                value={dueDateValue}
                onChange={(e) => setDueDateValue(e.target.value)}
                className="date-input calendar"
              />
            )}
          </div>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-message">まだタスクがありません。新しいタスクを追加してください。</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''} ${isDueToday(todo.dueDate) && !todo.completed ? 'due-today' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <div className="todo-content">
                  <span className="todo-text">{todo.text}</span>
                  {todo.dueDate && (
                    <span className="todo-due-date">
                      期限: {formatDate(todo.dueDate)}
                    </span>
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
            全体: {todos.length} | 
            完了: {todos.filter(todo => todo.completed).length} | 
            未完了: {todos.filter(todo => !todo.completed).length}
          </p>
          <button onClick={clearAllData} className="clear-data-button">
            すべてのデータを削除
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;