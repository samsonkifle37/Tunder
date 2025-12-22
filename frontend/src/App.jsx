import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data fetch
    const initData = async () => {
      try {
        await axios.get('http://localhost:5000/api/refresh');
        setLoading(false);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setLoading(false);
      }
    };
    initData();
  }, []);

  if (loading) {
    return <div className="loading">Loading Thunderball Data...</div>;
  }

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
