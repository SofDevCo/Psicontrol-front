import React from 'react';
import logo from '../images/Psicontrol.png';

const fetchUserId = async () => {
    try {
        const response = await fetch('http://localhost:3000/get-user-id');
        if (response.ok) {
            const data = await response.json();
        } else {console.error("alguma coisa");}
    } catch (error) {
        console.error("error", error);
    }
};

const Login = () => {
    const handleLogin = async () => {
        try {
            // Inicia o login no Google
            const response = await fetch('http://localhost:3000/google');
            const data = await response.json();
            window.location.href = data.authUrl; // Redireciona para a URL de autenticação do Google
        } catch (error) {
            console.error('Erro ao iniciar o login:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <img src={logo} alt="Logo" className="w-64 mb-4" />
            <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-lg max-w-md text-center">
                <h1 className="text-lg mb-6">Clique abaixo para fazer o login com sua conta do Google</h1>
                <button 
                    onClick={handleLogin} 
                    className="flex justify-center bg-gray-200 border border-black py-4 px-40 rounded cursor-pointer transition-colors text-lg shadow-md hover:bg-gray-300"
                >
                    <span className="text-lg text-black">Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login;
