export interface IOneTimeUpgrade {
    id: number;
    description: string;
    price: number;
    isBought: boolean;
    effect: Function;
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
    effect: Function;
}

export interface IUnlockUpgrade {
    id: number;
    description: string;
    price: number;
    isBought: boolean;
    unlocks: string;
    effect: Function;
}