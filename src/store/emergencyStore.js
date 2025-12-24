import { create } from 'zustand';


const useEmergencyStore = create((set, get) => ({
    
    isEmergencyActive: false,
    activatedBy: null,
    activatedAt: null,

    
    activateEmergency: (userId) => {
        set({
            isEmergencyActive: true,
            activatedBy: userId,
            activatedAt: new Date().toISOString(),
        });

        
        document.body.classList.add('emergency-active');

        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 880; 
            gainNode.gain.value = 0.1;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            }
    },

    deactivateEmergency: () => {
        set({
            isEmergencyActive: false,
            activatedBy: null,
            activatedAt: null,
        });

        
        document.body.classList.remove('emergency-active');
    },

    
    toggleEmergency: (userId) => {
        const { isEmergencyActive, activateEmergency, deactivateEmergency } = get();
        if (isEmergencyActive) {
            deactivateEmergency();
        } else {
            activateEmergency(userId);
        }
    },
}));

export default useEmergencyStore;
