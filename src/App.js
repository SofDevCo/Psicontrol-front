import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SelectCalendarPage from './pages/SelectCalendarPage'; // Certifique-se de que o caminho está correto
import CreateEventForm from './pages/CreateEventForm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/select-calendar" element={<SelectCalendarPage />} />
                <Route path="/create-event-form" element={<CreateEventForm />} />
            </Routes>
        </Router>
    );
};

export default App;
