import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [name, setName] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="welcome-section">
          <h1>ようこそ{name ? `${name}さん` : ''}！</h1>
          <div className="input-section">
            <label htmlFor="nameInput">お名前を入力してください：</label>
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="お名前"
              className="name-input"
            />
          </div>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
