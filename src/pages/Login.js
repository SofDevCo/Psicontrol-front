import React, { useEffect } from 'react';
import logo from '../images/Psicontrol.png';

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

    // Verifica se o login foi feito e o código de callback está presente
    useEffect(() => {
        const fetchUserDetails = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get('code');

            if (code) {
                try {
                    // Após o login com o Google, obtém o user_id
                    const response = await fetch(`http://localhost:3000/google/callback?code=${code}`);
                    const data = await response.json();

                    console.log('Resposta da API após login:', data); // Log para verificar a resposta da API

                    if (data.user_id) {
                        // Armazena o user_id no localStorage
                        localStorage.setItem('user_id', data.user_id);
                        console.log('User ID armazenado no localStorage:', data.user_id); // Log para verificar se foi armazenado
                        // Redireciona para a página inicial (ou qualquer página desejada)
                        window.location.href = '/dashboard'; 
                    } else {
                        console.log('Nenhum user_id encontrado na resposta.'); // Log caso não encontre o user_id
                    }
                } catch (error) {
                    console.error('Erro ao obter dados do usuário:', error);
                }
            } else {
                console.log('Nenhum código encontrado na URL.'); // Log caso não encontre o código
            }
        };

        fetchUserDetails();
    }, []);

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
