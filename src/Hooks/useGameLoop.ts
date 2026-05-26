import { useEffect, useRef, useState } from "react";
import { Game } from "../Models/Game.ts";
import Decimal from "break_eternity.js";
import type {Statistics} from "../Models/Statistics.ts";
import {generatorUpgrades} from "../components/GeneratorTab.tsx";

function loadSaved() {
    try {
        return JSON.parse(localStorage.getItem("game") || "null") as Record<string, string | boolean> | null;
    } catch {
        return null;
    }
}

export function useGameLoop(stats: Statistics, pp102Amount: Decimal) {
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
        return s?.globalPointExponent ? new Decimal(s.globalPointExponent as string) : new Decimal(1);
    });
    const [canShowPrestigeTree, setCanShowPrestigeTree] = useState<boolean>(() => {
        const s = loadSaved();
        return s !== null && "canShowPrestigeTree" in s ? (s.canShowPrestigeTree as boolean) : true;
    });
    const [prestigePoint, setPrestigePoint] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.prestigePoint ? new Decimal(s.prestigePoint as string) : new Decimal(3);
    });
    const [pointGainFromPrestige, setPointGainFromPrestige] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.pointMultiFromPrestige ? new Decimal(s.pointMultiFromPrestige as string) : new Decimal(0);
    })
    const [pointMultiFromPrestige, setPointMultiFromPrestige] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.pointMultiFromPrestige ? new Decimal(s.pointMultiFromPrestige as string) : new Decimal(1);
    })
    const [pointExponentFromPrestige, setPointExponentFromPrestige] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.pointExponentFromPrestige ? new Decimal(s.pointExponentFromPrestige as string) : new Decimal(1);
    })
    const [prestigePointMulti, setPrestigePointMulti] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.prestigePointMulti ? new Decimal(s.prestigePointMulti as string) : new Decimal(1);
    })
    const [pp102DynamicMulti, setPp102DynamicMulti] = useState<Decimal>(new Decimal(1));
    const [automationInterval, setAutomationInterval] = useState<number>(() => {
        const s = loadSaved()
        return s?.automationInterval ? (s.automationInterval as string) as unknown as number: 100;
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
        pp102DynamicMulti, setPp102DynamicMulti,
        automationInterval, setAutomationInterval,
        canShowGenerator, setCanShowGenerator,
        prestigeEnergy, setPrestigeEnergy,
        generatorDuration, setGeneratorDuration,
        peMulti, setPeMulti,
        peBoostToP, setPeBoostToP,
        peBoostToPP, setPeBoostToPP,
    );

    const globalPointAdditionRef = useRef(bonusPoints);
    const globalPointMultiplierRef = useRef(globalPointMultiplier);
    const globalPointExponentRef = useRef(globalPointExponent);
    const globalMultiplierMultiplierRef = useRef(globalMultiplierMultiplier);
    const pp102DynamicMultiRef = useRef(pp102DynamicMulti);
    const pointRef = useRef(point);
    const prestigePointRef = useRef(prestigePoint);
    const pp102AmountRef = useRef(pp102Amount);
    const generatorDurationRef = useRef(generatorDuration);
    const peMultiRef = useRef(peMulti);
    const canShowGeneratorRef = useRef(canShowGenerator);
    const prestigeEnergyRef = useRef(prestigeEnergy);
    const peBoostToPRef = useRef(peBoostToP);
    const lastTickTimeRef = useRef(Date.now());

    useEffect(() => {
        globalPointAdditionRef.current = bonusPoints;
        globalPointMultiplierRef.current = globalPointMultiplier;
        globalPointExponentRef.current = globalPointExponent;
        globalMultiplierMultiplierRef.current = globalMultiplierMultiplier;
        pp102DynamicMultiRef.current = pp102DynamicMulti;
        pointRef.current = point;
        prestigePointRef.current = prestigePoint;
        pp102AmountRef.current = pp102Amount;
        generatorDurationRef.current = generatorDuration;
        peMultiRef.current = peMulti;
        canShowGeneratorRef.current = canShowGenerator;
        prestigeEnergyRef.current = prestigeEnergy;
        peBoostToPRef.current = peBoostToP;
    }, [bonusPoints, globalPointMultiplier, globalPointExponent, globalMultiplierMultiplier, pp102DynamicMulti, point, pp102Amount, generatorDuration, peMulti, canShowGenerator, prestigeEnergy, peBoostToP]);

    useEffect(() => {
        const skibidi = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastTickTimeRef.current;
            lastTickTimeRef.current = now;
            const tickMultiplier = elapsed / 40;

            let newMulti = new Decimal(2).plus(prestigePointRef.current.log2().pow((pp102AmountRef.current).pow(0.8)));
            if(pp102AmountRef.current.lte(new Decimal(0)) || newMulti.lte(new Decimal(1))) newMulti = new Decimal(1)
            setPp102DynamicMulti(newMulti);
            pp102DynamicMultiRef.current = newMulti;
            let peBoostFactor = prestigeEnergyRef.current.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(6));
            if (peBoostFactor.gte(new Decimal(1e10))) peBoostFactor = new Decimal(1e10);
            const pointsPerTick = globalPointAdditionRef.current.times(globalPointMultiplierRef.current).times(pp102DynamicMultiRef.current).times(peBoostFactor).pow(globalPointExponentRef.current).dividedBy(25);
            setPoint(prev => prev.plus(pointsPerTick.times(tickMultiplier)));
            stats.setAllPoints(prev => prev.plus(pointsPerTick.times(tickMultiplier)));
            const clampedDuration = Math.max(generatorDurationRef.current, 40);
            if (canShowGeneratorRef.current && clampedDuration <= 500) {
                setPrestigeEnergy(prev => prev.plus(peMultiRef.current.times(new Decimal(40).dividedBy(clampedDuration)).times(tickMultiplier)));
            }
        }, 40);
        return () => clearInterval(skibidi);
    }, []);

    return game;
}
