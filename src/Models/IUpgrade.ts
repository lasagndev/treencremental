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
    effect: (game: Game) => void;
}

export interface IBuyableUpgrade {
    id: number;
    parentId?: number;
    position: UpgradePosition;
    description: string;
    dynamicDescription?: (game: Game) => string;
    price: Decimal;
    priceMultiplier: Decimal;
    currentAmount: Decimal;
    maxAmount: number;
    isBought: boolean;
    isMaxed?: boolean;
    calcPrice?: (upg: IBuyableUpgrade) => Decimal;
    whenCanShow?: string;
    effect: (game: Game) => void;
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