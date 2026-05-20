import type {IBuyableUpgrade, IOneTimeUpgrade, IUnlockUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";
import type {Game} from "../Models/Game.ts";


export const pUp1: IOneTimeUpgrade = {
    id: 1,
    position: { x: -0, y: 0 },
    description: "Generate 1p/s",
    price: new Decimal(10),
    isBought: (() => { try { return JSON.parse(localStorage.getItem("pUp1") ?? "false"); } catch { return false; } })() || false,
    effect: (game) => {
        game.setGlobalPointAddition(n => n.plus(1))

    }
}

export const prestigeUnlock : IUnlockUpgrade = {
    id: 301,
    parentId: 1,
    position: { x: 0, y: 1 },
    description: "Reset point tree, to unlock new content.",
    price: new Decimal(1e15),
    isBought: (() => { try { return JSON.parse(localStorage.getItem("prestigeUnlock") ?? "false"); } catch { return false; } })(),
    unlocks: "PrestigeTree",
    effect: (game: Game) => {
        console.log(game)
    }
}

export function fmt_upgrade(n: Decimal): string {
    if (n.gte('1e1000000')) return n.toExponential(6).replace('e+', 'e')
    if (n.gte('1e100000'))  return n.toExponential(5).replace('e+', 'e')
    if (n.gte('1e10000'))   return n.toExponential(4).replace('e+', 'e')
    if (n.gte('1e1000'))    return n.toExponential(3).replace('e+', 'e')
    if (n.gte(1e6))         return n.toExponential(2).replace('e+', 'e')
    return n.toFixed(2)
}

// -------------------------------------
// ---------- buyable upgrady ----------
// ---------------- vvv ----------------

const pUp101: IBuyableUpgrade = {
    id: 101,
    parentId: 1,
    position: { x: -1, y: 0 },
    description: "Add 1 point gain",
    price: new Decimal(11),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    calcPrice: (upg) => upg.price.plus(new Decimal(1).plus(upg.currentAmount).pow_base(1.4)),
    effect: (game) => game.setGlobalPointAddition(n => n.plus(1))
}

const pUp102: IBuyableUpgrade = {
    id: 102,
    parentId: 101,
    position: { x: -2, y: -0.5 },
    description: "+ 0.2 point multi",
    dynamicDescription: (game) => `+${fmt_upgrade(new Decimal(0.2).times(game.globalMultiplierMultiplier))} point multi`,
    price: new Decimal(600),
    priceMultiplier: new Decimal(1.2),
    calcPrice: (upg) => upg.price.times(((upg.currentAmount).pow(1.1)).plus(new Decimal(1))),
    currentAmount: new Decimal(0),
    maxAmount: 100,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(0.2).times(game.globalMultiplierMultiplier)))
}

const pUp103: IBuyableUpgrade = {
    id: 103,
    parentId: 101,
    position: { x: -2, y: 0.5 },
    description: "+ 2 point gain",
    price: new Decimal(800),
    priceMultiplier: new Decimal(1.1),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(2))
}

const pUp104: IBuyableUpgrade = {
    id: 104,
    parentId: 102,
    position: { x: -3, y: -1 },
    description: "* 1.5  point multi",
    price: new Decimal(10000),
    priceMultiplier: new Decimal(10),
    currentAmount: new Decimal(0),
    maxAmount: 5,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.5))
        game.setGlobalPointMultiplier(n => n.times(1.5))
    }
}

const pUp105: IBuyableUpgrade = {
    id: 105,
    parentId: 103,
    position: { x: -3, y: 0 },
    description: "+ 5 point gain",
    price: new Decimal(5000),
    priceMultiplier: new Decimal(1.1),
    currentAmount: new Decimal(0),
    maxAmount: 40,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(5))
}

const pUp106: IBuyableUpgrade = {
    id: 106,
    parentId: 104,
    position: { x: -4, y: -1.5 },
    description: "* 1.1  point multi",
    price: new Decimal(20000),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.1))
        game.setGlobalPointMultiplier(n => n.times(1.1))
    }
}

const pUp107: IBuyableUpgrade = {
    id: 107,
    parentId: 105,
    position: { x: -4, y: -0.5 },
    description: "+ 50 point gain",
    price: new Decimal(50000),
    priceMultiplier: new Decimal(2),
    currentAmount: new Decimal(0),
    maxAmount: 5,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(50))
}

const pUp108: IBuyableUpgrade = {
    id: 108,
    parentId: 105,
    position: { x: -4, y: 0.5 },
    description: "+ 25 point gain",
    price: new Decimal(20000),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(25))
}

const pUp109: IBuyableUpgrade = {
    id: 109,
    parentId: 108,
    position: { x: -5, y: 0.5 },
    description: "+ 150 point gain",
    price: new Decimal(1e7),
    priceMultiplier: new Decimal(1.2),
    currentAmount: new Decimal(0),
    maxAmount: 40,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(150))
}

const pUp110: IBuyableUpgrade = {
    id: 110,
    parentId: 106,
    position: { x: -5, y: -1 },
    description: "* 1.1  point multi",
    price: new Decimal(1e7),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.1))
        game.setGlobalPointMultiplier(n => n.times(1.1))
    }
}


const pUp111: IBuyableUpgrade = {
    id: 111,
    parentId: 106,
    position: { x: -5, y: -2 },
    description: "",
    dynamicDescription: (game) => `+${fmt_upgrade(new Decimal(2).times(game.globalMultiplierMultiplier))} point multi`,
    price: new Decimal(5e7),
    priceMultiplier: new Decimal(1.2),
    calcPrice: (upg) => upg.price.times(((upg.currentAmount.plus(new Decimal(1))).pow(2))),
    currentAmount: new Decimal(0),
    maxAmount: 40,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(1).times(game.globalMultiplierMultiplier))),
}

const pUp112: IBuyableUpgrade = {
    id: 112,
    parentId: 110,
    position: { x: -6, y: -1 },
    description: "* 1.2  point multi",
    price: new Decimal(1e9),
    priceMultiplier: new Decimal(2),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.2))
        game.setGlobalPointMultiplier(n => n.times(1.2))
    }
}

const pUp113: IBuyableUpgrade = {
    id: 113,
    parentId: 109,
    position: { x: -6, y: 0 },
    description: "+ 500 point gain",
    price: new Decimal(1e9),
    priceMultiplier: new Decimal(1.2),
    currentAmount: new Decimal(0),
    maxAmount: 50,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(500))
}

const pUp114: IBuyableUpgrade = {
    id: 114,
    parentId: 109,
    position: { x: -6, y: 1 },
    description: "+ 1000 point gain",
    price: new Decimal(1e10),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(1000))
}

const pUp115: IBuyableUpgrade = {
    id: 115,
    parentId: 111,
    position: { x: -6, y: -2 },
    description: "* 1.6  point multi",
    price: new Decimal(1e11),
    priceMultiplier: new Decimal(100),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.6))
        game.setGlobalPointMultiplier(n => n.times(1.6))
    }
}

const pUp116: IBuyableUpgrade = {
    id: 116,
    parentId: 114,
    position: { x: -7, y: 1.5 },
    description: "+ 2000 point gain",
    price: new Decimal(1e11),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(2000))
}

const pUp117: IBuyableUpgrade = {
    id: 117,
    parentId: 114,
    position: { x: -7, y: 0.5 },
    description: "+ 5000 point gain",
    price: new Decimal(1e12),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 20,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(5000))
}

const pUp118: IBuyableUpgrade = {
    id: 118,
    parentId: 106,
    position: { x: -4, y: -2.5 },
    description: "* 1.05  point multi",
    price: new Decimal(1e7),
    priceMultiplier: new Decimal(10),
    currentAmount: new Decimal(0),
    maxAmount: 1000,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.05))
        game.setGlobalPointMultiplier(n => n.times(1.05))
    }
}

const pUp119: IBuyableUpgrade = {
    id: 119,
    parentId: 112,
    position: { x: -7, y: -1 },
    description: "* 1.2  point multi",
    price: new Decimal(1e11),
    priceMultiplier: new Decimal(1.8),
    currentAmount: new Decimal(0),
    maxAmount: 15,
    isBought: false,
    isMaxed: false,
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.2))
        game.setGlobalPointMultiplier(n => n.times(1.2))
    }
}

const pUp120: IBuyableUpgrade = {
    id: 120,
    parentId: 119,
    position: { x: -8, y: -1 },
    description: "* 1.3  point multi",
    price: new Decimal(2e15),
    priceMultiplier: new Decimal(1.8),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    whenCanShow: "prestige",
    effect: (game) =>{
        game.setGlobalMultiplierMultiplier(n => n.times(1.3))
        game.setGlobalPointMultiplier(n => n.times(1.3))
    }
}

const pUp121: IBuyableUpgrade = {
    id: 121,
    parentId: 117,
    position: { x: -8, y: 0 },
    description: "+ 20000 point gain",
    price: new Decimal(1e17),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    whenCanShow: "prestige",
    effect: (game) =>{
        game.setGlobalPointAddition(n => n.plus(20000))
    }
}

const pUp122: IBuyableUpgrade = {
    id: 122,
    parentId: 117,
    position: { x: -8, y: 1 },
    description: "+ 50000 point gain",
    price: new Decimal(1e18),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    whenCanShow: "prestige",
    effect: (game) =>{
        game.setGlobalPointAddition(n => n.plus(50000))
    }
}

// -------------------------------------
// ---------- one-time uprady ----------
// ---------------- vvv ----------------


const pUp201: IOneTimeUpgrade = {
    id: 201,
    parentId: 1,
    position: { x: 1, y: 0 },
    description: "+1 point multi",
    dynamicDescription: (game) => `+${fmt_upgrade(new Decimal(1).times(game.globalMultiplierMultiplier))} point multi`,
    price: new Decimal(100),
    isBought: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(1).times(game.globalMultiplierMultiplier)))
}

const pUp202: IOneTimeUpgrade = {
    id: 202,
    parentId: 201,
    position: { x: 2, y: -0.5 },
    description: "Add 10 point gain",
    price: new Decimal(500),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(10))
}

const pUp203: IOneTimeUpgrade = {
    id: 203,
    parentId: 201,
    position: { x: 2, y: 0.5 },
    description: "* 2 point multi",
    price: new Decimal(5000),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(2))
        game.setGlobalPointMultiplier(n => n.times(2))
    }
}

const pUp204: IOneTimeUpgrade = {
    id: 204,
    parentId: 202,
    position: {x: 3, y: -1},
    description: "Double your points once",
    price: new Decimal(5000),
    isBought: false,
    effect: (game) => game.setPoint(n => n.plus(5000).times(2))
}

const pUp205: IOneTimeUpgrade = {
    id: 205,
    parentId: 203,
    position: { x: 3, y: 0 },
    description: "Add 50 point gain",
    price: new Decimal(20000),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(50))
}

const pUp206: IOneTimeUpgrade = {
    id: 206,
    parentId: 203,
    position: { x: 3, y: 1 },
    description: "+5 point multi",
    dynamicDescription: (game) => `+${fmt_upgrade(new Decimal(5).times(game.globalMultiplierMultiplier))} point multi`,
    price: new Decimal(30000),
    isBought: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(5).times(game.globalMultiplierMultiplier)))
}

const pUp207: IOneTimeUpgrade = {
    id: 207,
    parentId: 204,
    position: {x: 4, y: -1.5},
    description: "Triple your points once",
    price: new Decimal(50000),
    isBought: false,
    effect: (game) => game.setPoint(n => n.plus(50000).times(3))
}

const pUp208: IOneTimeUpgrade = {
    id: 208,
    parentId: 207,
    position: {x: 5, y: -2},
    description: "Quadruple your points once",
    price: new Decimal(500000),
    isBought: false,
    effect: (game) => game.setPoint(n => n.plus(500000).times(4))
}

const pUp209: IOneTimeUpgrade = {
    id: 209,
    parentId: 205,
    position: {x: 4, y: -0.5},
    description: "+ 300 point gain",
    price: new Decimal(1e7),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(300))
}

const pUp210: IOneTimeUpgrade = {
    id: 210,
    parentId: 205,
    position: {x: 4, y: 0.5},
    description: "+ 500 point gain",
    price: new Decimal(1e8),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(500))
}

const pUp211: IOneTimeUpgrade = {
    id: 211,
    parentId: 206,
    position: { x: 4, y: 1.5 },
    description: "*3 point multi",
    price: new Decimal(1e9),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(3))
        game.setGlobalPointMultiplier(n => n.times(3))
    }
}

const pUp212: IOneTimeUpgrade = {
    id: 212,
    parentId: 209,
    position: {x: 5, y: -1},
    description: "+ 1000 point gain",
    price: new Decimal(2e8),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(1000))
}

const pUp213: IOneTimeUpgrade = {
    id: 213,
    parentId: 209,
    position: {x: 5, y: 0},
    description: "+ 2000 point gain",
    price: new Decimal(5e8),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(2000))
}

const pUp214: IOneTimeUpgrade = {
    id: 214,
    parentId: 211,
    position: { x: 5, y: 2 },
    description: "",
    dynamicDescription: (game) => `+${fmt_upgrade(new Decimal(15).times(game.globalMultiplierMultiplier))} point multi`,
    price: new Decimal(1e10),
    isBought: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(15).times(game.globalMultiplierMultiplier)))
}

const pUp215: IOneTimeUpgrade = {
    id: 215,
    parentId: 211,
    position: { x: 5, y: 1 },
    description: "*4 point multi",
    price: new Decimal(1e13),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(4))
        game.setGlobalPointMultiplier(n => n.times(4))
    }
}

const pUp216: IOneTimeUpgrade = {
    id: 216,
    parentId: 213,
    position: {x: 6, y: 0.5},
    description: "+ 5000 point gain",
    price: new Decimal(1e10),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(5000))
}

const pUp217: IOneTimeUpgrade = {
    id: 217,
    parentId: 212,
    position: {x: 6, y: -0.5},
    description: "+ 10000 point gain",
    price: new Decimal(1e11),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(10000))
}

const pUp218: IOneTimeUpgrade = {
    id: 218,
    parentId: 217,
    position: {x: 7, y: -1},
    description: "+ 200000 point gain",
    price: new Decimal(1e16),
    isBought: false,
    whenCanShow: "prestige",
    effect: (game) => game.setGlobalPointAddition(n => n.plus(200000))
}

const pUp219: IOneTimeUpgrade = {
    id: 219,
    parentId: 217,
    position: {x: 7, y: 0},
    description: "+ 500000 point gain",
    price: new Decimal(1e17),
    isBought: false,
    whenCanShow: "prestige",
    effect: (game) => game.setGlobalPointAddition(n => n.plus(500000))
}

const pUp220: IOneTimeUpgrade = {
    id: 220,
    parentId: 214,
    position: {x: 6, y: 2.5},
    description: "+ 500000 point gain",
    price: new Decimal(1e17),
    isBought: false,
    whenCanShow: "prestige",
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(50).times(game.globalMultiplierMultiplier)))
}

const pUp221: IOneTimeUpgrade = {
    id: 221,
    parentId: 215,
    position: {x: 6, y: 1.5},
    description: "* 5 point multi",
    price: new Decimal(1e20),
    isBought: false,
    whenCanShow: "prestige",
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(5))
        game.setGlobalPointMultiplier(n => n.times(5))
    }
}



// 300+ UPGARADAS :3:3:3:3:3:3:3

const pUp302: IBuyableUpgrade = {
    id: 302,
    parentId: 301,
    position: { x: 0, y: 2 },
    description: "* 2 Prestige points",
    price: new Decimal(1e20),
    priceMultiplier: new Decimal(1e10),
    currentAmount: new Decimal(0),
    maxAmount: 1000,
    isBought: false,
    isMaxed: false,
    whenCanShow: "prestige",
    effect: (game) => game.setPrestigePointMulti(n => n.times(2))
}


// -------------------------------------
// ---------- upgrady dla nas ----------
// ---------------- vvv ----------------

const pUp401: IBuyableUpgrade = {
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

const pUp402: IBuyableUpgrade = {
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

const pUp501: IBuyableUpgrade = {
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
    whenCanShow: "prestige",
    effect: (game) => game.setPoint(n => n.plus(new Decimal(1e8)))
}

const pUp502: IBuyableUpgrade = {
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
    effect: (game) => game.setPoint(n => n.plus(1000))
}

const pUp503: IBuyableUpgrade = {
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
    effect: (game) => game.setPoint(n => n.plus(10000))
}

const pUp504: IBuyableUpgrade = {
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
    effect: (game) => game.setPoint(n => n.plus(new Decimal(1e6)))
}



export {
    pUp101, pUp102, pUp103, pUp104, pUp105, pUp106, pUp107, pUp108, pUp109, pUp110, pUp111, pUp112, pUp113, pUp114, pUp115, pUp116, pUp117, pUp118, pUp119, pUp120, pUp121, pUp122,
    pUp201, pUp202, pUp203, pUp204, pUp205, pUp206, pUp207, pUp208, pUp209, pUp210, pUp211, pUp212, pUp213, pUp214, pUp215, pUp216, pUp217, pUp218, pUp219, pUp220, pUp221,
    pUp302,
    pUp401, pUp402, pUp501, pUp502, pUp503, pUp504
}
