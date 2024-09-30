import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Login} from './pages/Login';
import Token from './components/token';
import SelectCalendarPage from './pages/SelectCalendarPage';
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage'; 
import CreateCustomerPage from './pages/CreateCustomerForm';
import IncomePage from './pages/IncomePage';
import Layout from './components/layout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<Layout/>} >
                <Route path="/token/:token" element={<Token />} />
                <Route path="/select-calendar" element={<SelectCalendarPage />} />
                <Route path="/create-event-form" element={<Dashboard />} />
                <Route path="/customers" element={<CustomersPage />} /> 
                <Route path="/create-customer" element={<CreateCustomerPage />} />
                <Route path="/income" element={<IncomePage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
