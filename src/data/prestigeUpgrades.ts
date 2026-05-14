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



export {
    ppUp101
}
