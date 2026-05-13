import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    ppUp101, ppUp102, ppUp103, ppUp104,
    ppUp201, ppUp202, ppUp203, ppUp204, ppUp205,
} from "../data/prestigeUpgrades.ts";

export function usePrestigeUpgrades() {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>([
        ppUp201, ppUp202, ppUp203, ppUp204, ppUp205,
    ])
    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>([
        ppUp101, ppUp102, ppUp103, ppUp104,
    ])

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
