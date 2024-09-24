import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SelectCalendarPage from './pages/SelectCalendarPage';
import CreateEventForm from './pages/CreateEventForm';
import CustomersPage from './pages/CustomersPage'; 
import CreateCustomerPage from './pages/CreateCustomerForm';
import IncomePage from './pages/IncomePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/select-calendar" element={<SelectCalendarPage />} />
                <Route path="/create-event-form" element={<CreateEventForm />} />
                <Route path="/customers" element={<CustomersPage />} /> 
                <Route path="/create-customer" element={<CreateCustomerPage />} />
                <Route path="/income" element={<IncomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
