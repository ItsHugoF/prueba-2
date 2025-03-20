// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Enrutador from './rutas/Enrutador';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Enrutador />
    </BrowserRouter>
  );
}

export default App;

