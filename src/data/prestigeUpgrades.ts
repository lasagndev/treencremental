import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";
// import {useEffect, useState} from "react";
// import {ppUp102Effect} from "../components/PrestigeTree.tsx";

export const ppUp1: IOneTimeUpgrade = {
    id: 1,
    position: { x: 0, y: 0 },
    description: "*2 point multi",
    price: new Decimal(1),
    isBought: (() => { try { return JSON.parse(localStorage.getItem("ppUp1") ?? "false"); } catch { return false; } })() || false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(2))
        game.setGlobalPointMultiplier(n => n.times(2))
        game.setPointMultiFromPrestige(n => n.times(2))
    }
}

// -------------------------------------
// ---------- buyable upgrady ----------
// ---------------- vvv ----------------

const ppUp101: IBuyableUpgrade = {
    id: 101,
    parentId: 1,
    position: { x: -1, y: -0.5 },
    description: "+0.01 point exponent",
    price: new Decimal(1),
    priceMultiplier: new Decimal(5),
    calcPrice: (upg) => upg.price.times(upg.priceMultiplier.pow(upg.currentAmount)),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) => {
        game.setGlobalPointExponent(n => n.plus(0.01))
        game.setPointExponentFromPrestige(n => n.plus(0.01))
    }
}

const ppUp102: IBuyableUpgrade = {
    id: 102,
    parentId: 101,
    position: { x: -2, y: -0.5 },
    description: "Boost your points based on PP",
    price: new Decimal(4),
    priceMultiplier: new Decimal(2),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: () => {}
}

const ppUp103: IBuyableUpgrade = {
    id: 103,
    parentId: 1,
    position: { x: -1, y: 0.5 },
    description: "Automation interval / 1.10",
    price: new Decimal(5),
    priceMultiplier: new Decimal(2),
    currentAmount: new Decimal(0),
    maxAmount: 13,
    isBought: false,
    isMaxed: false,
    whenCanShow: "Automation",
    effect: (game) => {
        game.setAutomationInterval(n => n / 1.2)
    }
}

const ppUp201: IOneTimeUpgrade = {
    id: 201,
    parentId: 1,
    position: { x: 1, y: 0 },
    description: "+10 base point gain",
    price: new Decimal(2),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointAddition(n => n.plus(10))
        game.setPointGainFromPrestige(n => n.plus(10))
    }
}

export const ppUpAuto1to5: IOneTimeUpgrade = {
    id: 301,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 1-5",
    price: new Decimal(3),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto6to10: IOneTimeUpgrade = {
    id: 302,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 6-10",
    price: new Decimal(10),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto11to15: IOneTimeUpgrade = {
    id: 303,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 11-15",
    price: new Decimal(25),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto16to20: IOneTimeUpgrade = {
    id: 304,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 16-20",
    price: new Decimal(100),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

// const ppUp202: IOneTimeUpgrade = {
//     id: 202,
//     parentId: 201,
//     position: { x: 2, y: 0 },
//     description: "+0.01 point exponent",
//     price: new Decimal(1),
//     isBought: false,
//     effect: (game) => {
//         game.setGlobalPointExponent(n => n.plus(0.01))
//         game.setPointExponentFromPrestige(n => n.plus(0.01))
//     }
// }



/*

//NASZE SIURKI!!!!!!!!!!!!!!!!!!!

const ppUp501: IBuyableUpgrade = {
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
    effect: (game) => game.setPrestigePoint(n => n.plus(new Decimal(1e8)))
}

const ppUp502: IBuyableUpgrade = {
    id: 502,
    parentId: 1,
    position: { x: 0, y: -2 },
    description: "siur razy 1000",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 1000000,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setPrestigePoint(n => n.times(1000))
}

const ppUp503: IBuyableUpgrade = {
    id: 503,
    parentId: 1,
    position: { x: 1, y: -2 },
    description: "OPARCIEEEEEEEEEEEEEEE ^2",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 642703589,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setPrestigePoint(n => n.pow(2))
}

const ppUp504: IBuyableUpgrade = {
    id: 504,
    parentId: 1,
    position: { x: 2, y: -2 },
    description: "ŚRUBAAAAAAAAAAAAAAAAAAAA 1",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 642703589,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setPrestigePoint(n => n.plus(new Decimal(1)))
}

const ppUp505: IBuyableUpgrade = {
    id: 505,
    parentId: 1,
    position: { x: 3, y: -2 },
    description: "ŚRUBAAAAAAAAAAAAAAAAAAAA *2",
    price: new Decimal(0),
    priceMultiplier: new Decimal(1),
    currentAmount: new Decimal(0),
    maxAmount: 642703589,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setPrestigePoint(n => n.times(new Decimal(2)))
}


*/

export {
    ppUp101, ppUp102, ppUp103, ppUp201,
    // ppUp501, ppUp502, ppUp503, ppUp504, ppUp505
}
