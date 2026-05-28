import { useEffect } from "react";
import type { RefObject } from "react";

export function useKeybinds(handlePrestigeRef: RefObject<() => void>, setCurrentTab: React.Dispatch<React.SetStateAction<string>>) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {

            switch(e.key) {
                case "p": handlePrestigeRef.current?.(); break;
                case "1": setCurrentTab("MainTree"); break;
                case "2": setCurrentTab("PrestigeTree"); break;
                case "3": setCurrentTab("Automation"); break;
                case "4": setCurrentTab("Generator"); break;
                default: break;
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
