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

export const allAchievements: IAchievement[] = [ach1, ach2, ach3, ach4];
