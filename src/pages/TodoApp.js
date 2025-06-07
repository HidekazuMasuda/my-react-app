import { useState, useEffect } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDateValue, setDueDateValue] = useState('');
  const [isManualDate, setIsManualDate] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDateId, setEditingDateId] = useState(null);
  const [editingDate, setEditingDate] = useState('');

  // localStorage からデータを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
        setTodos([]);
      }
    } else {
      setTodos([]);
    }
    setIsInitialized(true);
  }, []);

  // todosが変更されたらlocalStorageに保存（初期化後のみ、クリア中は除く）
  useEffect(() => {
    if (isInitialized && !isClearing) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isInitialized, isClearing]);

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

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const startEditingDate = (id, dueDate) => {
    setEditingDateId(id);
    setEditingDate(dueDate || '');
  };

  const saveDateEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, dueDate: editingDate || null } : todo
    ));
    setEditingDateId(null);
    setEditingDate('');
  };

  const cancelDateEdit = () => {
    setEditingDateId(null);
    setEditingDate('');
  };

  const handleDateEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveDateEdit(id);
    } else if (e.key === 'Escape') {
      cancelDateEdit();
    }
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
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
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
                        type="date"
                        value={editingDate}
                        onChange={(e) => setEditingDate(e.target.value)}
                        onKeyDown={(e) => handleDateEditKeyDown(e, todo.id)}
                        onBlur={() => saveDateEdit(todo.id)}
                        className="todo-date-edit-input"
                        autoFocus
                      />
                      <span className="edit-hint">Enter: 保存 | Esc: キャンセル | 空: 削除</span>
                    </div>
                  ) : (
                    <>
                      {todo.dueDate ? (
                        <span 
                          className="todo-due-date"
                          onClick={() => startEditingDate(todo.id, todo.dueDate)}
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