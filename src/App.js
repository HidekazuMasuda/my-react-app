import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TodoApp from './pages/TodoApp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<TodoApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
