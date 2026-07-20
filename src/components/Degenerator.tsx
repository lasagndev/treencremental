import {useEffect, useRef} from "react";
import type {Game} from "../Models/Game.ts";
import '../styles/Degenerator.css'
import type {useDegenerators} from "../Hooks/useDegenerators.ts";
import type {IDegenerator} from "../Models/IDegenerator.ts";
import {fmt} from "./CurrencyBar.tsx";
import {fmt_upgrade} from "../data/pointUpgrades.ts";

interface IDegeneratorProps {
    game: Game,
    degenerator: ReturnType<typeof useDegenerators>
}

type UpgradeKey = 'amountUpgrade' | 'intervalUpgrade' | 'multiplierUpgrade';
const upgradeKeys: UpgradeKey[] = ['amountUpgrade', 'intervalUpgrade', 'multiplierUpgrade'];

const DegeneratorBar = ({d}: {d: IDegenerator}) => {
    const fillRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef(Math.max(d.interval, 40));
    // eslint-disable-next-line react-hooks/refs
    durationRef.current = Math.max(d.interval, 40);
    const startRef = useRef(d.start);
    // eslint-disable-next-line react-hooks/refs
    startRef.current = d.start;

    // eslint-disable-next-line react-hooks/refs
    const isCurrentMode = durationRef.current <= 500;

    useEffect(() => {
        let rafId: number;
        const tick = () => {
            if (fillRef.current) {
                if (durationRef.current <= 500) {
                    fillRef.current.style.width = '100%';
                } else {
                    const elapsed = (Date.now() - startRef.current) % durationRef.current;
                    fillRef.current.style.width = `${(elapsed / durationRef.current) * 100}%`;
                }
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div className="degenerator-bar-wrapper degenerator-bar-wrapper--card">
            <div className={`degenerator-bar${isCurrentMode ? ' degenerator-bar--current' : ''}`}>
                <div className="degenerator-bar__fill" ref={fillRef} />
                {!isCurrentMode && <div className="degenerator-bar__shimmer" />}
                <div className="degenerator-bar__label">
                    {isCurrentMode ? `Generating ${fmt_upgrade(d.amount.times(d.multiplier).div(d.interval).times(1000))}` : `Generating ${fmt_upgrade(d.amount.times(d.multiplier))}`}
                </div>
            </div>
            {!isCurrentMode && <>
                <div className="degenerator-bar__ticks">
                    {Array.from({ length: 7 }, (_, i) => (
                        <div key={i} className="degenerator-bar__tick" />
                    ))}
                </div>
                <div className="degenerator-bar__time-row">
                    <span>0s</span>
                    {/* eslint-disable-next-line react-hooks/refs */}
                    <span>{(durationRef.current / 1000).toFixed(2)}s</span>
                </div>
            </>}
        </div>
    );
};

const Degenerator = ({game, degenerator}: IDegeneratorProps) => {
    function buyUpgrade(degId: number, key: UpgradeKey) {
        const deg = degenerator.degenerators.find(d => d.id === degId);
        if (!deg) return;
        if (key === 'intervalUpgrade' && Math.max(deg.interval, 40) <= 40) return;
        const upg = deg[key];
        if (game.antyPoint.lt(upg.price)) return;
        game.setAntyPoint(n => n.minus(upg.price));


        degenerator.setDegenerators(prev => prev.map(d => {
            if (d.id !== degId) return d;
            return {
                ...d,
                ...upg.effect(d),
                [key]: {
                    ...upg,
                    currentAmount: upg.currentAmount.plus(1),
                    price: upg.price.times(upg.priceMultiplier),
                },
            };
        }));
    }

    return (
        <div className="degenerator-tab">

            <div className="degenerator-tab__header">
                <span className="degenerator-tab__header-icon">☠</span>
                <span>Degenerator</span>
            </div>



            <div className="degenerator-list">
                {degenerator.degenerators.filter(d => game.canShowDegenerators[d.id - 1]).map(d => (
                    <div key={d.id} className="degenerator-card">
                        <div className="degenerator-card__header">Degenerator #{d.id}</div>

                        <DegeneratorBar d={d} />

                        <div className="degenerator-card__stats">
                            <span>Amount: {fmt(d.amount)} (Bought: {fmt(d.boughtAmount)})</span>
                            <span>Multiplier: x{fmt_upgrade(d.multiplier)}</span>
                            <span>Interval: {(Math.max(d.interval, 40) / 1000).toFixed(2)}s</span>
                        </div>

                        <div className="degenerator-card__upgrades">
                            {upgradeKeys.map(key => {
                                const upg = d[key];
                                const maxed = key === 'intervalUpgrade' && Math.max(d.interval, 40) <= 40;
                                return (
                                    <div key={key} className={`degenerator-upgrade-card${maxed ? ' degenerator-upgrade-card--maxed' : ''}`}>
                                        <div className="degenerator-upgrade-card__desc">{upg.description}</div>
                                        {maxed
                                            ? <span className="degenerator-upgrade-card__maxed-badge">Maxed</span>
                                            : <button
                                                className="degenerator-upgrade-card__btn"
                                                onClick={() => buyUpgrade(d.id, key)}
                                                disabled={game.antyPoint.lt(upg.price)}>
                                                {fmt(upg.price)}
                                              </button>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Degenerator
