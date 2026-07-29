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

export const firstDegeneratorUnlock: IOneTimeUpgrade = {
    id: 301,
    parentId: 1,
    position: { x: -0, y: 1 },
    description: "Unlock degenerator 1",
    price: new Decimal(15),
    isBought: false,
    effect: (game) => {
        game.setCanShowDegenerators(prev => prev.map((v, i) => i === 0 ? true : v))
    }
}

export const multiClickerUnlock: IOneTimeUpgrade = {
    id: 302,
    parentId: 301,
    position: { x: -0, y: 2 },
    description: "Unlock multi clicker",
    price: new Decimal(1e6),
    isBought: false,
    effect: (game) => {
        game.setCanShowMultiClicker(true)
    }
}

export const secondDegeneratorUnlock: IOneTimeUpgrade = {
    id: 303,
    parentId: 302,
    position: { x: -0, y: 3 },
    description: "Unlock degenerator 2",
    price: new Decimal(15),
    isBought: false,
    effect: (game) => {
        game.setCanShowDegenerators(prev => prev.map((v, i) => i === 1 ? true : v))
    }
}

export const thirdDegeneratorUnlock: IOneTimeUpgrade = {
    id: 304,
    parentId: 303,
    position: { x: -0, y: 4 },
    description: "Unlock degenerator 3",
    price: new Decimal(15),
    isBought: false,
    effect: (game) => {
        game.setCanShowDegenerators(prev => prev.map((v, i) => i === 2 ? true : v))
    }
}

export const fourthDegeneratorUnlock: IOneTimeUpgrade = {
    id: 305,
    parentId: 304,
    position: { x: -0, y: 5 },
    description: "Unlock degenerator 4",
    price: new Decimal(15),
    isBought: false,
    effect: (game) => {
        game.setCanShowDegenerators(prev => prev.map((v, i) => i === 3 ? true : v))
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



// suiry

const apUp401: IBuyableUpgrade = {
    id: 401,
    parentId: 1,
    position: { x: 1, y: -3 },
    description: "siur",
    price: new Decimal(1000),
    priceMultiplier: new Decimal(1.2),
    currentAmount: new Decimal(0),
    maxAmount: 100,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointExponent(n => n.times(2))
}

const apUp402: IBuyableUpgrade = {
    id: 402,
    parentId: 401,
    position: { x: 0, y: -3 },
    description: "siur",
    price: new Decimal(1000),
    priceMultiplier: new Decimal(1.2),
    currentAmount: new Decimal(0),
    maxAmount: 100,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointExponent(n => n.pow(new Decimal(1e200).pow(new Decimal(1e200).pow(new Decimal(1e200)))))
}

const apUp501: IBuyableUpgrade = {
    id: 501,
    parentId: 1,
    position: { x: -1, y: -2 },
    description: "siur 1e8",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 1000000,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setAntyPoint(n => n.plus(new Decimal(1e8)))
}

const apUp502: IBuyableUpgrade = {
    id: 502,
    parentId: 1,
    position: { x: 0, y: -2 },
    description: "siur 1000",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 1000000,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setAntyPoint(n => n.plus(1000))
}

const apUp503: IBuyableUpgrade = {
    id: 503,
    parentId: 1,
    position: { x: 1, y: -2 },
    description: "siur 10000",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 642703589,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setAntyPoint(n => n.plus(10000))
}

const apUp504: IBuyableUpgrade = {
    id: 504,
    parentId: 1,
    position: { x: 2, y: -2 },
    description: "siur 1e6",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 642703589,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setAntyPoint(n => n.plus(new Decimal(1e6)))
}

const apUp505: IBuyableUpgrade = {
    id: 505,
    parentId: 1,
    position: { x: -2, y: -2 },
    description: "siur 1e15",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 642703589,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setAntyPoint(n => n.plus(new Decimal(1e15)))
}

export {
    // buyable:

    // one-time:

    // siury:
    apUp401, apUp402,
    apUp501, apUp502, apUp503, apUp504, apUp505
}
