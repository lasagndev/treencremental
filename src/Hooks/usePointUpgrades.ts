import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {pUp101, pUp102, pUp201, pUp202} from "../data/pointUpgrades.ts";

export function usePointUpgrades() {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>([pUp201, pUp202])
    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>([pUp101, pUp102])
    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
