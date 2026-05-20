import {useState} from "react";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {
    pUp101,
    pUp102,
    pUp103,
    pUp104,
    pUp105,
    pUp106,
    pUp107,
    pUp108,
    pUp109,
    pUp110,
    pUp111,
    pUp112,
    pUp113,
    pUp114,
    pUp115,
    pUp116,
    pUp117,
    pUp118,
    pUp119,
    pUp201,
    pUp202,
    pUp203,
    pUp204,
    pUp205,
    pUp206,
    pUp207,
    pUp208,
    pUp209,
    pUp210,
    pUp211,
    pUp212,
    pUp213,
    pUp214,
    pUp215,
    pUp216,
    pUp217,
    pUp401,
    pUp402,
    pUp501,
    pUp502,
    pUp503,
    pUp504

} from "../data/pointUpgrades.ts";
import Decimal from "break_eternity.js";

const defaultOneTime: IOneTimeUpgrade[] = [
    pUp201, pUp202, pUp203, pUp204, pUp205, pUp206, pUp207, pUp208, pUp209, pUp210, pUp211, pUp212, pUp213, pUp214, pUp215, pUp216, pUp217
];
const defaultBuyable: IBuyableUpgrade[] = [
    pUp101, pUp102, pUp103, pUp104, pUp105, pUp106, pUp107, pUp108, pUp109, pUp110, pUp111, pUp112, pUp113, pUp114, pUp115, pUp116, pUp117, pUp118, pUp119, pUp401, pUp402, pUp501, pUp502, pUp503, pUp504
];

export function usePointUpgrades() {
    const [oneTimeUpgrades, setOneTimeUpgrades] = useState<IOneTimeUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("upgrades") || "null");
            if (saved?.oneTimeUpgrades) {
                const map = new Map<number, { isBought: boolean }>(
                    saved.oneTimeUpgrades.map((u: { id: number; isBought: boolean }) => [u.id, u])
                );
                return defaultOneTime.map(u => {
                    const s = map.get(u.id);
                    return s !== undefined ? { ...u, isBought: s.isBought } : u;
                });
            }
        } catch(e) {
            console.error(e);
        }
        return defaultOneTime;
    });

    const [buyableUpgrades, setBuyableUpgrades] = useState<IBuyableUpgrade[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("upgrades") || "null");
            if (saved?.buyableUpgrades) {
                const map = new Map<number, { price: string, isBought: boolean; isMaxed: boolean; currentAmount: string }>(
                    saved.buyableUpgrades.map((u: { id: number; price: string; isBought: boolean; isMaxed: boolean; currentAmount: string }) => [u.id, u])
                );
                return defaultBuyable.map(u => {
                    const s = map.get(u.id);
                    return s !== undefined ? { ...u, price: new Decimal(s.price), isBought: s.isBought, isMaxed: s.isMaxed, currentAmount: new Decimal(s.currentAmount) } : u;
                });
            }
        } catch {}
        return defaultBuyable;
    });

    function resetUpgrades() {
        setOneTimeUpgrades(defaultOneTime.map(u => ({ ...u })));
        setBuyableUpgrades(defaultBuyable.map(u => ({ ...u })));
    }

    return { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades, resetUpgrades }
}
