import React from 'react';
import '../styles/Login.css';
import logo from '../images/Psicontrol.png';

const Login = () => {
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/google');
            const data = await response.json();
            window.location.href = data.authUrl;
        } catch (error) {
            console.error('Erro ao iniciar o login:', error);
        }
    };

    return (
        <div className="login-page">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="login-box">
                <h1 className="login-subtitle">Clique abaixo para fazer o login com sua conta do Google</h1>
                <button onClick={handleLogin} className="google-button">
                    <span className="google-icon"></span>
                    <span className="google-text">Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login;
