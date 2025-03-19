import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SuccessIcon } from "../../../icons/icons";

export const showDeleteProfileToast = () => {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = "30"; 
  overlay.style.backdropFilter = "blur(6px)";
  document.body.appendChild(overlay);
  
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span
              style={{
                color: "#4F4F4F",
                fontSize: "21px",
                fontWeight: "500",
                letterSpacing: "-0.5px",
              }}
            >
              Paciente
            </span>
            <span
              style={{
                color: "#0082BA",
                fontSize: "21px",
                fontWeight: "500",
                letterSpacing: "-0.5px",
                marginLeft: "5px",
              }}
            >
              excluído
            </span>
            <span
              style={{
                color: "#4F4F4F",
                fontSize: "21px",
                fontWeight: "500",
                letterSpacing: "-0.5px",
                marginLeft: "5px",
              }}
            >
              com
            </span>
          </div>
          <div
            style={{
              color: "#4F4F4F",
              fontSize: "21px",
              fontWeight: "500",
              letterSpacing: "-0.5px",
            }}
          >
            sucesso!
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
          marginLeft:"96px",
          marginTop:"120px",
        
        },

        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: false,
        onClose: () => document.body.removeChild(overlay),
      },

    );
  };

  export const showArchiveProfileToast = () => {

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
    overlay.style.zIndex = "30"; 
    overlay.style.backdropFilter = "blur(6px)";
    document.body.appendChild(overlay);
  
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
            Paciente
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
            arquivado
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
          marginLeft:"96px",
          marginTop:"120px",
        },
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: false,
        onClose: () => document.body.removeChild(overlay),
      }
    );
  };