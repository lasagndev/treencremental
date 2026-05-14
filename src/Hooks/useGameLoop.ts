import { useEffect, useRef, useState } from "react";
import { Game } from "../Models/Game.ts";
import Decimal from "break_eternity.js";

function loadSaved() {
    try {
        return JSON.parse(localStorage.getItem("game") || "null") as Record<string, string | boolean> | null;
    } catch {
        return null;
    }
}

export function useGameLoop() {
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
        return s?.prestigePoint ? new Decimal(s.prestigePoint as string) : new Decimal(10);
    });

    const game = new Game(
        point, setPoint,
        bonusPoints, setBonusPoints,
        globalPointMultiplier, setGlobalPointMultiplier,
        globalPointExponent, setGlobalPointExponent,
        globalMultiplierMultiplier, setGlobalMultiplierMultiplier,
        canShowPrestigeTree, setCanShowPrestigeTree,
        prestigePoint, setPrestigePoint,
    );

    const globalPointAdditionRef = useRef(bonusPoints);
    const globalPointMultiplierRef = useRef(globalPointMultiplier);
    const globalPointExponentRef = useRef(globalPointExponent);
    const globalMultiplierMultiplierRef = useRef(globalMultiplierMultiplier);

    useEffect(() => {
        globalPointAdditionRef.current = bonusPoints;
        globalPointMultiplierRef.current = globalPointMultiplier;
        globalPointExponentRef.current = globalPointExponent;
        globalMultiplierMultiplierRef.current = globalMultiplierMultiplier;
    }, [bonusPoints, globalPointMultiplier, globalPointExponent, globalMultiplierMultiplier]);

    useEffect(() => {
        const skibidi = setInterval(() => {
            setPoint(prev => prev.plus(globalPointAdditionRef.current.times(globalPointMultiplierRef.current).pow(globalPointExponentRef.current).dividedBy(25)));
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
