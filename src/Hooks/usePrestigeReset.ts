import { useRef } from "react";
import Decimal from "break_eternity.js";
import type { Game } from "../Models/Game.ts";
import type { Statistics } from "../Models/Statistics.ts";
import type { usePointUpgrades } from "./usePointUpgrades.ts";
import type { useGeneratorUpgrades } from "./useGeneratorUpgrades.ts";

export function usePrestigeReset(
    game: Game,
    stats: Statistics,
    pointUpgrades: ReturnType<typeof usePointUpgrades>,
    generatorUpgrades: ReturnType<typeof useGeneratorUpgrades>,
) {
    const gameRef = useRef(game);
    const statsRef = useRef(stats);
    const pointUpgradesRef = useRef(pointUpgrades);
    const generatorUpgradesRef = useRef(generatorUpgrades);

    // eslint-disable-next-line react-hooks/refs
    gameRef.current = game;
    // eslint-disable-next-line react-hooks/refs
    statsRef.current = stats;
    // eslint-disable-next-line react-hooks/refs
    pointUpgradesRef.current = pointUpgrades;
    // eslint-disable-next-line react-hooks/refs
    generatorUpgradesRef.current = generatorUpgrades;

    function calcPrestigePointGain(): Decimal {
        const g = gameRef.current;
        const genUpgrades = generatorUpgradesRef.current;

        let peBoostToPP = g.prestigeEnergy
            .pow(0.1)
            .pow(genUpgrades.generatorUpgrades[3].currentAmount.plus(4).div(6));

        if (peBoostToPP.gte(new Decimal(1e4))) {
            peBoostToPP = new Decimal(3.34e3).times(
                g.prestigeEnergy
                    .pow(0.1)
                    .pow(genUpgrades.generatorUpgrades[3].currentAmount.plus(4).div(50))
            );
        }

        const dynamicPPGain = g.dynamicUpgradeValues[106] ?? new Decimal(1);

        return g.point
            .log10()
            .dividedBy(15)
            .pow(7)
            .times(g.prestigePointMulti)
            .times(peBoostToPP)
            .times(dynamicPPGain)
            .floor();
    }

    function handlePrestige() {
        const g = gameRef.current;
        const stats = statsRef.current;
        const { resetUpgrades } = pointUpgradesRef.current;

        const gain = calcPrestigePointGain();

        g.setPrestigePoint(n => n.plus(gain));
        stats.setAllPrestigePoints(n => n.plus(gain));

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        g.setPoint(_ => new Decimal(10));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        g.setGlobalPointAddition(_ => new Decimal(1).plus(g.pointGainFromPrestige));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        g.setGlobalPointMultiplier(_ => new Decimal(1).times(g.pointMultiFromPrestige));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        g.setGlobalPointExponent(_ => new Decimal(1).times(g.pointExponentFromPrestige));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        g.setGlobalMultiplierMultiplier(_ => new Decimal(1).times(g.pointMultiFromPrestige));

        resetUpgrades();
        stats.setTotalPrestiges(n => n.plus(1));
        g.setCanShowPrestigeTree(true);
    }

    return { calcPrestigePointGain, handlePrestige  };
}