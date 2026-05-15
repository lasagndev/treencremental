import {Statistics} from "../Models/Statistics.ts";
import {useState} from "react";
import Decimal from "break_eternity.js";


function loadSaved() {
    try {
        return JSON.parse(localStorage.getItem("stats") || "null") as Record<string, string | boolean> | null;
    } catch {
        return null;
    }
}

export function useStatistics() {
    const [allPoints, setAllPoints] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.allPoints ? new Decimal(s.allPoints as string) : new Decimal(0)
    });

    const [totalUpgradesBought, setTotalUpgradesBought] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.totalUpgradesBought ? new Decimal(s.totalUpgradesBought as string) : new Decimal(0);
    });

    const [totalPrestiges, setTotalPrestiges] = useState<Decimal>( () => {
        const s = loadSaved();
        return s?.totalPrestiges ? new Decimal(s.totalPrestiges as string) : new Decimal(0);
    })

    const [allPrestigePoints, setAllPrestigePoints] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.allPrestigePoints ? new Decimal(s.allPrestigePoints as string) : new Decimal(0);
    })

    const [timePlayed, setTimesPlayed] = useState<Decimal>(() => {
        const s = loadSaved();
        return s?.timePlayed ? new Decimal(s.timePlayed as string) : new Decimal(0);
    })

    const stats = new Statistics(
        allPoints, setAllPoints,
        totalUpgradesBought, setTotalUpgradesBought,
        totalPrestiges, setTotalPrestiges,
        allPrestigePoints, setAllPrestigePoints,
        timePlayed, setTimesPlayed
    )

    return stats
}
