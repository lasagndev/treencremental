import { useEffect } from "react";
import type { RefObject } from "react";
import type {Game} from "../Models/Game.ts";

export function useKeybinds(handlePrestigeRef: RefObject<() => void>, setCurrentTab: React.Dispatch<React.SetStateAction<string>>, game: RefObject<Game>, handleSave: () => void) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {

            const gameRef = game.current

            switch(e.key) {
                case "p": if(gameRef.canShowPrestigeTree && gameRef.point.gte(1e15)) handlePrestigeRef.current?.(); break;
                case "s": handleSave(); break;

                case "1": if(!gameRef.isNegated) setCurrentTab("MainTree"); break;
                case "2": if(gameRef.canShowPrestigeTree && !gameRef.isNegated) setCurrentTab("PrestigeTree"); break;
                case "3": if(gameRef.canShowPrestigeTree && !gameRef.isNegated) setCurrentTab("Automation"); break;
                case "4": if(gameRef.canShowGenerator && !gameRef.isNegated) setCurrentTab("Generator"); break;
                case "5": if(gameRef.canShowVoidTree && !gameRef.isNegated) setCurrentTab("VoidTree"); break;
                case "6": if(gameRef.canShowVoidTree && !gameRef.isNegated) setCurrentTab("PureTree"); break;
                default: break;
            }


        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
