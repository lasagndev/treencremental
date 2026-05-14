import type {Game} from "../Models/Game.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";

export function resetSave() {
    localStorage.removeItem("game");
    localStorage.removeItem("upgrades");
    localStorage.removeItem("prestigeUpgrades");
    localStorage.removeItem("pUp1");
    localStorage.removeItem("prestigeUnlock");
    window.location.reload();
}

export function useSaveSystem(
    game: Game,
    upgrades: { oneTimeUpgrades: IOneTimeUpgrade[]; buyableUpgrades: IBuyableUpgrade[] },
    pupgrades: { oneTimeUpgrades: IOneTimeUpgrade[]; buyableUpgrades: IBuyableUpgrade[] },
    pUp1: boolean,
    prestigeUnlock: boolean,
) {
    localStorage.setItem("game", JSON.stringify({
        point: game.point.toString(),
        globalPointAddition: game.globalPointAddition.toString(),
        globalPointMultiplier: game.globalPointMultiplier.toString(),
        globalPointExponent: game.globalPointExponent.toString(),
        globalMultiplierMultiplier: game.globalMultiplierMultiplier.toString(),
        canShowPrestigeTree: game.canShowPrestigeTree,
        prestigePoint: game.prestigePoint.toString(),
    }));
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
    localStorage.setItem("pUp1", JSON.stringify(pUp1));
    localStorage.setItem("prestigeUnlock", JSON.stringify(prestigeUnlock));
}
