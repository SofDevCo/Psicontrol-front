import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import CreateEventForm from './pages/CreateEventForm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/create-event-form" element={<CreateEventForm />} />
            </Routes>
        </Router>
    );
};

export default App;
