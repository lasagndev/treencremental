import type {IBuyableUpgrade, IOneTimeUpgrade, IUnlockUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";
// import {useEffect, useState} from "react";
// import {ppUp102Effect} from "../components/PrestigeTree.tsx";

export const ppUp1: IOneTimeUpgrade = {
    id: 1,
    position: { x: 0, y: 0 },
    description: "*3 point multi",
    price: new Decimal(1),
    isBought: (() => { try { return JSON.parse(localStorage.getItem("ppUp1") ?? "false"); } catch { return false; } })() || false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(3))
        game.setGlobalPointMultiplier(n => n.times(3))
        game.setPointMultiFromPrestige(n => n.times(3))
    }
}

// -------------------------------------
// ---------- buyable upgrady ----------
// ---------------- vvv ----------------

const ppUp101: IBuyableUpgrade = {
    id: 101,
    parentId: 1,
    position: { x: -1, y: 0 },
    description: "+0.02 point exponent",
    price: new Decimal(1),
    priceMultiplier: new Decimal(5),
    //calcPrice: (upg) => upg.price.times(upg.priceMultiplier.pow(upg.currentAmount)),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    exponentBonusPerLevel: 0.02,
    effect: (game) => {
        game.setGlobalPointExponent(n => n.plus(0.02))
        game.setPointExponentFromPrestige(n => n.plus(0.02))
    }
}

const ppUp102: IBuyableUpgrade = {
    id: 102,
    parentId: 101,
    position: { x: -2, y: -1 },
    description: "Boost your points based on PP",
    price: new Decimal(10),
    priceMultiplier: new Decimal(4),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: () => {},
    tickEffect: (amount, { prestigePoint }) => {
        if (amount.lte(0)) return {};
        let multi = new Decimal(2).plus(prestigePoint.log2().pow(amount.pow(0.8)));
        if(multi.gte(1e10)) multi = new Decimal(1e10).times(prestigePoint.pow(0.1).pow(amount.pow(0.5)));

        return { pointMulti: multi.lte(new Decimal(1)) ? new Decimal(1) : multi };
    }
}

const ppUp103: IBuyableUpgrade = {
    id: 103,
    parentId: 101,
    position: { x: -2, y: 0 },
    description: "Automation interval / 1.20",
    price: new Decimal(5),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 13,
    isBought: false,
    isMaxed: false,
    whenCanShow: "Automation",
    effect: (game) => {
        game.setAutomationInterval(n => n / 1.2)
    }
}

const ppUp104: IBuyableUpgrade = {
    id: 104,
    parentId: 101,
    position: { x: -2, y: 1 },
    description: "*1.7 Point multi",
    price: new Decimal(8),
    priceMultiplier: new Decimal(1.5),
    currentAmount: new Decimal(0),
    maxAmount: 15,
    isBought: false,
    isMaxed: false,
    whenCanShow: "Automation",
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(1.7))
        game.setGlobalMultiplierMultiplier(n => n.times(1.7))
        game.setPointMultiFromPrestige(n => n.times(1.7))
    }
}

const ppUp105: IBuyableUpgrade = {
    id: 105,
    parentId: 104,
    position: { x: -3, y: 1 },
    description: "*1.2 Prestige points",
    price: new Decimal(10),
    priceMultiplier: new Decimal(4),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    whenCanShow: "Automation",
    prestigeMultiPerLevel: 1.2,
    effect: (game) => {
        game.setPrestigePointMulti(n => n.times(1.2))
    }
}

const ppUp106: IBuyableUpgrade = {
    id: 106,
    parentId: 102,
    position: { x: -3, y: -1 },
    description: "Boost your PP based on points",
    price: new Decimal(1e6),
    priceMultiplier: new Decimal(12),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: () => {},
    tickEffect: (amount, { point }) => {
        if (amount.lte(0)) return {};
        const multi = new Decimal(0.1).plus(point.pow(0.01).pow(amount.pow(0.7)));
        return { ppGain: multi.lte(new Decimal(1)) ? new Decimal(1) : multi };
    }
}

const ppUp107: IBuyableUpgrade = {
    id: 107,
    parentId: 105,
    position: { x: -4, y: 1 },
    description: "*2 Point multi",
    price: new Decimal(1e14),
    priceMultiplier: new Decimal(2.5),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(2))
        game.setGlobalMultiplierMultiplier(n => n.times(2))
        game.setPointMultiFromPrestige(n => n.times(2))
    }
}

const ppUp108: IBuyableUpgrade = {
    id: 108,
    parentId: 106,
    position: { x: -4, y: -1 },
    description: "Boost your PE based on points",
    price: new Decimal(5e16),
    priceMultiplier: new Decimal(2),
    currentAmount: new Decimal(0),
    maxAmount: 10,
    isBought: false,
    isMaxed: false,
    effect: () => {},
    tickEffect: (amount, { point }) => {
        if (amount.lte(0)) return {};
        const multi = new Decimal(0.1).plus(point.pow(0.03).times(new Decimal(5).pow(amount)));
        return { peGain: multi.lte(new Decimal(1)) ? new Decimal(1) : multi };
    }
}

const ppUp109: IBuyableUpgrade = {
    id: 109,
    parentId: 107,
    position: { x: -5, y: 0.5 },
    description: "*5 Point multi",
    price: new Decimal(1e18),
    priceMultiplier: new Decimal(7),
    currentAmount: new Decimal(0),
    maxAmount: 3,
    isBought: false,
    isMaxed: false,
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(5))
        game.setGlobalMultiplierMultiplier(n => n.times(5))
        game.setPointMultiFromPrestige(n => n.times(5))
    }
}

const ppUp110: IBuyableUpgrade = {
    id: 110,
    parentId: 107,
    position: { x: -5, y: 1.5 },
    description: "*1.5 Point multi",
    price: new Decimal(5e16),
    priceMultiplier: new Decimal(1.4),
    currentAmount: new Decimal(0),
    maxAmount: 5,
    isBought: false,
    isMaxed: false,
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(1.5))
        game.setGlobalMultiplierMultiplier(n => n.times(1.5))
        game.setPointMultiFromPrestige(n => n.times(1.5))
    }
}

const ppUp202: IOneTimeUpgrade = {
    id: 202,
    parentId: 1,
    position: { x: 1, y: -1 },
    description: "*4 point multi",
    price: new Decimal(2),
    isBought: false,
    effect: (game) => {
        game.setGlobalMultiplierMultiplier(n => n.times(4))
        game.setGlobalPointMultiplier(n => n.times(4))
        game.setPointMultiFromPrestige(n => n.times(4))
    }
}

const ppUp201: IOneTimeUpgrade = {
    id: 201,
    parentId: 1,
    position: { x: 1, y: 0 },
    description: "+50 base point gain",
    price: new Decimal(2),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointAddition(n => n.plus(50))
        game.setPointGainFromPrestige(n => n.plus(50))
    }
}

const ppUp203: IOneTimeUpgrade = {
    id: 203,
    parentId: 201,
    position: { x: 2, y: -0.5 },
    description: "*6 point multi",
    price: new Decimal(8),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(6))
        game.setGlobalMultiplierMultiplier(n => n.times(6))
    }
}

const ppUp204: IOneTimeUpgrade = {
    id: 204,
    parentId: 201,
    position: { x: 2, y: 0.5 },
    description: "+ 200 point gain",
    price: new Decimal(10),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointAddition(n => n.plus(200))
        game.setPointGainFromPrestige(n => n.plus(200))
    }
}

const ppUp205: IOneTimeUpgrade = {
    id: 205,
    parentId: 203,
    position: { x: 3, y: -0.5 },
    description: "+0.05 point exponent",
    price: new Decimal(15),
    isBought: false,
    exponentBonus: 0.05,
    effect: (game) => {
        game.setGlobalPointExponent(n => n.plus(0.05))
        game.setPointExponentFromPrestige(n => n.plus(0.05))
    }
}

const ppUp206: IOneTimeUpgrade = {
    id: 206,
    parentId: 204,
    position: { x: 3, y: 0.5 },
    description: "*8 point multi",
    price: new Decimal(2000),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(8))
        game.setGlobalMultiplierMultiplier(n => n.times(8))
        game.setPointMultiFromPrestige(n => n.times(8))
    }
}

const ppUp207: IOneTimeUpgrade = {
    id: 207,
    parentId: 206,
    position: { x: 4, y: 0 },
    description: "+1 max buyable level",
    price: new Decimal(1e6),
    isBought: false,
    effect: (game, upgrades) => {
        game.setPointUpgradesBonusMaxAmount(n => n + 1)
        upgrades?.setPointBuyableUpgrades?.(prev => prev.map(u => u.id >= 302 ? ({ ...u }) : ({
            ...u
        })))
    }
}

const ppUp208: IOneTimeUpgrade = {
    id: 208,
    parentId: 207,
    position: { x: 5, y: 0.5 },
    description: "+2 max buyable level",
    price: new Decimal(1e7),
    isBought: false,
    effect: (game, upgrades) => {
        game.setPointUpgradesBonusMaxAmount(n => n + 2)
        upgrades?.setPointBuyableUpgrades?.(prev => prev.map(u => u.id >= 302 ? ({ ...u }) : ({
            ...u
        })))
    }
}

const ppUp209: IOneTimeUpgrade = {
    id: 209,
    parentId: 206,
    position: { x: 4, y: 1 },
    description: "+20000 base point gain",
    price: new Decimal(1000),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointAddition(n => n.plus(20000))
        game.setPointGainFromPrestige(n => n.plus(20000))
    }
}

const ppUp210: IOneTimeUpgrade = {
    id: 210,
    parentId: 209,
    position: { x: 5, y: 1.5 },
    description: "*10 point multi",
    price: new Decimal(1e16),
    isBought: false,
    effect: (game) => {
        game.setGlobalPointMultiplier(n => n.times(10))
        game.setGlobalMultiplierMultiplier(n => n.times(10))
        game.setPointMultiFromPrestige(n => n.times(10))
    }
}


// Unlocki

const ppUp301 : IUnlockUpgrade = {
    id: 301,
    parentId: 1,
    position: { x: 0, y: 1 },
    description: "Unlock Generator",
    price: new Decimal(150),
    unlocks: "Generator",
    isBought: (() => { try { return JSON.parse(localStorage.getItem("ppUp301") ?? "false"); } catch { return false; } })() || false,
    effect: (game) => {
        game.setCanShowGenerator(true)
    }
}

// automatyzacj

export const ppUpAuto1to5: IOneTimeUpgrade = {
    id: 3001,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 1-5",
    price: new Decimal(3),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto6to10: IOneTimeUpgrade = {
    id: 3002,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 6-10",
    price: new Decimal(5),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto11to15: IOneTimeUpgrade = {
    id: 3003,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 11-15",
    price: new Decimal(50),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto16to20: IOneTimeUpgrade = {
    id: 3004,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 16-20",
    price: new Decimal(500),
    isBought: false,
    whenCanShow: "automation",
    effect: () => {}
}

export const ppUpAuto21to25: IOneTimeUpgrade = {
    id: 3005,
    position: { x: 0, y: 0 },
    description: "Automate upgrades 21-25",
    price: new Decimal(10000),
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




export {
    ppUp101, ppUp102, ppUp103, ppUp104, ppUp105, ppUp106, ppUp107, ppUp108, ppUp109, ppUp110,
    ppUp201, ppUp202, ppUp203, ppUp204, ppUp205, ppUp206, ppUp207, ppUp208, ppUp209, ppUp210,
    ppUp301,
    ppUp501, ppUp502, ppUp503, ppUp504, ppUp505
}
