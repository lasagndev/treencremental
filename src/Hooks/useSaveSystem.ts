import type {Game} from "../Models/Game.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import type {Statistics} from "../Models/Statistics.ts";
import type {IAchievement} from "../Models/IAchievement.ts";

export function resetSave() {
    localStorage.removeItem("game");
    localStorage.removeItem("upgrades");
    localStorage.removeItem("prestigeUpgrades");
    localStorage.removeItem("pUp1");
    localStorage.removeItem("prestigeUnlock");
    localStorage.removeItem("ppUp1");
    localStorage.removeItem("stats");
    localStorage.removeItem("achievements");
    window.location.reload();
}

export function useSaveSystem(
    game: Game,
    stats: Statistics,
    upgrades: { oneTimeUpgrades: IOneTimeUpgrade[]; buyableUpgrades: IBuyableUpgrade[] },
    pupgrades: { oneTimeUpgrades: IOneTimeUpgrade[]; buyableUpgrades: IBuyableUpgrade[] },
    pUp1: boolean,
    ppUp1: boolean,
    prestigeUnlock: boolean,
    achievements: IAchievement[],
) {
    localStorage.setItem("game", JSON.stringify({
        point: game.point.toString(),
        globalPointAddition: game.globalPointAddition.toString(),
        globalPointMultiplier: game.globalPointMultiplier.toString(),
        globalPointExponent: game.globalPointExponent.toString(),
        globalMultiplierMultiplier: game.globalMultiplierMultiplier.toString(),
        canShowPrestigeTree: game.canShowPrestigeTree,
        pointMultiFromPrestige: game.pointMultiFromPrestige.toString(),
        pointExponentFromPrestige: game.pointExponentFromPrestige.toString(),
        prestigePoint: game.prestigePoint.toString(),
        prestigePointMulti: game.prestigePointMulti.toString(),
        pointGainFromPrestige: game.pointGainFromPrestige.toString(),
    }));

    localStorage.setItem("stats", JSON.stringify({
        allPoints: stats.allPoints.toString(),
        totalUpgradesBought: stats.totalUpgradesBought.toString(),
        totalPrestiges: stats.totalPrestiges.toString(),
        allPrestigePoints: stats.allPrestigePoints.toString(),
        timePlayed: stats.timePlayed.toString(),
    }))

    localStorage.setItem("upgrades", JSON.stringify({
        oneTimeUpgrades: upgrades.oneTimeUpgrades.map(u => ({ id: u.id, isBought: u.isBought })),
        buyableUpgrades: upgrades.buyableUpgrades.map(u => ({
            id: u.id, isBought: u.isBought, isMaxed: u.isMaxed, currentAmount: u.currentAmount.toString()
        })),
    }));
    localStorage.setItem("prestigeUpgrades", JSON.stringify({
        oneTimeUpgrades: pupgrades.oneTimeUpgrades.map(u => ({ id: u.id, isBought: u.isBought })),
        buyableUpgrades: pupgrades.buyableUpgrades.map(u => ({
            id: u.id, isBought: u.isBought, isMaxed: u.isMaxed, currentAmount: u.currentAmount.toString()
        })),
    }));
    localStorage.setItem("pUp1", JSON.stringify(pUp1 ?? false));
    localStorage.setItem("prestigeUnlock", JSON.stringify(prestigeUnlock ?? false));
    localStorage.setItem("ppUp1", JSON.stringify(ppUp1 ?? false));
    localStorage.setItem("achievements", JSON.stringify(
        achievements.map(a => ({ id: a.id, isUnlocked: a.isUnlocked }))
    ));
}
