import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";

export const pUp1: IOneTimeUpgrade = {
    id: 1,
    description: "Generate 1p/s",
    price: 10,
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n + 1)
}

const pUp101: IBuyableUpgrade = {
    id: 101,
    description: "Add 1 point gain",
    price: 11,
    priceMultiplier: 1.5,
    currentAmount: 0,
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n + 1)
}

const pUp102: IBuyableUpgrade = {
    id: 102,
    description: "+ 0.1 point multi",
    price: 1000,
    priceMultiplier: 1.2,
    currentAmount: 0,
    maxAmount: 100,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n + 0.1)
}

const pUp201: IOneTimeUpgrade = {
    id: 201,
    description: "+1 point multi",
    price: 100,
    isBought: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n + 1)
}

const pUp202: IOneTimeUpgrade = {
    id: 202,
    description: "Add 10 point gain",
    price: 500,
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n + 10)
}

export { pUp101, pUp102, pUp201, pUp202 }




