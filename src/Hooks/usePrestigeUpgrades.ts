import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    ppUp101, ppUp103, ppUp201, ppUp102,
    ppUpAuto1to5, ppUpAuto6to10, ppUpAuto11to15, ppUpAuto16to20,
    ppUp501, ppUp504, ppUp503, ppUp502, ppUp505, ppUp105, ppUp104, ppUp202, ppUp203, ppUpAuto21to25, ppUp204, ppUp205,ppUp206
} from "../data/prestigeUpgrades.ts";
import Decimal from "break_eternity.js";


const defaultOneTime: IOneTimeUpgrade[] = [
    ppUp201, ppUp202, ppUp203, ppUp204, ppUp205, ppUp206,
    ppUpAuto1to5, ppUpAuto6to10, ppUpAuto11to15, ppUpAuto16to20, ppUpAuto21to25
];
const defaultBuyable: IBuyableUpgrade[] = [
    ppUp101, ppUp102, ppUp103, ppUp104, ppUp105,
    ppUp501, ppUp502, ppUp503, ppUp504, ppUp505
];

export function usePrestigeUpgrades() {


    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("prestigeUpgrades") || "null");
            if (saved?.oneTimeUpgrades) {
                const map = new Map<number, { isBought: boolean }>(
                    saved.oneTimeUpgrades.map((u: { id: number; isBought: boolean }) => [u.id, u])
                );
                return defaultOneTime.map(u => {
                    const s = map.get(u.id);
                    return s !== undefined ? { ...u, isBought: s.isBought } : u;
                });
            }
        } catch(e) {console.log(e)}
        return defaultOneTime;
    });

    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("prestigeUpgrades") || "null");
            if (saved?.buyableUpgrades) {
                const map = new Map<number, {price: string, isBought: boolean; currentAmount: string }>(
                    saved.buyableUpgrades.map((u: { id: number; price: string; isBought: boolean;  currentAmount: string }) => [u.id, u])
                );
                return defaultBuyable.map(u => {
                    const s = map.get(u.id);
                    const currentAmount = s !== undefined ? new Decimal(s.currentAmount) : u.currentAmount;
                    return s !== undefined ? { ...u, price: new Decimal(s.price), isBought: s.isBought, currentAmount, isMaxed: currentAmount.gte(u.maxAmount) } : u;
                });
            }
        } catch(e) {console.log(e)}
        return defaultBuyable;
    });

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
