import { useState } from 'react';
import './TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false
        }
      ]);
      setInputValue('');
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h1>TODOアプリ</h1>
        
        <div className="todo-input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいタスクを入力..."
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">
            追加
          </button>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-message">まだタスクがありません。新しいタスクを追加してください。</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
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
        </div>
      </div>
    </div>
  );
}

export default TodoApp;