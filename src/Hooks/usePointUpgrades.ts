import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    pUp101, pUp102, pUp103, pUp104, pUp105, pUp106, pUp107, pUp108, pUp109, pUp110, pUp111, pUp112, pUp113, pUp114,
    pUp201, pUp202, pUp203, pUp204, pUp205, pUp206, pUp207, pUp208, pUp209, pUp210, pUp211, pUp212, pUp213, pUp214, pUp215,
    pUp401, pUp402,
    pUp501, pUp502, pUp503, pUp504
} from "../data/pointUpgrades.ts";

export function usePointUpgrades() {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>([
        pUp201, pUp202, pUp203, pUp204, pUp205, pUp206, pUp207, pUp208, pUp209, pUp210, pUp211, pUp212, pUp213, pUp214, pUp215
    ])
    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>([
        pUp101, pUp102, pUp103, pUp104, pUp105, pUp106, pUp107, pUp108, pUp109, pUp110, pUp111, pUp112, pUp113, pUp114,
        pUp401, pUp402,
        pUp501, pUp502, pUp503, pUp504
    ])
    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
