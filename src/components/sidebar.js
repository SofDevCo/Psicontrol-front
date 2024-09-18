import React from 'react';
import logo from '../images/Psicontrol.png'

const Sidebar = () => {
    return(
        <aside class="w-[250px] bg-gray-200 text-gray-800 p-5">
                <div>
                <img src={logo} alt="Logo" class="mb-[78px] w-64 mb-4" />
                    <nav>
                        <ul>
                            <li class="mb-[40px]"><a href="#dashboard">Dashboard</a></li>
                            <li class="mb-[40px]"><a href="/customers">Pacientes</a></li>
                            <li class="mb-[40px]"><a href="#despesas">Despesas e receitas</a></li>
                            <li class="mb-[40px]"><a href="#configuracoes">Minhas Configurações</a></li>
                        </ul>
                    </nav>
                </div>
            </aside>
    );
}

export default Sidebar;