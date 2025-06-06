import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/global.css';

// Initialiser le mode sombre avant le rendu
const darkMode = localStorage.getItem('darkMode') === 'true';
if (darkMode) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
