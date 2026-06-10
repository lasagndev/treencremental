import type { Game } from "./Game.ts";
import type Decimal from "break_eternity.js";

export interface UpgradePosition {
    x: number;
    y: number;
}

export interface IOneTimeUpgrade {
    id: number;
    parentId?: number;
    position: UpgradePosition;
    description: string;
    dynamicDescription?: (game: Game) => string;
    price: Decimal;
    isBought: boolean ;
    whenCanShow?: string;
    exponentBonus?: number;
    effect: (game: Game, upgrades?: { oneTimeUpgrades: IOneTimeUpgrade[]; buyableUpgrades: IBuyableUpgrade[]; setOneTimeUpgrades: React.Dispatch<React.SetStateAction<IOneTimeUpgrade[]>>; setBuyableUpgrades: React.Dispatch<React.SetStateAction<IBuyableUpgrade[]>>; setPointBuyableUpgrades?: React.Dispatch<React.SetStateAction<IBuyableUpgrade[]>> }) => void;
}

export interface IBuyableUpgrade {
    id: number;
    parentId?: number;
    position: UpgradePosition;
    description: string;
    dynamicDescription?: (game: Game) => string;
    bulkDescription?: (count: number, game: Game) => string;
    price: Decimal;
    priceMultiplier: Decimal;
    currentAmount: Decimal;
    maxAmount: number;
    isBought: boolean;
    isMaxed?: boolean;
    calcPrice?: (upg: IBuyableUpgrade) => Decimal;
    whenCanShow?: string;
    effect: (game: Game) => void;
    tickEffect?: (amount: Decimal, state: { prestigePoint: Decimal; point: Decimal, prestigeEnergy: Decimal }) => { pointMulti?: Decimal; ppGain?: Decimal, peGain?: Decimal };
    prestigeMultiPerLevel?: number;
    exponentBonusPerLevel?: number;
}

export interface IUnlockUpgrade {
    id: number;
    parentId?: number;
    position: UpgradePosition;
    description: string;
    price: Decimal;
    isBought: boolean ;
    unlocks: string;
    effect: (game: Game) => void;
}