import type { Game } from "./Game.ts";

export interface IOneTimeUpgrade {
    id: number;
    description: string;
    price: number;
    isBought: boolean;
    effect: (game: Game) => void;
}

export interface IBuyableUpgrade {
    id: number;
    description: string;
    price: number;
    priceMultiplier: number;
    currentAmount: number;
    maxAmount: number;
    isBought: boolean;
    isMaxed: boolean;
    effect: (game: Game) => void;
}

export interface IUnlockUpgrade {
    id: number;
    description: string;
    price: number;
    isBought: boolean;
    unlocks: string;
    effect: (game: Game) => void;
}