import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import './App.css';
import App from './App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento raíz #root');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>,
);
