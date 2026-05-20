import { useEffect, useRef, useState } from "react";
import { Game } from "../Models/Game.ts";
import Decimal from "break_eternity.js";
import type {Statistics} from "../Models/Statistics.ts";

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
        return s !== null && "canShowPrestigeTree" in s ? (s.canShowPrestigeTree as boolean) : false;
    });
    const [prestigePoint, setPrestigePoint] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.prestigePoint ? new Decimal(s.prestigePoint as string) : new Decimal(0);
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
        return s?.prestigePointMulti ? new Decimal(s.pointMultiFromPrestige as string) : new Decimal(1);
    })
    const [pp102DynamicMulti, setPp102DynamicMulti] = useState<Decimal>(new Decimal(1));
    const [automationInterval, setAutomationInterval] = useState<number>(() => {
        const s = loadSaved()
        return s?.automationInterval ? (s.automationInterval as string) as unknown as number: 1000;
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
        automationInterval, setAutomationInterval
    );

    const globalPointAdditionRef = useRef(bonusPoints);
    const globalPointMultiplierRef = useRef(globalPointMultiplier);
    const globalPointExponentRef = useRef(globalPointExponent);
    const globalMultiplierMultiplierRef = useRef(globalMultiplierMultiplier);
    const pp102DynamicMultiRef = useRef(pp102DynamicMulti);
    const pointRef = useRef(point);
    const prestigePointRef = useRef(prestigePoint);
    const pp102AmountRef = useRef(pp102Amount);

    useEffect(() => {
        globalPointAdditionRef.current = bonusPoints;
        globalPointMultiplierRef.current = globalPointMultiplier;
        globalPointExponentRef.current = globalPointExponent;
        globalMultiplierMultiplierRef.current = globalMultiplierMultiplier;
        pp102DynamicMultiRef.current = pp102DynamicMulti;
        pointRef.current = point;
        prestigePointRef.current = prestigePoint;
        pp102AmountRef.current = pp102Amount;
    }, [bonusPoints, globalPointMultiplier, globalPointExponent, globalMultiplierMultiplier, pp102DynamicMulti, point, pp102Amount]);

    useEffect(() => {
        const skibidi = setInterval(() => {
            let newMulti = new Decimal(2).plus(prestigePointRef.current.log2().pow((pp102AmountRef.current).pow(0.8)));
            if(pp102AmountRef.current.lte(new Decimal(0)) || newMulti.lte(new Decimal(1))) newMulti = new Decimal(1)
            setPp102DynamicMulti(newMulti);
            pp102DynamicMultiRef.current = newMulti;
            setPoint(prev => prev.plus(globalPointAdditionRef.current.times(globalPointMultiplierRef.current).times(pp102DynamicMultiRef.current).pow(globalPointExponentRef.current).dividedBy(25)));
            stats.setAllPoints(prev => prev.plus(globalPointAdditionRef.current.times(globalPointMultiplierRef.current).times(pp102DynamicMultiRef.current).pow(globalPointExponentRef.current).dividedBy(25)))
        }, 40);
        return () => clearInterval(skibidi);
    }, []);

    useEffect(() => {
        let hiddenAt: number | null = null;

        function handleVisibilityChange() {
            if (document.hidden) {
                hiddenAt = Date.now();
            } else if (hiddenAt !== null) {
                const elapsed = Date.now() - hiddenAt;
                const missedTicks = elapsed / 40;
                const pointsPerTick = globalPointAdditionRef.current
                    .times(globalPointMultiplierRef.current)
                    .pow(globalPointExponentRef.current)
                    .dividedBy(25);
                setPoint(prev => prev.plus(pointsPerTick.times(missedTicks)));
                hiddenAt = null;
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    return game;
}
