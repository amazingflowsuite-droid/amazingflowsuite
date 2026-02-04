import { useEffect, useRef } from 'react';
import { useDailyStore } from '../store/useDailyStore';

export const AudioController = () => {
    const { secondsRemaining, status, activeMemberId } = useDailyStore();
    const prevSecondsRef = useRef(secondsRemaining);
    const prevActiveIdRef = useRef(activeMemberId);

    const playTone = (frequency: number, type: 'sine' | 'square' | 'triangle', duration: number) => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    };

    useEffect(() => {
        // Timer Ticks
        if (status === 'running') {
            // Warning at 30s
            if (secondsRemaining === 30 && prevSecondsRef.current !== 30) {
                playTone(440, 'sine', 0.5); // A4
            }

            // Countdown 10s
            if (secondsRemaining <= 10 && secondsRemaining > 0 && secondsRemaining !== prevSecondsRef.current) {
                playTone(660, 'triangle', 0.1);
            }

            // Finish 0s
            if (secondsRemaining === 0 && prevSecondsRef.current !== 0) {
                playTone(880, 'square', 1); // Alarm
            }
        }
        prevSecondsRef.current = secondsRemaining;
    }, [secondsRemaining, status]);

    useEffect(() => {
        // Next Speaker Chime
        if (activeMemberId !== prevActiveIdRef.current && activeMemberId) {
            // Ding-Dong
            playTone(523.25, 'sine', 0.3); // C5
            setTimeout(() => playTone(659.25, 'sine', 0.6), 200); // E5
        }
        prevActiveIdRef.current = activeMemberId;
    }, [activeMemberId]);

    return null; // Headless component
};
