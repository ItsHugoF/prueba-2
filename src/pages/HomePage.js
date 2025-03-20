import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');
  const [iconColor, setIconColor] = useState('icono-rojo');
  const [fechaHora, setFechaHora] = useState('');
  const [cronometro, setCronometro] = useState('00:00:00');
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (!estaLogueado()) {
      navigate('/');
      return;
    }

    const relojInt = setInterval(() => {
      const ahora = new Date();
      setFechaHora(
        `Hoy es ${ahora.toLocaleDateString('es-ES')}, hora: ${ahora.toLocaleTimeString('es-ES')}`
      );
    }, 1000);

    if (localStorage.getItem('isFichado') === 'true') {
      const start = localStorage.getItem('fichadoStart');
      if (start) iniciarCronometroContinuo(parseInt(start, 10));
    }

    actualizarIconoConexion();
    window.addEventListener('online', actualizarIconoConexion);
    window.addEventListener('offline', actualizarIconoConexion);

    if (navigator.connection) {
      navigator.connection.addEventListener('change', actualizarIconoConexion);
    }

    return () => {
      clearInterval(relojInt);
      window.removeEventListener('online', actualizarIconoConexion);
      window.removeEventListener('offline', actualizarIconoConexion);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', actualizarIconoConexion);
      }
    };
  }, [navigate]);

  function estaLogueado() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  function cerrarSesion() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('empresa');
    localStorage.removeItem('usuario');
    localStorage.removeItem('isFichado');
    localStorage.removeItem('fichadoStart');
    navigate('/');
  }

  function iniciarCronometro() {
    localStorage.setItem('isFichado', 'true');
    const now = Date.now();
    localStorage.setItem('fichadoStart', now.toString());
    arrancarIntervaloCronometro(now);
  }

  function iniciarCronometroContinuo(start) {
    arrancarIntervaloCronometro(start);
  }

  function arrancarIntervaloCronometro(start) {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
    }
    intervaloRef.current = setInterval(() => {
      const transcurrido = Date.now() - start;
      setCronometro(formatearTiempo(transcurrido));
    }, 1000);
  }

  function detenerCronometro() {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    setCronometro('00:00:00');
    localStorage.setItem('isFichado', 'false');
    localStorage.removeItem('fichadoStart');
  }

  function formatearTiempo(ms) {
    let totalSegundos = Math.floor(ms / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    totalSegundos %= 3600;
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    const hStr = String(horas).padStart(2, '0');
    const mStr = String(minutos).padStart(2, '0');
    const sStr = String(segundos).padStart(2, '0');
    return `${hStr}:${mStr}:${sStr}`;
  }

  function actualizarIconoConexion() {
    if (!navigator.onLine) {
      setIconColor('icono-rojo');
      return;
    }
    if (!navigator.connection || !navigator.connection.effectiveType) {
      setIconColor('icono-verde');
      return;
    }
    const tipo = navigator.connection.effectiveType;
    switch (tipo) {
      case '4g':
      case 'wifi':
        setIconColor('icono-verde');
        break;
      case '3g':
        setIconColor('icono-amarillo');
        break;
      case '2g':
      case 'slow-2g':
        setIconColor('icono-rojo');
        break;
      default:
        setIconColor('icono-amarillo');
        break;
    }
  }

  function handleFichar() {
    iniciarCronometro();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;
          const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
          setMensaje(`
            <p>Estás fichando en:</p>
            <ul>
              <li>Latitud: <strong>${lat.toFixed(6)}</strong></li>
              <li>Longitud: <strong>${lon.toFixed(6)}</strong></li>
              <li>Precisión: ±${Math.round(accuracy)} metros</li>
            </ul>
            <a href="${mapsLink}" target="_blank">Ver ubicación en Google Maps</a>
          `);
        },
        (error) => {
          setIconColor('icono-rojo');
          setMensaje("Error al obtener ubicación: " + error.message);
        }
      );
    } else {
      setMensaje("La geolocalización no está soportada.");
      setIconColor('icono-rojo');
    }
  }

  function handleSalir() {
    detenerCronometro();
    setMensaje("Has salido (pero sigues logueado).");
  }

  function handleCerrarSesion() {
    cerrarSesion();
  }

  function handleOpcion1() {
    alert("Opción 1 - Sin funcionalidad");
  }

  return (
    <div>
      <header>
        <img src="/marka_informatica.jpg" alt="Logo empresa" className="logo" />
        <h1>Control de Presencia</h1>
      </header>

      <div className="icon-container">
        <i className={`fas fa-satellite-dish ${iconColor}`}></i>
      </div>

      <div className="botones">
        <button onClick={handleFichar}>Entrar</button>
        <button onClick={handleSalir}>Salir</button>
      </div>

      <div className="tiempo-info">
        <p>{fechaHora}</p>
      </div>
      <p className="cronometro">{cronometro}</p>

      <div
        className="mensaje"
        dangerouslySetInnerHTML={{ __html: mensaje }}
      ></div>

      <footer className="barra-inferior">
        <button onClick={handleOpcion1}>Opción 1</button>
        <button disabled>Iniciar Sesión</button>
        <button onClick={handleCerrarSesion}>Cerrar Sesión</button>
      </footer>
    </div>
  );
}
