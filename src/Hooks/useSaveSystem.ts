import type {Game} from "../Models/Game.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import type {Statistics} from "../Models/Statistics.ts";
import type {IAchievement} from "../Models/IAchievement.ts";
import type {IDegenerator} from "../Models/IDegenerator.ts";

const SAVE_KEYS = [
    "game", "upgrades", "prestigeUpgrades",
    "pUp1", "prestigeUnlock", "ppUp1", "ppUp301",
    "stats", "achievements",
    "generatorUpgrades", "generatorStart", "degenerators", "canShowDegenerators",
    "voidUnlock", "currentTab", "negationUpgrades", "apUp1"
] as const;

export function resetSave() {
    for (const key of SAVE_KEYS) localStorage.removeItem(key);
    window.location.reload();
}

export function exportSave() {
    const bundle: Record<string, string> = {};
    for (const key of SAVE_KEYS) {
        const val = localStorage.getItem(key);
        if (val !== null) bundle[key] = val;
    }
    const encoded = btoa(JSON.stringify(bundle));
    const blob = new Blob([encoded], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "treencremental-save.sav";
    a.click();
    URL.revokeObjectURL(url);
}

export function importSave(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const bundle = JSON.parse(atob((e.target?.result as string).trim())) as Record<string, string>;
            for (const key of SAVE_KEYS) {
                if (key in bundle) localStorage.setItem(key, bundle[key]);
            }
            window.location.reload();
        } catch {
            alert("Invalid save file.");
        }
    };
    reader.readAsText(file);
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
    generatorUpgrades: IBuyableUpgrade[],
    voidUnlock: boolean,
    currentTab: string,
    aupgrades: { oneTimeUpgrades: IOneTimeUpgrade[]; buyableUpgrades: IBuyableUpgrade[] },
    apUp1: boolean,
    degenerators: IDegenerator[]
) {
    localStorage.setItem("game", JSON.stringify({
        point: game.point.toString(),
        globalPointAddition: game.globalPointAddition.toString(),
        globalPointMultiplier: game.globalPointMultiplier.toString(),
        globalPointExponent: game.globalPointExponent.toString(),
        globalMultiplierMultiplier: game.globalMultiplierMultiplier.toString(),
        canShowPrestigeTree: game.canShowPrestigeTree,
        pointMultiFromPrestige: game.pointMultiFromPrestige.toString(),
        prestigePoint: game.prestigePoint.toString(),
        pointGainFromPrestige: game.pointGainFromPrestige.toString(),
        automationInterval: game.automationInterval.toString(),
        canShowGenerator: game.canShowGenerator.toString(),
        generatorDuration: game.generatorDuration.toString(),
        prestigeEnergy: game.prestigeEnergy.toString(),
        peMulti: game.peMulti.toString(),
        peBoostToP: game.peBoostToP.toString(),
        peBoostToPP: game.peBoostToPP.toString(),
        antyPoint: game.antyPoint.toString(),
        isNegated: game.isNegated,
        voidPoint: game.voidPoint.toString(),
        canShowVoidTree: game.canShowVoidTree,
        purePoint: game.purePoint.toString(),
        voidPointMulti: game.voidPointMulti.toString(),
        globalPointLossMultiplier: game.globalPointLossMultiplier.toString(),
        canShowMultiClicker: game.canShowMultiClicker,
        multiPerClick: game.multiPerClick.toString(),
        globalMultiPerClickMultiplier: game.globalMultiPerClickMultiplier.toString(),
        //pointUpgradesBonusMaxAmount: game.pointUpgradesBonusMaxAmount.toString(),
    }));

    localStorage.setItem("stats", JSON.stringify({
        allPoints: stats.allPoints.toString(),
        totalUpgradesBought: stats.totalUpgradesBought.toString(),
        totalPrestiges: stats.totalPrestiges.toString(),
        allPrestigePoints: stats.allPrestigePoints.toString(),
        timePlayed: stats.timePlayed.toString(),
        totalPrestigeEnergy: stats.totalPrestigeEnergy.toString(),
        totalGeneratorLoops: stats.totalGeneratorLoops.toString(),
    }))

    localStorage.setItem("upgrades", JSON.stringify({
        oneTimeUpgrades: upgrades.oneTimeUpgrades.map(u => ({ id: u.id, isBought: u.isBought })),
        buyableUpgrades: upgrades.buyableUpgrades.map(u => ({
            id: u.id, isBought: u.isBought, currentAmount: u.currentAmount.toString(), maxAmount: u.maxAmount
        })),
    }));
    localStorage.setItem("prestigeUpgrades", JSON.stringify({
        oneTimeUpgrades: pupgrades.oneTimeUpgrades.map(u => ({ id: u.id, isBought: u.isBought })),
        buyableUpgrades: pupgrades.buyableUpgrades.map(u => ({
            id: u.id, isBought: u.isBought, currentAmount: u.currentAmount.toString()
        })),
    }));
    localStorage.setItem("pUp1", JSON.stringify(pUp1 ?? false));
    localStorage.setItem("prestigeUnlock", JSON.stringify(prestigeUnlock ?? false));
    localStorage.setItem("ppUp1", JSON.stringify(ppUp1 ?? false));
    localStorage.setItem("ppUp301", JSON.stringify(game.canShowGenerator ?? false));
    localStorage.setItem("voidUnlock", JSON.stringify(voidUnlock ?? false));
    localStorage.setItem("achievements", JSON.stringify(
        achievements.map(a => ({ id: a.id, isUnlocked: a.isUnlocked }))
    ));
    localStorage.setItem("generatorUpgrades", JSON.stringify(
        generatorUpgrades.map(u => ({ id: u.id, currentAmount: u.currentAmount.toString() }))
    ));
    localStorage.setItem("degenerators", JSON.stringify(
        degenerators.map(d => ({
            id: d.id,
            amount: d.amount.toString(),
            boughtAmount: d.boughtAmount.toString(),
            multiplier: d.multiplier.toString(),
            start: d.start,
            interval: d.interval,
            amountUpgrade: { currentAmount: d.amountUpgrade.currentAmount.toString(), price: d.amountUpgrade.price.toString() },
            intervalUpgrade: { currentAmount: d.intervalUpgrade.currentAmount.toString(), price: d.intervalUpgrade.price.toString() },
            multiplierUpgrade: { currentAmount: d.multiplierUpgrade.currentAmount.toString(), price: d.multiplierUpgrade.price.toString() },
        }))
    ));
    localStorage.setItem("canShowDegenerators", JSON.stringify(game.canShowDegenerators));
    localStorage.setItem("currentTab", currentTab);

    localStorage.setItem("negationUpgrades", JSON.stringify({
        oneTimeUpgrades: aupgrades.oneTimeUpgrades.map(u => ({ id: u.id, isBought: u.isBought })),
        buyableUpgrades: aupgrades.buyableUpgrades.map(u => ({
            id: u.id, isBought: u.isBought, currentAmount: u.currentAmount.toString(), maxAmount: u.maxAmount
        })),
    }));
    localStorage.setItem("apUp1", JSON.stringify(apUp1 ?? false));
}
