import React from "react";
import { CopyIcon } from "../../../icons/icons";
import { CloseIconMessageModal } from "../../DashboardPage/components/IconsDashBoard";
import { toast } from "react-toastify";

const ModalReceiptInfo = ({ isOpen, onClose, receiptData }) => {
    if (!isOpen || !receiptData) return null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-[310px] py-6 px-5 rounded-[10px] relative shadow-default font-openSans text-texto2">
                <div className="absolute top-2 right-2" onClick={onClose}>
                    <CloseIconMessageModal />
                </div>

                <h2 className="mb-6 font-bold text-center text-primaria text-[15px]">
                    Informações para NF ou Recibo
                </h2>

                <div className="mb-3">
                    <p className="font-bold text-texto1">{receiptData.payerName}</p>
                    <div className="flex items-center justify-between text-[13px] mb-4">
                        <span>CPF Pagador</span>
                        <div className="flex items-center gap-2">
                            <span>{receiptData.payerCPF}</span>
                            <button onClick={() => copyToClipboard(receiptData.payerCPF)}>
                                <CopyIcon />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <p className="font-semibold">{receiptData.beneficiaryName}</p>
                    <div className="flex items-center justify-between text-sm">
                        <span>CPF Beneficiário</span>
                        <div className="flex items-center gap-2">
                            <span>{receiptData.beneficiaryCPF}</span>
                            <button onClick={() => copyToClipboard(receiptData.beneficiaryCPF)}>
                                <CopyIcon />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3 text-sm">
                    <p className="font-semibold">Valor</p>
                    <div className="flex items-center gap-2">
                        <span>{receiptData.amount}</span>
                        <button onClick={() => copyToClipboard(receiptData.amount)}>
                            <CopyIcon />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3 text-sm">
                    <p className="font-semibold">Data do Pgto.</p>
                    <div className="flex items-center gap-2">
                        <span>{receiptData.paymentDate}</span>
                        <button onClick={() => copyToClipboard(receiptData.paymentDate)}>
                            <CopyIcon />
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="mb-1 font-semibold">Descrição</p>
                    <div className="flex justify-between text-sm">
                        <span className="max-w-[220px] text-justify leading-tight">{receiptData.description}</span>
                        <button onClick={() => copyToClipboard(receiptData.description)}>
                            <CopyIcon />
                        </button>
                    </div>
                </div>

                <hr className="my-2 border-gray-300" />

                <div className="flex justify-center">
                    <button
                        className="px-6 py-2 mt-4 text-sm font-semibold text-white rounded-full bg-primaria"
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
