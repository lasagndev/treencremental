import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    // buyable:
    apUp101,
    // one-time:
    apUp201,
    // siury:

} from "../data/negationUpgrades.ts";
import Decimal from "break_eternity.js";
import type {Game} from "../Models/Game.ts";

const defaultNegationOneTime: IOneTimeUpgrade[] = [
    apUp201,
];
export const defaultNegationBuyable: IBuyableUpgrade[] = [
    apUp101,
];

export function useNegationUpgrades(game: Game) {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("negationUpgrades") || "null");
            if (saved?.oneTimeUpgrades) {
                const map = new Map<number, { isBought: boolean }>(
                    saved.oneTimeUpgrades.map((u: { id: number; isBought: boolean }) => [u.id, u])
                );
                return defaultNegationOneTime.map(u => {
                    const s = map.get(u.id);
                    return s !== undefined ? { ...u, isBought: s.isBought } : u;
                });
            }
        } catch(e) {
            console.error(e);
        }
        return defaultNegationOneTime;
    });

    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("negationUpgrades") || "null");
            if (saved?.buyableUpgrades) {
                const map = new Map<number, { isBought: boolean; currentAmount: string; maxAmount?: number }>(
                    saved.buyableUpgrades.map((u: { id: number; isBought: boolean; currentAmount: string; maxAmount?: number }) => [u.id, u])
                );
                return defaultNegationBuyable.map(u => {
                    const s = map.get(u.id);
                    const currentAmount = s !== undefined ? new Decimal(s.currentAmount) : u.currentAmount;
                    const maxAmount = s?.maxAmount ?? u.maxAmount + game.pointUpgradesBonusMaxAmount ;
                    const price = u.calcPrice
                        ? u.calcPrice({ ...u, currentAmount })
                        : u.price.times(u.priceMultiplier.pow(currentAmount));
                    return s !== undefined ? { ...u, price, isBought: s.isBought, currentAmount, maxAmount, isMaxed: currentAmount.gte(maxAmount) } : u;
                });
            }
        } catch(e) {console.log(e)}
        return defaultNegationBuyable;
    });

    function resetUpgrades() {
        setOneTimeUpgrades(prev =>
            prev.map(u => u.id >= 3001 ? u : { ...defaultNegationOneTime.find(d => d.id === u.id)! })
        );
        setBuyableUpgrades(prev =>
            prev.map(u => {
                if (u.id >= 3001) return u;

                const defaultUpgrade = defaultNegationBuyable.find(d => d.id === u.id)!;
                return {
                    ...defaultUpgrade,
                    maxAmount: defaultUpgrade.maxAmount + game.pointUpgradesBonusMaxAmount
                };
            })
        );
    }

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades, resetUpgrades }
}
