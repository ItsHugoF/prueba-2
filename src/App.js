// src/App.js
import React from 'react';
import { HashRouter } from 'react-router-dom';
import Enrutador from './rutas/Enrutador';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Enrutador />
    </HashRouter>
  );
}

export default App;

