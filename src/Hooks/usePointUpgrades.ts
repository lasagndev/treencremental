import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    pUp101,
    pUp102,
    pUp103,
    pUp104,
    pUp105,
    pUp201,
    pUp202,
    pUp203,
    pUp204,
    pUp401,
    pUp402
} from "../data/pointUpgrades.ts";

export function usePointUpgrades() {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>([pUp201, pUp202, pUp203, pUp204])
    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>([pUp101, pUp102, pUp103, pUp104, pUp105, pUp401, pUp402])
    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
