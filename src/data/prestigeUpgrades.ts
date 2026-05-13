import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";

export const ppUp1: IOneTimeUpgrade = {
    id: 1,
    position: { x: 0, y: 0 },
    description: "*2 point multi",
    price: new Decimal(1),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(2))
        game.setGlobalPointMultiplier(n => n.times(2))
    }
}

// -------------------------------------
// ---------- buyable upgrady ----------
// ---------------- vvv ----------------

const ppUp101: IBuyableUpgrade = {
    id: 101,
    parentId: 1,
    position: { x: -1, y: 0 },
    description: "+0.01 point exponent",
    price: new Decimal(1),
    priceMultiplier: new Decimal(5),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointExponent(n => n.plus(0.01))
}

const ppUp102: IBuyableUpgrade = {
    id: 102,
    parentId: 101,
    position: { x: -2, y: 0 },
    description: "+5 point multi",
    price: new Decimal(5),
    priceMultiplier: new Decimal(1.8),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(5))
}

const ppUp103: IBuyableUpgrade = {
    id: 103,
    parentId: 1,
    position: { x: -1, y: 1 },
    description: "+100 point gain",
    price: new Decimal(3),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(100))
}

const ppUp104: IBuyableUpgrade = {
    id: 104,
    parentId: 103,
    position: { x: -2, y: 1 },
    description: "+1000 point gain",
    price: new Decimal(8),
    priceMultiplier: new Decimal(1.6),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(1000))
}

// -------------------------------------
// ---------- one-time uprady ----------
// ---------------- vvv ----------------

const ppUp201: IOneTimeUpgrade = {
    id: 201,
    parentId: 1,
    position: { x: 1, y: 0 },
    description: "x2 point multiplier",
    price: new Decimal(5),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(2))
        game.setGlobalPointMultiplier(n => n.times(2))
    }
}

const ppUp202: IOneTimeUpgrade = {
    id: 202,
    parentId: 201,
    position: { x: 2, y: -0.5 },
    description: "x3 point multiplier",
    price: new Decimal(15),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(3))
        game.setGlobalPointMultiplier(n => n.times(3))
    }
}

const ppUp203: IOneTimeUpgrade = {
    id: 203,
    parentId: 201,
    position: { x: 2, y: 0.5 },
    description: "+500 point gain",
    price: new Decimal(10),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(500))
}

const ppUp204: IOneTimeUpgrade = {
    id: 204,
    parentId: 202,
    position: { x: 3, y: -1 },
    description: "x5 point multiplier",
    price: new Decimal(50),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(5))
        game.setGlobalPointMultiplier(n => n.times(5))
    }
}

const ppUp205: IOneTimeUpgrade = {
    id: 205,
    parentId: 203,
    position: { x: 3, y: 0.5 },
    description: "+5000 point gain",
    price: new Decimal(30),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(5000))
}

export {
    ppUp101, ppUp102, ppUp103, ppUp104,
    ppUp201, ppUp202, ppUp203, ppUp204, ppUp205,
}
