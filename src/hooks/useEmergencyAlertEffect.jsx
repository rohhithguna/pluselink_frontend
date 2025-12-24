import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useEmergencyAlertEffect = (alert) => {
    useEffect(() => {
        if (!alert) return;

        const priority = alert.priority?.toLowerCase();


        if (priority === 'emergency') {

            const overlay = document.createElement('div');
            overlay.id = 'emergency-pulse-overlay';
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(220, 38, 38, 0.15);
                z-index: 9998;
                pointer-events: none;
                animation: emergencyPulse 0.5s ease-in-out 3;
            `;
            document.body.appendChild(overlay);


            if (!document.getElementById('emergency-pulse-keyframes')) {
                const style = document.createElement('style');
                style.id = 'emergency-pulse-keyframes';
                style.textContent = `
                    @keyframes emergencyPulse {
                        0%, 100% { opacity: 0; }
                        50% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }


            setTimeout(() => overlay.remove(), 1500);


            playAlertSound('emergency');

        } else if (priority === 'important') {

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                border: 4px solid rgba(245, 158, 11, 0.6);
                z-index: 9998;
                pointer-events: none;
                animation: borderPulse 0.3s ease-in-out 2;
            `;
            document.body.appendChild(overlay);

            if (!document.getElementById('border-pulse-keyframes')) {
                const style = document.createElement('style');
                style.id = 'border-pulse-keyframes';
                style.textContent = `
                    @keyframes borderPulse {
                        0%, 100% { opacity: 0; }
                        50% { opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => overlay.remove(), 600);
            playAlertSound('important');
        }


        showAlertToast(alert);

    }, [alert]);
};

const playAlertSound = (priority) => {

    const soundEnabled = localStorage.getItem('alertSoundsEnabled') !== 'false';
    if (!soundEnabled) return;

    try {
        const audio = new Audio();

        if (priority === 'emergency') {

            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVdr...';
        } else if (priority === 'important') {

            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA...';
        }

        audio.volume = 0.3;
        audio.play().catch(() => { });
    } catch (error) {
        console.error('Error playing alert sound:', error);
    }
};

const showAlertToast = (alert) => {
    const priority = alert.priority?.toLowerCase();

    const toastOptions = {
        duration: priority === 'emergency' ? 10000 : priority === 'important' ? 6000 : 4000,
        icon: getPriorityIcon(priority),
        style: getPriorityStyle(priority),
    };

    toast(
        <div className="flex flex-col gap-1">
            <div className="font-semibold">{alert.title}</div>
            <div className="text-sm opacity-80">{alert.description}</div>
        </div>,
        toastOptions
    );
};

const getPriorityIcon = (priority) => {
    switch (priority) {
        case 'emergency':
            return '🚨';
        case 'important':
            return '⚠️';
        default:
            return 'ℹ️';
    }
};

const getPriorityStyle = (priority) => {
    switch (priority) {
        case 'emergency':
            return {
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
            };
        case 'important':
            return {
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
            };
        default:
            return {
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
            };
    }
};

export default useEmergencyAlertEffect;
