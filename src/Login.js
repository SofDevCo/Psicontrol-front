import React from 'react';

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
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Psicontrol</h1>
            <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Login com Google
            </button>
        </div>
    );
};

export default Login;
