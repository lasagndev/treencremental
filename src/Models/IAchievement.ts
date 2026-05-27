import type {Game} from "./Game.ts";
import type {Statistics} from "./Statistics.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "./IUpgrade.ts";

export interface IAchievement {
    id: number,
    name: string,
    description: string,
    isUnlocked: boolean,
    condition: (game: Game, stats: Statistics, pointUpgrades: {buyableUpgrades: IBuyableUpgrade[], oneTimeUpgrades: IOneTimeUpgrade[]}, prestigeUpgrades: {buyableUpgrades: IBuyableUpgrade[], oneTimeUpgrades: IOneTimeUpgrade[]}) => boolean,
    effect?: () => void
}