import React, { useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";

const Token = (props) => {
  const navigate = useNavigate();

  let { token } = useParams();
  useEffect(() => {
    localStorage.setItem("authentication_token", token);
    navigate(`/select-calendar`);
  }, [token]);
};

export default Token;

