import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    ppUp101
} from "../data/prestigeUpgrades.ts";
import Decimal from "break_eternity.js";

const defaultOneTime: IOneTimeUpgrade[] = [
];
const defaultBuyable: IBuyableUpgrade[] = [
    ppUp101
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
        } catch {}
        return defaultOneTime;
    });

    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("prestigeUpgrades") || "null");
            if (saved?.buyableUpgrades) {
                const map = new Map<number, { isBought: boolean; isMaxed: boolean; currentAmount: string }>(
                    saved.buyableUpgrades.map((u: { id: number; isBought: boolean; isMaxed: boolean; currentAmount: string }) => [u.id, u])
                );
                return defaultBuyable.map(u => {
                    const s = map.get(u.id);
                    return s !== undefined ? { ...u, isBought: s.isBought, isMaxed: s.isMaxed, currentAmount: new Decimal(s.currentAmount) } : u;
                });
            }
        } catch {}
        return defaultBuyable;
    });

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades }
}
