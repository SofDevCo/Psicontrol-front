import React from 'react';
import '../index.css';

const TopBar = () => {
    return(
        <header className='flex justify-between items-center w-full h-[100px] bg-white p-4 shadow-md'> {/* Remover width fixa */}
            <h1 className="text-xl font-semibold">Pacientes</h1>
            <button className='text-blue-500 hover:underline'>
                Sair
            </button>
        </header>
    );  
}


export default TopBar