import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAlertStore from '../store/alertStore';


const BulkDeleteModal = ({
    isOpen,
    onClose,
    selectedAlerts,
    onDeleteComplete
}) => {
    const { bulkDeleteAlerts, bulkRestoreAlerts } = useAlertStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showUndo, setShowUndo] = useState(false);
    const [undoCountdown, setUndoCountdown] = useState(5);
    const [deletedIds, setDeletedIds] = useState([]);
    const undoTimerRef = useRef(null);
    const countdownRef = useRef(null);

    
    useEffect(() => {
        return () => {
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    const handleDelete = async () => {
        setIsDeleting(true);

        const result = await bulkDeleteAlerts(selectedAlerts);

        if (result.success) {
            setDeletedIds(result.deletedIds);
            setShowUndo(true);
            setUndoCountdown(5);

            
            countdownRef.current = setInterval(() => {
                setUndoCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            
            undoTimerRef.current = setTimeout(() => {
                setShowUndo(false);
                onDeleteComplete?.();
                onClose();
            }, 5000);
        }

        setIsDeleting(false);
    };

    const handleUndo = async () => {
        
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);

        
        await bulkRestoreAlerts(deletedIds);

        setShowUndo(false);
        setDeletedIds([]);
        onClose();
    };

    const handleCancel = () => {
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        setShowUndo(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-md w-full mx-4"
                >
                    {}
                    <div
                        style={{
                            background: showUndo
                                ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
                                : 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: showUndo
                                ? '0 0 40px rgba(16, 185, 129, 0.4)'
                                : '0 0 40px rgba(220, 38, 38, 0.4)',
                            border: showUndo
                                ? '2px solid #10b981'
                                : '2px solid #ef4444',
                        }}
                    >
                        {showUndo ? (
                            
                            <>
                                <div className="text-center mb-6">
                                    <div className="text-5xl mb-4">✅</div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Deleted {deletedIds.length} Alert(s)
                                    </h3>
                                    <p className="text-emerald-200">
                                        You can undo this action
                                    </p>
                                </div>

                                {}
                                <div className="flex justify-center mb-6">
                                    <div
                                        className="relative w-16 h-16 flex items-center justify-center"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        <span className="text-2xl font-bold text-white">
                                            {undoCountdown}
                                        </span>
                                        <svg
                                            className="absolute inset-0 w-16 h-16 -rotate-90"
                                            viewBox="0 0 100 100"
                                        >
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.2)"
                                                strokeWidth="6"
                                            />
                                            <motion.circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="#10b981"
                                                strokeWidth="6"
                                                strokeDasharray={283}
                                                initial={{ strokeDashoffset: 0 }}
                                                animate={{ strokeDashoffset: 283 }}
                                                transition={{ duration: 5, ease: 'linear' }}
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleUndo}
                                    className="w-full py-3 px-6 rounded-xl font-bold text-emerald-900"
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                    }}
                                >
                                    ↩️ Undo Delete
                                </motion.button>
                            </>
                        ) : (
                            
                            <>
                                <div className="text-center mb-6">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="text-5xl mb-4"
                                    >
                                        ⚠️
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Delete {selectedAlerts.length} Alert(s)?
                                    </h3>
                                    <p className="text-red-200">
                                        This will remove alerts for <strong>all users</strong><br />
                                        (admins, faculty, and students)
                                    </p>
                                </div>

                                <div
                                    className="p-3 rounded-lg mb-6"
                                    style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <p className="text-red-100 text-sm text-center">
                                        💡 You'll have 5 seconds to undo after deletion
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 py-3 px-6 rounded-xl font-semibold text-white"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 px-6 rounded-xl font-bold text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                                            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
                                            opacity: isDeleting ? 0.7 : 1,
                                        }}
                                    >
                                        {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete for Everyone'}
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BulkDeleteModal;
