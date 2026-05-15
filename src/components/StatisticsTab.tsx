import "../styles/StatisticsTab.css"
import type {Statistics} from "../Models/Statistics.ts";
import {fmt} from "./CurrencyBar.tsx";

interface StatisticsTabProps {
    stats: Statistics
}

function fmtTime(totalSeconds: number): string {
    totalSeconds = Math.floor(totalSeconds)
    if (totalSeconds < 60) return `${totalSeconds}s`
    if (totalSeconds < 3600) {
        const m = Math.floor(totalSeconds / 60)
        const s = totalSeconds % 60
        return s > 0 ? `${m}m ${s}s` : `${m}m`
    }
    if (totalSeconds < 86400) {
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        return m > 0 ? `${h}h ${m}m` : `${h}h`
    }
    const d = Math.floor(totalSeconds / 86400)
    const h = Math.floor((totalSeconds % 86400) / 3600)
    return h > 0 ? `${d}d ${h}h` : `${d}d`
}

function StatisticsTab({ stats }: StatisticsTabProps) {
    return (
        <section className="statisticsTab">
            <h2 className="statisticsTab__title">Statistics</h2>

            <div className="statisticsTab__section">
                <div className="statisticsTab__row">
                    <span className="statisticsTab__label">All points earned</span>
                    <span className="statisticsTab__value">{fmt(stats.allPoints)}</span>
                </div>
                <div className="statisticsTab__row">
                    <span className="statisticsTab__label">Total upgrades bought</span>
                    <span className="statisticsTab__value">{fmt(stats.totalUpgradesBought)}</span>
                </div>
            </div>

            <div className="statisticsTab__section">
                <div className="statisticsTab__row">
                    <span className="statisticsTab__label">Total prestiges</span>
                    <span className="statisticsTab__value statisticsTab__value--prestige">{fmt(stats.totalPrestiges)}</span>
                </div>
                <div className="statisticsTab__row">
                    <span className="statisticsTab__label">All prestige points earned</span>
                    <span className="statisticsTab__value statisticsTab__value--prestige">{fmt(stats.allPrestigePoints)}</span>
                </div>
            </div>

            <div className="statisticsTab__section">
                <div className="statisticsTab__row">
                    <span className="statisticsTab__label">Time played</span>
                    <span className="statisticsTab__clock">
                        <span className="statisticsTab__clock-icon">&#9201;</span>
                        <span className="statisticsTab__value statisticsTab__value--time">
                            {fmtTime(stats.timePlayed.toNumber())}
                        </span>
                    </span>
                </div>
            </div>
        </section>
    )
}

export default StatisticsTab;
