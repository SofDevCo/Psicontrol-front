import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SuccessIcon } from "../../../icons/icons";

export const showSaveToast = () => {
    toast.success(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <SuccessIcon style={{ fontSize: "40px", color: "#0091D0" }} />
        </div>
        <div style={{ textAlign: "center", fontFamily: "Ubuntu" }}>
          <span
            style={{
              color: "#4F4F4F",
              fontSize: "21px",
              fontWeight: "500",
              letterSpacing: "-0.5px",
            }}
          >
            Alterações
          </span>
          <span
            style={{
              color: "#0082BA",
              fontSize: "21px",
              fontWeight: "500",
              letterSpacing: "-0.5px",
            }}
          >
            {" "}
            salvas
          </span>
          <div
            style={{
              color: "#4F4F4F",
              fontSize: "21px",
              fontWeight: "500",
              letterSpacing: "-0.5px",
            }}
          >
            com sucesso!
          </div>
        </div>
      </div>,
      {
        style: {
          height: "207px",
          width: "360px",
          backgroundColor: "#F5F5F5",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "8px",
          border: "1px solid #81A0AE",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: false,
      }
    );
  };