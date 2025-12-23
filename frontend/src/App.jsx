import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  // Dashboard handles data loading
  return (
    <div className="app-container">
      <header>
        <h1>⚡ Thunderball Analyzer</h1>
        <p>Statistical Analysis & Smart Generator</p>
      </header>
      <main>
        <Dashboard />
      </main>
      <footer>
        <p>*Numbers are generated for fun only. No guaranteed winning outcome.*</p>
      </footer>
    </div>
  );
}

export default App;
