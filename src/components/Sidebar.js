import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/Psicontrol.png';
import { Home, RecDesp, User, Config } from '../icons/icon';

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-[250px] bg-white-200 text-white-500 p-5">
            <div>
                <img src={logo} alt="Logo" className="mb-[78px] w-64 mb-4" />
                <nav className="text-right">
                    <ul className="mt-[100px]">
                        <li className={`side-menu mb-[40px] ${location.pathname === '/create-event-form' ? 'ativo' : ''}`}>
                            <Link to="/create-event-form" className={`flex items-center ${location.pathname === '/create-event-form' ? 'active' : ''}`}>
                                <Home/>
                                <span className="py-1 text-2xl">Dashboard</span>
                            </Link>
                        </li>
                        <li className={`side-menu mb-[40px] ${location.pathname === '/income' ? 'ativo' : ''}`}>
                            <Link to="/income" className={`flex items-center ${location.pathname === '/income' ? 'active' : ''}`}>
                                <RecDesp/>
                                <div className="text-2xl leading-none">
                                    <span className="flex">Receitas e</span>
                                    <span className="flex">Despesas</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`side-menu mb-[40px] ${location.pathname === '/customers' ? 'ativo' : ''}`}>
                            <Link to="/customers" className={`flex items-center ${location.pathname === '/customers' ? 'active' : ''}`}>
                                <User/>
                                <span className="text-2xl">Pacientes</span>
                            </Link>
                        </li>
                        <li className={`side-menu mb-[40px] ${location.pathname === '/configuracoes' ? 'ativo' : ''}`}>
                            <Link to="/configuracoes" className={`flex items-center ${location.pathname === '/configuracoes' ? 'active' : ''}`}>
                                <Config/>
                                <div className="text-2xl leading-none">
                                    <span className="flex">Minhas</span>
                                    <span className="block">Configurações</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;
