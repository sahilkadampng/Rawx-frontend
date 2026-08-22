import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoAlertCircle, IoClose } from 'react-icons/io5';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-10000"
                    />

                    
                    <div className="fixed inset-0 flex items-center justify-center z-10001 p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${variant === 'danger' ? 'bg-red-50 text-red-600' :
                                            variant === 'warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <IoAlertCircle className="text-2xl" />
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                                    >
                                        <IoClose className="text-xl" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold font-arimo text-gray-900 mb-2">
                                    {title}
                                </h3>
                                <p className="text-gray-500 text-sm font-arimo leading-relaxed mb-8">
                                    {message}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 font-mono text-xs tracking-wider uppercase text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className={`flex-1 px-4 py-3 rounded-2xl font-mono text-xs tracking-wider uppercase text-white shadow-lg transition-all cursor-pointer active:scale-[0.98] ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                                                variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                            }`}
                                    >
                                        {confirmLabel}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
