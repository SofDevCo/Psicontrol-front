import React, { useEffect, useState } from "react";
import {
  redirect,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const Token = (props) => {
  const navigate = useNavigate();

  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  useEffect(() => {
    localStorage.setItem("authentication_token", token);
    navigate("/select-calendar");
  }, [token]);
};

export default Token;
