import { useState, useCallback } from 'react';

export const usePiP = () => {
    const [isActive, setIsActive] = useState(false);
    const [pipWindow, setPipWindow] = useState<Window | null>(null);

    const requestPiP = useCallback(async () => {
        if (!('documentPictureInPicture' in window)) {
            alert("Your browser doesn't support Document Picture-in-Picture API yet.");
            return;
        }

        try {
            // Open PiP window
            const win = await (window as any).documentPictureInPicture.requestWindow({
                width: 400,
                height: 300,
            });

            // Copy styles
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    win.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSheet.href || '';
                    win.document.head.appendChild(link);
                }
            });

            // Copy tailwind styles specifically if using vite injection
            // This is a heuristic, better to copy all <style> and <link> tags from head
            Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]')).forEach(node => {
                win.document.head.appendChild(node.cloneNode(true));
            });

            win.document.body.classList.add('dark'); // Force dark mode matching

            win.addEventListener('pagehide', () => {
                setIsActive(false);
                setPipWindow(null);
            });

            setPipWindow(win);
            setIsActive(true);

        } catch (err) {
            console.error("PiP failed", err);
        }
    }, []);

    const closePiP = useCallback(() => {
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
            setIsActive(false);
        }
    }, [pipWindow]);

    return { requestPiP, closePiP, isActive, pipWindow };
};
