import type {IAchievement} from "../Models/IAchievement.ts";
import {pUp1} from "./pointUpgrades.ts";
import Decimal from "break_eternity.js";

const ach1: IAchievement = {
    id: 1,
    name: "Begin the game!",
    description: "Start generating points",
    condition: () => pUp1.isBought,
    isUnlocked: false,
}

const ach2: IAchievement = {
    id: 2,
    name: "Clock it",
    description: "Play for 1 minute",
    condition: (_, stats) => stats.timePlayed.gte(new Decimal(60)),
    isUnlocked: false,
}

const ach3: IAchievement = {
    id: 3,
    name: "markiplier",
    description: "Get your first multi",
    condition: (game) => game.globalPointMultiplier.gt(1),
    isUnlocked: false,
}

const ach4: IAchievement = {
    id: 4,
    name: "LOOK AT THE MONEY🤑🤑🤑🤑",
    description: "Reach 10p/s",
    condition: (game) => game.globalPointAddition.times(game.globalPointMultiplier).pow(game.globalPointExponent).gte(new Decimal(10)),
    isUnlocked: false,
}

const ach5: IAchievement = {
    id: 5,
    name: "Going exponential",
    description: "Reach 1e6 points",
    condition: (game) => game.point.gte(new Decimal(1e6)),
    isUnlocked: false,
}

const ach6: IAchievement = {
    id: 6,
    name: "Shouldn't it be the other way around?",
    description: "Make your point multi bigger than point gain",
    condition: (game) => game.globalPointMultiplier.gt(game.globalPointAddition) && game.globalPointAddition.gt(1),
    isUnlocked: false,
}

const ach7: IAchievement = {
    id: 7,
    name: "No more fun D:",
    description: "Buy upgrade 208. It's the last one like that. No more.",
    //@ts-expect-error aaa
    condition: (game, _, upgrades) => upgrades.oneTimeUpgrades.find(u => u.id === 208)?.isBought === true,
    isUnlocked: false,
}

const ach8: IAchievement = {
    id: 8,
    name: "Shopping spree",
    description: "Buy 200 upgrades.",
    condition: (_, stats) => stats.totalUpgradesBought.gte(new Decimal(200)),
    isUnlocked: false,
}

const ach9: IAchievement = {
    id: 9,
    name: "Clock it (slowed + reverb)",
    description: "Play for 1 hour",
    condition: (_, stats) => stats.timePlayed.gte(new Decimal(3600)),
    isUnlocked: false,
}

/*

   |||             |||
   ||| PO PRESTIGU |||
   vvv             vvv

*/

const ach10: IAchievement = {
    id: 10,
    name: "WHERE IS MY PROGRESS",
    description: "Prestige for the first time",
    condition: (_, stats) => stats.totalPrestiges.gte(1),
    isUnlocked: false,
}

const ach11: IAchievement = {
    id: 11,
    name: "markiplier * markiplier",
    description: "Get your first exponent",
    condition: (game) => game.globalPointExponent.gt(1),
    isUnlocked: false,
}

const ach12: IAchievement = {
    id: 12,
    name: "New era.",
    description: "Buy your first automation",
    condition: (___, _, __, prestigeUpgrades) => prestigeUpgrades.oneTimeUpgrades.find(u => u.id >= 3001 && u.id <= 3005 )?.isBought === true,
    isUnlocked: false
}

const ach13: IAchievement = {
    id: 13,
    name: "Wait, it's relative?",
    description: "Buy prestige upgrade 102",
    condition: (___, _, __, prestigeUpgrades) => prestigeUpgrades.buyableUpgrades.find(u => u.id === 102)?.currentAmount.gte(1) === true,
    isUnlocked: false,
}

const ach14: IAchievement = {
    id: 14,
    name: "BOIII THIS ACHIEVEMENT SO TUFF",
    description: "Have exactly 67PP",
    condition: (game) => game.prestigePoint.eq(new Decimal(67)),
    isUnlocked: false,
}

const ach15: IAchievement = {
    id: 15,
    name: "More prestige 😎",
    description: "Buy upgrade 302 at least once",
    condition: (_, __, pointUpgrades) => pointUpgrades.buyableUpgrades.find(u => u.id === 302)?.currentAmount.gte(1) === true ,
    isUnlocked: false,
}

const ach16: IAchievement = {
    id: 16,
    name: "Underestimation",
    description: "Buy prestige upgrade 206 and witness it's power.",
    condition: (_, __, ___, prestigeUpgrades) => prestigeUpgrades.oneTimeUpgrades.find(u => u.id === 206)?.isBought === true ,
    isUnlocked: false,
}

const ach17: IAchievement = {
    id: 17,
    name: "G E N E R A T O R 👽 👽 👽",
    description: "Unlock generator",
    condition: (game) => game.canShowGenerator,
    isUnlocked: false,
}

const ach18: IAchievement = {
    id: 18,
    name: "Reach Flow State",
    description: "Reach Flow State",
    condition: (game) => game.generatorDuration <= 500,
    isUnlocked: false,
}

// const ach11: IAchievement = {
//     id: 11,
//     name: "Clock that",
//     description: "Play for 2 hours",
//     condition: (_, stats) => stats.timePlayed.gte(new Decimal(7200)),
//     isUnlocked: false,
// }
//
// const ach12: IAchievement = {
//     id: 12,
//     name: "ti kcolC",
//     description: "Play for 3 hours",
//     condition: (_, stats) => stats.timePlayed.gte(new Decimal(10800)),
//     isUnlocked: false,
// }

export const allAchievements: IAchievement[] = [ach1, ach2, ach3, ach4, ach5, ach6, ach7, ach8, ach9, ach10, ach11, ach12, ach13, ach14, ach15, ach16, ach17, ach18];
