import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const TopBar = () => {
    const navigate = useNavigate(); 

    const handleLogout = () => {
        navigate('/'); 
    };

    return(
        <header className='flex justify-between items-center w-full h-[100px] bg-white p-4 shadow-md'>
            <h1 className="text-xl font-semibold">Pacientes</h1>
            <button onClick={handleLogout} className='text-blue-500 hover:underline'>
                Sair
            </button>
        </header>
    );  
}

export default TopBar;
