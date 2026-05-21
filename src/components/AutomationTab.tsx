import type {Game} from "../Models/Game.ts";
import type {Statistics} from "../Models/Statistics.ts";
import type {IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import {fmt} from "./CurrencyBar.tsx";
import '../styles/AutomationTab.css'

interface IAutomationTab {
    game: Game;
    stats: Statistics;
    prestigeOneTimeUpgrades: IOneTimeUpgrade[];
    setPrestigeOneTimeUpgrades: React.Dispatch<React.SetStateAction<IOneTimeUpgrade[]>>;
    autoEnabled: Record<number, boolean>;
    setAutoGroup: (id: number, enabled: boolean) => void;
}

const GROUPS = [
    { id: 3001, label: "Upgrades 1–5",   desc: "Automatically purchase point upgrades 1 through 5"  },
    { id: 3002, label: "Upgrades 6–10",  desc: "Automatically purchase point upgrades 6 through 10" },
    { id: 3003, label: "Upgrades 11–15", desc: "Automatically purchase point upgrades 11 through 15" },
    { id: 3004, label: "Upgrades 16–20", desc: "Automatically purchase point upgrades 16 through 20" },
    { id: 3005, label: "Upgrades 21–25", desc: "Automatically purchase point upgrades 21 through 25" },
]

const AutomationTab = ({ game, stats, prestigeOneTimeUpgrades, setPrestigeOneTimeUpgrades, autoEnabled, setAutoGroup }: IAutomationTab) => {

    function buyUpgrade(upg: IOneTimeUpgrade) {
        if (upg.isBought || game.prestigePoint.lt(upg.price)) return;
        game.setPrestigePoint(n => n.minus(upg.price));
        upg.effect(game);
        stats.setTotalUpgradesBought(n => n.plus(1));
        setPrestigeOneTimeUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, isBought: true } : u));
    }

    return (
        <div className="automation-tab">
            <div className="automation-tab__header">
                <span className="automation-tab__header-icon">⚙</span>
                <span>Automation</span>
            </div>

            <div className="automation-grid">
                {GROUPS.map(({ id, label, desc }) => {
                    const upg = prestigeOneTimeUpgrades.find(u => u.id === id);
                    if (!upg) return null;

                    const unlocked = upg.isBought;
                    const enabled  = autoEnabled[id] ?? true;
                    const canAfford = !game.prestigePoint.lt(upg.price);

                    let cardClass = "automation-card";
                    if (!unlocked)    cardClass += " automation-card--locked";
                    else if (enabled) cardClass += " automation-card--active";
                    else              cardClass += " automation-card--paused";

                    return (
                        <div key={id} className={cardClass}>
                            <div className="automation-card__glow" />

                            <div className="automation-card__top">
                                <div className="automation-card__title">
                                    <span className="automation-card__dot" />
                                    {label}
                                </div>

                                {unlocked ? (
                                    <label className="toggle" title={enabled ? "Pause" : "Resume"}>
                                        <input
                                            type="checkbox"
                                            checked={enabled}
                                            onChange={e => setAutoGroup(id, e.target.checked)}
                                        />
                                        <span className="toggle__track">
                                            <span className="toggle__thumb" />
                                        </span>
                                    </label>
                                ) : (
                                    <button
                                        className="automation-unlock-btn"
                                        onClick={() => buyUpgrade(upg)}
                                        disabled={!canAfford}
                                    >
                                        {fmt(upg.price)} PP
                                    </button>
                                )}
                            </div>

                            <p className="automation-card__desc">{desc}</p>

                            <div className="automation-card__footer">
                                <span className="automation-card__status">
                                    {!unlocked ? "LOCKED" : enabled ? "● RUNNING" : "⏸ PAUSED"}
                                </span>
                                {!unlocked && (
                                    <span className="automation-card__cost">
                                        Costs {fmt(upg.price)} PP
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AutomationTab;
