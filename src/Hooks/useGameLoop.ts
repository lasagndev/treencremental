import { useEffect, useRef, useState } from "react";
import { Game } from "../Models/Game.ts";
import Decimal from "break_eternity.js";
import type {Statistics} from "../Models/Statistics.ts";
import {generatorUpgrades} from "../components/GeneratorTab.tsx";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {defaultPrestigeBuyable, defaultPrestigeOneTime} from "./usePrestigeUpgrades.ts";
import {defaultPointBuyable} from "./usePointUpgrades.ts";

function calcPrestigeExponentBonus(): Decimal {
    let bonus = new Decimal(1);
    try {
        const saved = JSON.parse(localStorage.getItem("prestigeUpgrades") || "null");
        if (saved?.buyableUpgrades) {
            const amountMap = new Map<number, Decimal>(
                (saved.buyableUpgrades as Array<{ id: number; currentAmount: string }>)
                    .map(u => [u.id, new Decimal(u.currentAmount)])
            );
            for (const def of defaultPrestigeBuyable) {
                if (def.exponentBonusPerLevel == null) continue;
                const amount = amountMap.get(def.id) ?? new Decimal(0);
                bonus = bonus.plus(new Decimal(def.exponentBonusPerLevel).times(amount));
            }
        }
        if (saved?.oneTimeUpgrades) {
            const boughtSet = new Set<number>(
                (saved.oneTimeUpgrades as Array<{ id: number; isBought: boolean }>)
                    .filter(u => u.isBought).map(u => u.id)
            );
            for (const def of defaultPrestigeOneTime) {
                if (def.exponentBonus == null) continue;
                if (boughtSet.has(def.id)) bonus = bonus.plus(def.exponentBonus);
            }
        }
    } catch(e) {console.log(e)}
    return bonus;
}

function loadSaved() {
    try {
        return JSON.parse(localStorage.getItem("game") || "null") as Record<string, string | boolean> | null;
    } catch {
        return null;
    }
}

export function useGameLoop(stats: Statistics, prestigeBuyableUpgrades: IBuyableUpgrade[], prestigeOneTimeUpgrades: IOneTimeUpgrade[]) {
    const [point, setPoint] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.point ? new Decimal(s.point as string) : new Decimal(10);
    });
    const [bonusPoints, setBonusPoints] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.globalPointAddition ? new Decimal(s.globalPointAddition as string) : new Decimal(0);
    });
    const [globalMultiplierMultiplier, setGlobalMultiplierMultiplier] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.globalMultiplierMultiplier ? new Decimal(s.globalMultiplierMultiplier as string) : new Decimal(1);
    });
    const [globalPointMultiplier, setGlobalPointMultiplier] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.globalPointMultiplier ? new Decimal(s.globalPointMultiplier as string) : new Decimal(1);
    });
    const [globalPointExponent, setGlobalPointExponent] = useState<Decimal>(() => {
        const s = loadSaved();
        const base = s?.globalPointExponent ? new Decimal(s.globalPointExponent as string) : new Decimal(1);
        // If old save has pointExponentFromPrestige, adjust globalPointExponent by the correction delta
        if (s?.pointExponentFromPrestige) {
            const oldPEFP = new Decimal(s.pointExponentFromPrestige as string);
            const newPEFP = calcPrestigeExponentBonus();
            return base.plus(newPEFP.minus(oldPEFP));
        }
        return base;
    });
    const [canShowPrestigeTree, setCanShowPrestigeTree] = useState<boolean>(() => {
        const s = loadSaved();
        return s !== null && "canShowPrestigeTree" in s ? (s.canShowPrestigeTree as boolean) : false;
    });
    const [prestigePoint, setPrestigePoint] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.prestigePoint ? new Decimal(s.prestigePoint as string) : new Decimal(0);
    });
    const [pointGainFromPrestige, setPointGainFromPrestige] = useState<Decimal>(() => {
        const s = loadSaved();
        let pgfp = s?.pointGainFromPrestige ? new Decimal(s.pointGainFromPrestige as string) : new Decimal(0);

        const up209bght = prestigeOneTimeUpgrades.find(u => u.id == 209)?.isBought
        const up204bght = prestigeOneTimeUpgrades.find(u => u.id == 204)?.isBought
        const up201bght = prestigeOneTimeUpgrades.find(u => u.id == 201)?.isBought

            // i do pieca
        if(!pgfp.eq(20250) && up209bght) pgfp = new Decimal(20250)
        else if(!pgfp.eq(250) && up204bght) pgfp = new Decimal(250)
        else if(!pgfp.eq(50) && up201bght) pgfp = new Decimal(50)
        else if(!pgfp.eq(0) && !up201bght) pgfp = new Decimal(0)

        return pgfp;
    })
    const [pointMultiFromPrestige, setPointMultiFromPrestige] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.pointMultiFromPrestige ? new Decimal(s.pointMultiFromPrestige as string) : new Decimal(1);
    })
    const [pointExponentFromPrestige, setPointExponentFromPrestige] = useState<Decimal>(() => {
        return calcPrestigeExponentBonus();
    })
    const [prestigePointMulti, setPrestigePointMulti] = useState<Decimal>(() => {
        try {
            let multi = new Decimal(1);
            const sources: Array<{ saveKey: string; defs: IBuyableUpgrade[] }> = [
                { saveKey: "prestigeUpgrades", defs: defaultPrestigeBuyable },
                { saveKey: "upgrades", defs: defaultPointBuyable },
            ];
            for (const { saveKey, defs } of sources) {
                const saved = JSON.parse(localStorage.getItem(saveKey) || "null");
                if (!saved?.buyableUpgrades) continue;
                const amountMap = new Map<number, Decimal>(
                    (saved.buyableUpgrades as Array<{ id: number; currentAmount: string }>)
                        .map(u => [u.id, new Decimal(u.currentAmount)])
                );
                for (const def of defs) {
                    if (def.prestigeMultiPerLevel == null) continue;
                    const amount = amountMap.get(def.id) ?? new Decimal(0);
                    if (amount.gt(0)) multi = multi.times(new Decimal(def.prestigeMultiPerLevel).pow(amount));
                }
            }
            return multi;
        } catch(e) {console.log(e)}
        return new Decimal(1);
    })
    const [dynamicUpgradeValues, setDynamicUpgradeValues] = useState<Record<number, Decimal>>({});
    const [automationInterval, setAutomationInterval] = useState<number>(() => {
        const s = loadSaved()
        return s?.automationInterval ? (s.automationInterval as string) as unknown as number: 1000;
    });

    const [canShowGenerator, setCanShowGenerator] = useState<boolean>(() => {
        try { return JSON.parse(localStorage.getItem("ppUp301") ?? "false"); } catch { return false; }
    });

    const [generatorDuration, setGeneratorDuration] = useState<number>(() => {
        const s = loadSaved();
        return s?.generatorDuration ? Number(s.generatorDuration as string) : 30000;
    });

    const [peMulti, setPeMulti] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.peMulti ? new Decimal(s.peMulti as string) : new Decimal(1);
    });

    const [peBoostToP, setPeBoostToP] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.peBoostToP ? new Decimal(s.peBoostToP as string) : new Decimal(1);
    });

    const [peBoostToPP, setPeBoostToPP] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.peBoostToPP ? new Decimal(s.peBoostToPP as string) : new Decimal(1);
    });

    const [prestigeEnergy, setPrestigeEnergy] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.prestigeEnergy ? new Decimal(s.prestigeEnergy as string) : new Decimal(1);
    })

    const [pointUpgradesBonusMaxAmount, setPointUpgradesBonusMaxAmount] = useState<number>(() => {
        const s = loadSaved();

        let bonusMaxAmount = 0;
        const ppUp207 = prestigeOneTimeUpgrades.find(u => u.id == 207)
        const ppUp208 = prestigeOneTimeUpgrades.find(u => u.id == 208)
        if(ppUp207?.isBought) bonusMaxAmount += 1
        if(ppUp208?.isBought) bonusMaxAmount += 2

        return s?.pointUpgradesBonusMaxAmount ? Number(s.pointUpgradesBonusMaxAmount as string) : bonusMaxAmount;
    })

    const game = new Game(
        point, setPoint,
        bonusPoints, setBonusPoints,
        globalPointMultiplier, setGlobalPointMultiplier,
        globalPointExponent, setGlobalPointExponent,
        globalMultiplierMultiplier, setGlobalMultiplierMultiplier,
        canShowPrestigeTree, setCanShowPrestigeTree,
        prestigePoint, setPrestigePoint,
        pointGainFromPrestige, setPointGainFromPrestige,
        pointMultiFromPrestige, setPointMultiFromPrestige,
        pointExponentFromPrestige, setPointExponentFromPrestige,
        prestigePointMulti, setPrestigePointMulti,
        dynamicUpgradeValues, setDynamicUpgradeValues,
        automationInterval, setAutomationInterval,
        canShowGenerator, setCanShowGenerator,
        prestigeEnergy, setPrestigeEnergy,
        generatorDuration, setGeneratorDuration,
        peMulti, setPeMulti,
        peBoostToP, setPeBoostToP,
        peBoostToPP, setPeBoostToPP,
        pointUpgradesBonusMaxAmount, setPointUpgradesBonusMaxAmount,
    );

    const globalPointAdditionRef = useRef(bonusPoints);
    const globalPointMultiplierRef = useRef(globalPointMultiplier);
    const globalPointExponentRef = useRef(globalPointExponent);
    const globalMultiplierMultiplierRef = useRef(globalMultiplierMultiplier);
    const pointRef = useRef(point);
    const prestigePointRef = useRef(prestigePoint);
    const prestigeUpgradesRef = useRef(prestigeBuyableUpgrades);
    const generatorDurationRef = useRef(generatorDuration);
    const peMultiRef = useRef(peMulti);
    const canShowGeneratorRef = useRef(canShowGenerator);
    const prestigeEnergyRef = useRef(prestigeEnergy);
    const peBoostToPRef = useRef(peBoostToP);
    // eslint-disable-next-line react-hooks/purity
    const lastTickTimeRef = useRef(Date.now());

    useEffect(() => {
        globalPointAdditionRef.current = bonusPoints;
        globalPointMultiplierRef.current = globalPointMultiplier;
        globalPointExponentRef.current = globalPointExponent;
        globalMultiplierMultiplierRef.current = globalMultiplierMultiplier;
        pointRef.current = point;
        prestigePointRef.current = prestigePoint;
        prestigeUpgradesRef.current = prestigeBuyableUpgrades;
        generatorDurationRef.current = generatorDuration;
        peMultiRef.current = peMulti;
        canShowGeneratorRef.current = canShowGenerator;
        prestigeEnergyRef.current = prestigeEnergy;
        peBoostToPRef.current = peBoostToP;
    }, [bonusPoints, globalPointMultiplier, globalPointExponent, globalMultiplierMultiplier, point, prestigeBuyableUpgrades, generatorDuration, peMulti, canShowGenerator, prestigeEnergy, peBoostToP, prestigePoint]);

    useEffect(() => {
        const skibidi = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastTickTimeRef.current;
            lastTickTimeRef.current = now;
            const tickMultiplier = elapsed / 40;

            // compute tickEffects for all prestige buyable upgrades
            let dynamicPointMulti = new Decimal(1);
            let dynamicPEMulti = new Decimal(1);
            const newDynamicValues: Record<number, Decimal> = {};
            for (const u of prestigeUpgradesRef.current) {
                if (u.tickEffect && u.currentAmount.gt(0)) {
                    const result = u.tickEffect(u.currentAmount, {
                        prestigePoint: prestigePointRef.current,
                        point: pointRef.current,
                        prestigeEnergy: prestigeEnergyRef.current,
                    });
                    if (result.pointMulti) {
                        newDynamicValues[u.id] = result.pointMulti;
                        dynamicPointMulti = dynamicPointMulti.times(result.pointMulti);
                    } else if(result.ppGain) {
                        newDynamicValues[u.id] = result.ppGain;
                    } else if(result.peGain) {
                        newDynamicValues[u.id] = result.peGain;
                        dynamicPEMulti = dynamicPEMulti.times(result.peGain);
                    }
                }
            }
            setDynamicUpgradeValues(newDynamicValues);

            // peboostfacator
            let peBoostFactor = prestigeEnergyRef.current.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(6));
            if (peBoostFactor.gte(new Decimal(1e10))) peBoostFactor = new Decimal(7e8).times(prestigeEnergyRef.current.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(50)));

            // dodawanie punktów do punktów i do statystyk (główny game tick)
            const pointsPerTick = globalPointAdditionRef.current.times(globalPointMultiplierRef.current).times(dynamicPointMulti).times(peBoostFactor).pow(globalPointExponentRef.current).dividedBy(25);
            setPoint(prev => prev.plus(pointsPerTick.times(tickMultiplier)));
            stats.setAllPoints(prev => prev.plus(pointsPerTick.times(tickMultiplier)));

            // generator działanie
            const clampedDuration = Math.max(generatorDurationRef.current, 40);
            if (canShowGeneratorRef.current && clampedDuration <= 500) {
                setPrestigeEnergy(prev => prev.plus(peMultiRef.current.times(new Decimal(40).dividedBy(clampedDuration)).times(tickMultiplier).times(dynamicPEMulti)));
                stats.setTotalGeneratorLoops(n => n+1)
                stats.setTotalPrestigeEnergy(prev => prev.plus(peMultiRef.current.times(new Decimal(40).dividedBy(clampedDuration)).times(tickMultiplier)));
            }
        }, 40);
        return () => clearInterval(skibidi);
    }, []);

    return game;
}
