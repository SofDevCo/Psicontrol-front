import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import Token from "./utils/token/token";
import SelectCalendarPage from "./pages/SelectCalendarPage/SelectCalendarPage";
import Dashboard from "./pages/DashboardPage/Dashboard";
import CustomersPage from "./pages/CustomerPage/CustomersPage";
import CreateCustomerPage from "./pages/CustomerPage/components/CreateCustomerForm";
import IncomePage from "./pages/IncomePage/IncomePage";
import Layout from "./utils/Layout/layout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/token" element={<Token />} />
          <Route path="/select-calendar" element={<SelectCalendarPage />} />
          <Route element={<Layout />}>
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
