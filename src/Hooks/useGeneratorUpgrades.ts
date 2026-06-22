import { useState } from "react";
import { freshGeneratorUpgrades } from "../data/generatorUpgrades";
import type { IBuyableUpgrade } from "../Models/IUpgrade";

export function useGeneratorUpgrades() {
    const [generatorUpgrades, setGeneratorUpgrades] = useState<IBuyableUpgrade[]>(
        () => freshGeneratorUpgrades()
    );

    function resetGeneratorUpgrades() {
        setGeneratorUpgrades(freshGeneratorUpgrades());
    }

    return { generatorUpgrades, setGeneratorUpgrades, resetGeneratorUpgrades };
}