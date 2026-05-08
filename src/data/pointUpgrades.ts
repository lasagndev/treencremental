import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";

export const pUp1: IOneTimeUpgrade = {
    id: 1,
    position: { x: -0, y: 0 },
    description: "Generate 1p/s",
    price: new Decimal(10),
    isBought: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(1))
}

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
    description: "+ 0.1 point multi",
    dynamicDescription: (game) => `+${new Decimal(0.2).times(game.globalMultiplierMultiplier).toFixed(2)} point multi`,
    price: new Decimal(600),
    priceMultiplier: new Decimal(1.2),
    currentAmount: new Decimal(0),
    maxAmount: 100,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointMultiplier(n => n.plus(new Decimal(0.1).times(game.globalMultiplierMultiplier)))
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
    position: { x: -3, y: -0.5 },
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
    position: { x: -3, y: 0.5 },
    description: "+ 5 point gain",
    price: new Decimal(10000),
    priceMultiplier: new Decimal(1.1),
    currentAmount: new Decimal(0),
    maxAmount: 30,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointAddition(n => n.plus(5))


}

const pUp201: IOneTimeUpgrade = {
    id: 201,
    parentId: 1,
    position: { x: 1, y: 0 },
    description: "+1 point multi",
    dynamicDescription: (game) => `+${new Decimal(1).times(game.globalMultiplierMultiplier).toFixed(2)} point multi`,
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
    effect: (game) => game.setPoint(n => n.times(2))
}


const pUp401: IBuyableUpgrade = {
    id: 401,
    parentId: 1,
    position: { x: 0, y: -1 },
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
    position: { x: 0, y: -2 },
    description: "siur",
    price: new Decimal(1000),
    priceMultiplier: new Decimal(1.2),
    currentAmount: new Decimal(0),
    maxAmount: 100,
    isBought: false,
    isMaxed: false,
    effect: (game) => game.setGlobalPointExponent(n => n.pow(2))
}

export { pUp101, pUp102, pUp103, pUp104, pUp105, pUp201, pUp202, pUp203, pUp204, pUp401, pUp402 }
