import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    notify: (message: string, type?: NotificationType) => void;
    notifySuccess: (message: string) => void;
    notifyError: (message: string) => void;
    notifyInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const notify = useCallback((message: string, type: NotificationType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        
        setTimeout(() => removeNotification(id), 5000);
    }, [removeNotification]);

    const notifySuccess = useCallback((m: string) => notify(m, 'success'), [notify]);
    const notifyError = useCallback((m: string) => notify(m, 'error'), [notify]);
    const notifyInfo = useCallback((m: string) => notify(m, 'info'), [notify]);

    const contextValue = useMemo(() => ({
        notify,
        notifySuccess,
        notifyError,
        notifyInfo
    }), [notify, notifySuccess, notifyError, notifyInfo]);

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}

            
            <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border
                ${n.type === 'success' ? 'bg-white border-green-100 text-green-800' : ''}
                ${n.type === 'error' ? 'bg-white border-red-100 text-red-800' : ''}
                ${n.type === 'info' ? 'bg-white border-blue-100 text-blue-800' : ''}
                min-w-75 max-w-md
              `}>
                                <div className="shrink-0">
                                    {n.type === 'success' && <IoCheckmarkCircle className="text-2xl text-green-500" />}
                                    {n.type === 'error' && <IoCloseCircle className="text-2xl text-red-500" />}
                                    {n.type === 'info' && <IoInformationCircle className="text-2xl text-blue-500" />}
                                </div>

                                <p className="flex-1 font-arimo text-sm font-medium leading-tight">
                                    {n.message}
                                </p>

                                <button
                                    onClick={() => removeNotification(n.id)}
                                    className="p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
                                >
                                    <IoClose className="text-lg" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
