import React from "react";
import { toast } from "react-toastify";
import { CopyIcon } from "../../../icons/icons"; 
import { CloseIconMessageModal } from "../../DashboardPage/components/IconsDashBoard";

const ModalReceiptInfo = ({ isOpen, onClose, receiptData }) => {
    if (!isOpen || !receiptData) return null;

    const copyToClipboard = (text) => {

        const textToCopy = String(text !== undefined && text !== null ? text : "");
        if (textToCopy === "") {
            toast.error("Nada para copiar!");
            return;
        }
        navigator.clipboard.writeText(textToCopy);
        toast.success("Copiado!");
    };


    const patientDisplayName = receiptData.payerName || "N/A";
    const patientDisplayCPF = receiptData.payerCPF || "N/A";
    const payerDisplayName = receiptData.AlternativePayer;
    const payerDisplayCPF = receiptData.AlternativeCPF;     
    
    let displayAmount = "N/A";
    if (receiptData.amount !== undefined && receiptData.amount !== null) {
        const numberAmount = parseFloat(String(receiptData.amount).replace(',', '.'));
        if (!isNaN(numberAmount)) {
            displayAmount = numberAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            displayAmount = String(receiptData.amount); 
        }
    }

    const displayPaymentDate = receiptData.paymentDate || "N/A";
    const displayDescription = receiptData.description || "N/A";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-[370px] sm:max-w-sm p-6 rounded-xl shadow-xl font-sans text-neutral-700 relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"> {/* Added animation classes */}
                <style>
                    {`
                        @keyframes modalShow {
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                        .animate-modalShow {
                            animation: modalShow 0.3s forwards;
                        }
                    `}
                </style>
                <div className="absolute top-3 right-3">
                    <button 
                        onClick={onClose} 
                        className="transition-colors text-neutral-400 hover:text-neutral-600"
                        aria-label="Fechar modal"
                    >
                        <CloseIconMessageModal className="w-6 h-6" /> 
                    </button>
                </div>

                <h2 className="mb-6 text-lg font-semibold text-center text-sky-600">
                    Informações para NF ou Recibo
                </h2>

                <div className="mb-1">
                    <p className="text-sm text-neutral-600">
                        Paciente: <span className="font-medium text-neutral-800">{patientDisplayName}</span>
                    </p>
                </div>
                <div className="flex items-center justify-between mb-4 text-sm">
                    <p className="text-neutral-500">CPF Paciente</p>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-800">{patientDisplayCPF}</span>
                        <button onClick={() => copyToClipboard(patientDisplayCPF)} className="transition-colors text-sky-500 hover:text-sky-600" aria-label="Copiar CPF do Paciente">
                            <CopyIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {payerDisplayName && (
                    <>
                        <div className="mb-1">
                            <p className="text-sm text-neutral-600">
                                Pagador: <span className="font-medium text-neutral-800">{payerDisplayName}</span>
                            </p>
                        </div>
                        <div className="flex items-center justify-between mb-4 text-sm">
                            <p className="text-neutral-500">CPF Pagador</p>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-800">{payerDisplayCPF || "N/A"}</span>
                                <button onClick={() => copyToClipboard(payerDisplayCPF)} className="transition-colors text-sky-500 hover:text-sky-600" aria-label="Copiar CPF do Pagador">
                                    <CopyIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-between mb-4 text-sm">
                    <p className="text-neutral-500">Valor</p>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-800">{displayAmount}</span>
                        <button onClick={() => copyToClipboard(receiptData.amount)} className="transition-colors text-sky-500 hover:text-sky-600" aria-label="Copiar Valor">
                            <CopyIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm">
                    <p className="text-neutral-500">Data do Pgto.</p>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-800">{displayPaymentDate}</span>
                        <button onClick={() => copyToClipboard(displayPaymentDate)} className="transition-colors text-sky-500 hover:text-sky-600" aria-label="Copiar Data do Pagamento">
                            <CopyIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="mb-6 text-sm">
                    <p className="mb-1 text-neutral-500">Descrição</p>
                    <div className="flex items-start justify-between">
                        <p className="font-medium text-neutral-800 leading-snug max-w-[calc(100%-2.5rem)] whitespace-pre-wrap">
                            {displayDescription}
                        </p>
                        <button onClick={() => copyToClipboard(displayDescription)} className="ml-2 transition-colors text-sky-500 hover:text-sky-600 shrink-0" aria-label="Copiar Descrição">
                            <CopyIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        className="w-full px-6 py-2.5 text-base font-semibold text-white rounded-lg bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-colors"
                        onClick={onClose}
                    >
                        Recibo Emitido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalReceiptInfo;