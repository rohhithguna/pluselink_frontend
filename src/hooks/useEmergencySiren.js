import { useEffect, useRef } from 'react';
import useEmergencyStore from '../store/emergencyStore';


const useEmergencySiren = () => {
    const { isEmergencyActive } = useEmergencyStore();
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isEmergencyActive) {
            startSiren();
        } else {
            stopSiren();
        }

        return () => {
            stopSiren();
        };
    }, [isEmergencyActive]);

    const startSiren = () => {
        try {
            
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const ctx = audioContextRef.current;

            
            gainNodeRef.current = ctx.createGain();
            gainNodeRef.current.connect(ctx.destination);
            gainNodeRef.current.gain.value = 0; 

            
            oscillatorRef.current = ctx.createOscillator();
            oscillatorRef.current.type = 'sine';
            oscillatorRef.current.frequency.value = 440; 
            oscillatorRef.current.connect(gainNodeRef.current);
            oscillatorRef.current.start();

            
            let phase = 0;
            intervalRef.current = setInterval(() => {
                if (!oscillatorRef.current || !gainNodeRef.current || !audioContextRef.current) return;

                const ctx = audioContextRef.current;
                const now = ctx.currentTime;

                
                phase += 0.1;
                const volume = (Math.sin(phase) * 0.5 + 0.5) * 0.12; 

                gainNodeRef.current.gain.setValueAtTime(volume, now);

                
                const freq = 500 + Math.sin(phase * 2) * 100;
                oscillatorRef.current.frequency.setValueAtTime(freq, now);
            }, 50); 

        } catch (error) {
            }
    };

    const stopSiren = () => {
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        
        if (oscillatorRef.current) {
            try {
                oscillatorRef.current.stop();
            } catch (e) { }
            oscillatorRef.current = null;
        }

        
        if (audioContextRef.current) {
            try {
                audioContextRef.current.close();
            } catch (e) { }
            audioContextRef.current = null;
        }

        gainNodeRef.current = null;
    };

    return { isEmergencyActive };
};

export default useEmergencySiren;
