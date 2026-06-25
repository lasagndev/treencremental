import { useRef } from "react";
import type { RefObject } from "react";
import Decimal from "break_eternity.js";
import type { Game } from "../Models/Game.ts";
import type { Statistics } from "../Models/Statistics.ts";
import type { usePointUpgrades } from "./usePointUpgrades.ts";
import { defaultPointBuyable } from "./usePointUpgrades.ts";
import type { usePrestigeUpgrades } from "./usePrestigeUpgrades.ts";
import type { useGeneratorUpgrades } from "./useGeneratorUpgrades.ts";
import { ppUp1, ppUp301, voidUnlock } from "../data/prestigeUpgrades.ts";
import { prestigeUnlock } from "../data/pointUpgrades.ts";


export function useVoidReset(
    game: Game,
    stats: Statistics,
    pointUpgrades: ReturnType<typeof usePointUpgrades>,
    prestigeUpgrades: ReturnType<typeof usePrestigeUpgrades>,
    generatorUpgrades: ReturnType<typeof useGeneratorUpgrades>,
    handlePrestigeRef: RefObject<() => void>,
) {
    const gameRef = useRef(game);
    const statsRef = useRef(stats);
    const pointUpgradesRef = useRef(pointUpgrades);
    const prestigeUpgradesRef = useRef(prestigeUpgrades);
    const generatorUpgradesRef = useRef(generatorUpgrades);

    // eslint-disable-next-line react-hooks/refs
    gameRef.current = game;
    // eslint-disable-next-line react-hooks/refs
    statsRef.current = stats;
    // eslint-disable-next-line react-hooks/refs
    pointUpgradesRef.current = pointUpgrades;
    // eslint-disable-next-line react-hooks/refs
    prestigeUpgradesRef.current = prestigeUpgrades;
    // eslint-disable-next-line react-hooks/refs
    generatorUpgradesRef.current = generatorUpgrades;

    function handleVoid() {
        const game = gameRef.current;
        const stats = statsRef.current;
        const pointUpgrades = pointUpgradesRef.current;
        const prestigeUpgrades = prestigeUpgradesRef.current;
        const generatorUpgrades = generatorUpgradesRef.current;

        voidUnlock.isBought = true;
        ppUp1.isBought = false;
        prestigeUnlock.isBought = true;
        ppUp301.isBought = false;
        handlePrestigeRef.current();
        stats.setTotalPrestiges(prev => prev.minus(1));
        pointUpgrades.setBuyableUpgrades(prev =>
            prev.map(u => u.id == 1 ? u : { ...defaultPointBuyable.find(d => d.id === u.id)! })
        );

        game.setGlobalPointMultiplier(new Decimal(1));
        game.setGlobalMultiplierMultiplier(new Decimal(1));
        game.setPrestigePoint(new Decimal(0));
        game.setPointGainFromPrestige(new Decimal(0));
        game.setPointMultiFromPrestige(new Decimal(1));
        game.setPointExponentFromPrestige(new Decimal(1));
        game.setGlobalPointExponent(new Decimal(1));
        game.setPrestigeEnergy(new Decimal(1));
        game.setCanShowGenerator(false);
        game.setAutomationInterval(1000);
        game.setPrestigePointMulti(new Decimal(1));
        game.setGeneratorDuration(30000);
        game.setPeMulti(new Decimal(1));
        game.setPeBoostToP(new Decimal(1));
        game.setPeBoostToPP(new Decimal(1));
        game.setPointUpgradesBonusMaxAmount(0);
        generatorUpgrades.resetGeneratorUpgrades();
        prestigeUpgrades.resetUpgrades();

        game.setCanShowVoidTree(true);
    }

    function handleVoidPoints(voidPointFormula: Decimal) {
        handleVoid();
        gameRef.current.setVoidPoint(prev => prev.plus(voidPointFormula));
    }

    function buyVoidUnlock(voidPointFormula: Decimal, setCurrentTab: (tab: string) => void) {
        handleVoid();
        gameRef.current.setVoidPoint(prev => prev.plus(voidPointFormula));
        gameRef.current.setIsNegated(true);
        setCurrentTab("NegationTree");
    }

    return { handleVoid, handleVoidPoints, buyVoidUnlock };
}