import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    ppUp101,
    ppUp103,
    ppUp201,
    ppUp102,
    ppUpAuto1to5,
    ppUpAuto6to10,
    ppUpAuto11to15,
    ppUpAuto16to20,
    ppUp105,
    ppUp104,
    ppUp202,
    ppUp203,
    ppUpAuto21to25,
    ppUp204,
    ppUp205,
    ppUp206,
    ppUp207, ppUp208, ppUp209, ppUp106, ppUp107, ppUp210, ppUp108, ppUp109, ppUp110
} from "../data/prestigeUpgrades.ts";
import Decimal from "break_eternity.js";


export const defaultPrestigeOneTime: IOneTimeUpgrade[] = [
    ppUp201, ppUp202, ppUp203, ppUp204, ppUp205, ppUp206, ppUp207, ppUp208, ppUp209, ppUp210,
    ppUpAuto1to5, ppUpAuto6to10, ppUpAuto11to15, ppUpAuto16to20, ppUpAuto21to25
];
export const defaultPrestigeBuyable: IBuyableUpgrade[] = [
    ppUp101, ppUp102, ppUp103, ppUp104, ppUp105, ppUp106, ppUp107, ppUp108, ppUp109, ppUp110,
];

export function usePrestigeUpgrades() {


    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("prestigeUpgrades") || "null");
            if (saved?.oneTimeUpgrades) {
                const map = new Map<number, { isBought: boolean }>(
                    saved.oneTimeUpgrades.map((u: { id: number; isBought: boolean }) => [u.id, u])
                );
                return defaultPrestigeOneTime.map(u => {
                    const s = map.get(u.id);
                    return s !== undefined ? { ...u, isBought: s.isBought } : u;
                });
            }
        } catch(e) {console.log(e)}
        return defaultPrestigeOneTime;
    });

    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("prestigeUpgrades") || "null");
            if (saved?.buyableUpgrades) {
                const map = new Map<number, { isBought: boolean; currentAmount: string }>(
                    saved.buyableUpgrades.map((u: { id: number; isBought: boolean; currentAmount: string }) => [u.id, u])
                );
                return defaultPrestigeBuyable.map(u => {
                    const s = map.get(u.id);
                    const currentAmount = s !== undefined ? new Decimal(s.currentAmount) : u.currentAmount;
                    const price = u.calcPrice
                        ? u.calcPrice({ ...u, currentAmount })
                        : u.price.times(u.priceMultiplier.pow(currentAmount));
                    return s !== undefined ? { ...u, price, isBought: s.isBought, currentAmount, isMaxed: currentAmount.gte(u.maxAmount) } : u;
                });
            }
        } catch(e) {console.log(e)}
        return defaultPrestigeBuyable;
    });

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
