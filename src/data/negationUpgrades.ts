import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";

export const apUp1: IOneTimeUpgrade = {
    id: 1,
    position: { x: -0, y: 0 },
    description: "Lose 1p/s",
    price: new Decimal(10),
    isBought: (() => { try { return JSON.parse(localStorage.getItem("apUp1") ?? "false"); } catch { return false; } })() || false,
    effect: (game) => {
        game.setGlobalPointAddition(n => n.plus(1))
    }
}

export const generatorUnlock: IOneTimeUpgrade = {
    id: 301,
    parentId: 1,
    position: { x: -0, y: 1 },
    description: "Unlock generator",
    price: new Decimal(15),
    isBought: (() => { try { return JSON.parse(localStorage.getItem("ppUp301") ?? "false"); } catch { return false; } })() || false,
    effect: (game) => {
        game.setCanShowGenerator(true)
    }
}

function fmtExp(n: Decimal, d: number): string {
    const s = n.toExponential(d).replace('e+', 'e')
    const [mantissa, exp] = s.split('e')
    const decimals = mantissa.includes('.') ? mantissa.split('.')[1].length : 0
    const dot = decimals === 0 && d > 0 ? '.' : ''
    return mantissa + dot + '0'.repeat(Math.max(0, d - decimals)) + 'e' + exp
}

export function fmt_upgrade(n: Decimal): string {
    if (n.gte('1e1000000')) return fmtExp(n, 6)
    if (n.gte('1e100000'))  return fmtExp(n, 5)
    if (n.gte('1e10000'))   return fmtExp(n, 4)
    if (n.gte('1e1000'))    return fmtExp(n, 3)
    if (n.gte(1e6))         return fmtExp(n, 2)
    return n.toFixed(2)
}


// -------------------------------------
// ---------- buyable upgrady ----------
// ---------------- vvv ----------------

const apUp101: IBuyableUpgrade = {
    id: 101,
    parentId: 1,
    position: { x: -1, y: 0 },
    description: "Subtract 1 point gain",
    bulkDescription: (count) => `-${count} point gain`,
    price: new Decimal(11),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    calcPrice: (upg) => upg.price.plus(new Decimal(1).plus(upg.currentAmount).pow_base(1.4)),
    effect: (game) => game.setGlobalPointAddition(n => n.plus(1))
}

// -------------------------------------
// ---------- one-time uprady ----------
// ---------------- vvv ----------------

const apUp201: IOneTimeUpgrade = {
    id: 201,
    parentId: 1,
    position: { x: 1, y: 0 },
    description: "+1 point multi",
    dynamicDescription: (game) => `+${fmt_upgrade(new Decimal(1).times(game.globalMultiplierMultiplier))} point multi`,
    price: new Decimal(100),
    isBought: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(1).times(game.globalMultiplierMultiplier)))
}


export {
    // buyable:
    apUp101,
    // one-time:
    apUp201,
    // siury:

}
