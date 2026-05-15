import type {Game} from "./Game.ts";
import type {Statistics} from "./Statistics.ts";

export interface IAchievement {
    id: number,
    name: string,
    description: string,
    isUnlocked: boolean,
    condition: (game: Game, stats: Statistics) => boolean,
    effect?: () => void
}