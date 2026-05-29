import { useEffect } from "react";
import type { RefObject } from "react";
import type {Game} from "../Models/Game.ts";

export function useKeybinds(handlePrestigeRef: RefObject<() => void>, setCurrentTab: React.Dispatch<React.SetStateAction<string>>, game: RefObject<Game>) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {

            const gameRef = game.current

            switch(e.key) {
                case "p": if(gameRef.canShowPrestigeTree && gameRef.point.gte(1e15)) handlePrestigeRef.current?.(); break;

                case "1": setCurrentTab("MainTree"); break;
                case "2": if(gameRef.canShowPrestigeTree) setCurrentTab("PrestigeTree"); break;
                case "3": if(gameRef.canShowPrestigeTree) setCurrentTab("Automation"); break;
                case "4": if(gameRef.canShowGenerator) setCurrentTab("Generator"); break; // Geneatot
                default: break;
            }


        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
