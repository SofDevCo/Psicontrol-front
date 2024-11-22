import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SuccessIcon } from "../../../icons/icons";

export const showAlteredToast = () => {
  // Cria o elemento overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "#33B8D14D"; // Fundo semi-transparente
  overlay.style.zIndex = "30"; // Coloca o overlay acima de outros elementos
  overlay.style.backdropFilter = "blur(6px)";
  document.body.appendChild(overlay);

  // Função para remover o overlay
  const removeOverlay = () => document.body.removeChild(overlay);

  // Exibe o toast com o overlay
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
            display: "block", // Garante que o texto fique em uma linha separada
          }}
        >
          Alterações salvas com
        </span>
        <span
          style={{
            color: "#4F4F4F",
            fontSize: "21px",
            fontWeight: "500",
            letterSpacing: "-1.5px",
            display: "block", // Garante que o texto fique em uma linha separada
          }}
        >
          sucesso!
        </span>
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
        position: "relative",
        top: "100px", // Move o toast para baixo
        zIndex: "1000", // Coloca o toast acima do overlay
      },
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: false,
      onClose: removeOverlay, // Remove o overlay ao fechar o toast
    }
  );
};
