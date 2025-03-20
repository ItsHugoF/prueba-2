import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [empresa, setEmpresa] = useState('');
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function cargarUsuarios() 
        {
            try
            {
                const resp = await fetch('/data/users.json');
                if (!resp.ok) throw new Error('No se pudo cargar users.json');
                const data = await resp.json();
                setUsuarios(data);
            } catch (err) {
                console.log(err);
                setError('Error cargando los usuarios');
            }
        }
        cargarUsuarios();
    }, []);

    function iniciarSesion(empresa, usuario, contraseña){
        const encontrado = usuarios.find(u => 
            u.empresa === empresa &&
            u.usuario === usuario &&
            u.contraseña === contraseña
        );

        if(encontrado){
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('empresa', empresa);
            localStorage.setItem('usuario', usuario);
            return true;
        }
        return false;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
    
        if (iniciarSesion(empresa.trim(), user.trim(), pass.trim())) {
          navigate('/home');
        } else {
          setError('Datos incorrectos');
        }
    };
    
    return (
        <div className="login-section">
          <h2 className="login-titulo">Bienvenido</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <label>Empresa</label>
            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              required
            />
    
            <label>Usuario</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
    
            <label>Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
    
            <button type="submit" className="btn-acceder">Acceder</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </div>
    );    
}