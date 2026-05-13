import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    ppUp101
} from "../data/prestigeUpgrades.ts";

export function usePrestigeUpgrades() {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>([

    ])
    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>([
        ppUp101
    ])

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
