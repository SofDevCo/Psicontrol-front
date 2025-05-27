import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import  Login  from "./pages/LoginPage/Login";
import Token from "./utils/token/token";
import SelectCalendarPage from "./pages/SelectCalendarPage/SelectCalendarPage";
import Dashboard from "./pages/DashboardPage/Dashboard";
import CustomersPage from "./pages/CustomerPage/CustomersPage";
import CreateCustomerPage from "./pages/CustomerPage/components/CreateCustomerForm";
import IncomePage from "./pages/IncomePage/IncomePage";
import Layout from "./utils/Layout/layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArchivedPage from "./pages/ArchivedPage/ArchivedPage";
import UserPage from "./pages/UserPage/UserPage";
import ProfileCustomerPage from "./pages/ProfileCustomerPage/ProfileCustomerPage";

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const App = () => {
  return (
    // <Provider config={rollbarConfig}>
    //   <ErrorBoundary>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/token" element={<Token />} />
            <Route path="/select-calendar" element={<SelectCalendarPage />} />
            <Route element={<Layout />}>
              <Route path="/create-event-form" element={<Dashboard />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/create-customer" element={<CreateCustomerPage />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/archived" element={<ArchivedPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route
                path="/customers/:customerId/profile"
                element={<ProfileCustomerPage />}
              />
            </Route>
          </Routes>
        </Router>
    //   </ErrorBoundary>
    // </Provider>
  );
};

export default App;
