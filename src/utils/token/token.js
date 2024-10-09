import { useEffect } from "react";
import {
  useLocation,
  useNavigate,
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
