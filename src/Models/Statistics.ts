import type Decimal from "break_eternity.js";


export class Statistics {
    allPoints
    setAllPoints
    totalUpgradesBought
    setTotalUpgradesBought
    totalPrestiges
    setTotalPrestiges
    allPrestigePoints
    setAllPrestigePoints
    timePlayed
    setTimePlayed

    constructor(
        allPoints: Decimal,
        setAllPoints: React.Dispatch<React.SetStateAction<Decimal>>,

        totalUpgradesBought: Decimal,
        setTotalUpgradesBought: React.Dispatch<React.SetStateAction<Decimal>>,

        totalPrestiges: Decimal,
        setTotalPrestiges: React.Dispatch<React.SetStateAction<Decimal>>,

        allPrestigePoints: Decimal,
        setAllPrestigePoints: React.Dispatch<React.SetStateAction<Decimal>>,

        timePlayed: Decimal,
        setTimePlayed: React.Dispatch<React.SetStateAction<Decimal>>,
    ) {
        this.allPoints = allPoints
        this.setAllPoints = setAllPoints
        this.totalUpgradesBought = totalUpgradesBought
        this.setTotalUpgradesBought = setTotalUpgradesBought
        this.totalPrestiges = totalPrestiges
        this.setTotalPrestiges = setTotalPrestiges
        this.allPrestigePoints = allPrestigePoints
        this.setAllPrestigePoints = setAllPrestigePoints
        this.timePlayed = timePlayed
        this.setTimePlayed = setTimePlayed
    }

}
