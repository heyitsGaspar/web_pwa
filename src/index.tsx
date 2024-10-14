import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import reportWebVitals from './reportWebVitals.js';
import * as serviceWorkerRegistration from './services/serviceWorkerRegistration.ts';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registramos el service worker para habilitar la funcionalidad PWA
serviceWorkerRegistration.register();
reportWebVitals();
