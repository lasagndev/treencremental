import { useState } from "react";
import Decimal from "break_eternity.js";
import { freshDegenerators } from "../data/Degenerators.ts";
import type { IDegenerator } from "../Models/IDegenerator.ts";

interface ISavedDegeneratorUpgrade {
    currentAmount: string;
    price: string;
}

interface ISavedDegenerator {
    id: number;
    amount: string;
    boughtAmount?: string;
    multiplier: string;
    start: number;
    interval: number;
    amountUpgrade: ISavedDegeneratorUpgrade;
    intervalUpgrade: ISavedDegeneratorUpgrade;
    multiplierUpgrade: ISavedDegeneratorUpgrade;
}

function loadDegenerators(): IDegenerator[] {
    const fresh = freshDegenerators();
    try {
        const saved = JSON.parse(localStorage.getItem("degenerators") ?? "null") as ISavedDegenerator[] | null;
        if (!saved) return fresh;

        const map = new Map(saved.map(s => [s.id, s]));
        return fresh.map(d => {
            const s = map.get(d.id);
            if (!s) return d;
            return {
                ...d,
                amount: new Decimal(s.amount),
                boughtAmount: s.boughtAmount ? new Decimal(s.boughtAmount) : d.boughtAmount,
                multiplier: new Decimal(s.multiplier),
                start: s.start,
                interval: s.interval,
                amountUpgrade: {
                    ...d.amountUpgrade,
                    currentAmount: new Decimal(s.amountUpgrade.currentAmount),
                    price: new Decimal(s.amountUpgrade.price),
                },
                intervalUpgrade: {
                    ...d.intervalUpgrade,
                    currentAmount: new Decimal(s.intervalUpgrade.currentAmount),
                    price: new Decimal(s.intervalUpgrade.price),
                },
                multiplierUpgrade: {
                    ...d.multiplierUpgrade,
                    currentAmount: new Decimal(s.multiplierUpgrade.currentAmount),
                    price: new Decimal(s.multiplierUpgrade.price),
                },
            };
        });
    } catch (e) {
        console.log(e);
    }
    return fresh;
}

export function useDegenerators() {
    const [degenerators, setDegenerators] = useState<IDegenerator[]>(
        () => loadDegenerators()
    );

    function resetDegenerators() {
        setDegenerators(freshDegenerators());
    }

    return { degenerators, setDegenerators, resetDegenerators };
}
