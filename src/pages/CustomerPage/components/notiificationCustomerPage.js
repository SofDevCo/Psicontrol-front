import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SuccessIcon } from "../../../icons/icons";

export const showEditToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = isMobile ? "100 " : "30";
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
            fontSize: isMobile ? "16px " : "21px",
            fontWeight: "500",
            letterSpacing: "-0.5px",
          }}
        >
          Alterações
        </span>
        <span
          style={{
            color: "#0082BA",
            fontSize: isMobile ? "16px " : "21px",
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
            fontSize: isMobile ? "16px " : "21px",
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
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
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

export const showLoadingToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = "9999";
  overlay.style.backdropFilter = "blur(6px)";
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    .Toastify__toast-container {
      z-index: 10000 !important; /* Mais alto que o overlay */
    }
  `;
  document.head.appendChild(style);

  const toastId = toast(
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <div className="w-10 h-10 border-4 rounded-full border-primaria border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center font-ubuntu">
        <div className="text-[#4F4F4F] text-base lg:text-xl font-medium tracking-tight">
          Cadastro sendo finalizado,
        </div>
        <div className="text-[#4F4F4F] text-base lg:text-xl font-medium tracking-tight">
          aguarde um momento.
        </div>
      </div>
    </div>,
    {
      style: {
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
      },
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      icon: false,
      closeButton: false,
    }
  );

  return {
    toastId,
    overlay,
    closeToast: () => {
      toast.dismiss(toastId);
      if (overlay?.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (style?.parentNode) {
        style.parentNode.removeChild(style);
      }
    }
  };
};

export const showLoadingCalendarToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = "9999";
  overlay.style.backdropFilter = "blur(6px)";
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    .Toastify__toast-container {
      z-index: 10000 !important; /* Mais alto que o overlay */
    }
  `;
  document.head.appendChild(style);

  const toastId = toast(
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4">
        <div className="w-10 h-10 border-4 rounded-full border-primaria border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center font-ubuntu">
        <div className="text-[#4F4F4F] text-base lg:text-xl font-medium tracking-tight">
          Aguarde um momento, alterando
        </div>
        <div className="text-[#4F4F4F] text-base lg:text-xl font-medium tracking-tight">
          agendas selecionadas.
        </div>
      </div>
    </div>,
    {
      style: {
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
      },
      position: "top-center",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      icon: false,
      closeButton: false,
    }
  );

  return {
    toastId,
    overlay,
    closeToast: () => {
      toast.dismiss(toastId);
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    }
  };
};

export const showArchiveToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = isMobile ? "100 " : "30";
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
            fontSize: isMobile ? "16px " : "21px",
            fontWeight: "500",
            letterSpacing: "-0.5px",
          }}
        >
          Paciente
        </span>
        <span
          style={{
            color: "#0082BA",
            fontSize: isMobile ? "16px " : "21px",
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
            fontSize: isMobile ? "16px " : "21px",
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
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
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

export const showDeleteToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = isMobile ? "100 " : "30";
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
              fontSize: isMobile ? "16px " : "21px",
              fontWeight: "500",
              letterSpacing: "-0.5px",
            }}
          >
            Paciente
          </span>
          <span
            style={{
              color: "#0082BA",
              fontSize: isMobile ? "16px " : "21px",
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
              fontSize: isMobile ? "16px " : "21px",
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
            fontSize: isMobile ? "16px " : "21px",
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
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
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

export const showSuccessToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = isMobile ? "100 " : "30";
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
          adicionado
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
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
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

export const showSuccessCalendarToast = () => {
  const overlay = document.createElement("div");
  const isMobile = window.innerWidth <= 768;

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(51, 184, 209, 0.3)";
  overlay.style.zIndex = isMobile ? "100 " : "30";
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
          Agenda
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
          sincronizada
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
        height: isMobile ? "135px" : "207px",
        width: isMobile ? "268px" : "360px",
        backgroundColor: "#F5F5F5",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        border: "1px solid #81A0AE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        marginLeft: "96px",
        marginTop: "150px",
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
