import {useEffect, useRef} from "react";
import type {Game} from "../Models/Game.ts";
import type {Statistics} from "../Models/Statistics.ts";
import {fmt} from "./CurrencyBar.tsx";
import '../styles/GeneratorTab.css'
import type {IBuyableUpgrade} from "../Models/IUpgrade.ts";
import Decimal from "break_eternity.js";
import {fmt_upgrade} from "../data/pointUpgrades.ts";

interface IGeneratorProps {
    game: Game,
    stats: Statistics,
    generatorStart: number,
}

// eslint-disable-next-line react-refresh/only-export-components
export const generatorUpgrades: IBuyableUpgrade[] = [
    {
        id: 1,
        description: "Generator interval /1.3",
        price: new Decimal(1000),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (game) => {
            game.setGeneratorDuration(n => n / (1.3));
        },
        position: {x: 0, y: 0},
        maxAmount: 0,
        isBought: false
    },
    {
        id: 2,
        description: "Prestige Energy gain *2",
        price: new Decimal(1000),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (game) => {
            game.setPeMulti(n => n.times(2));
        },
        position: {x: 0, y: 0},
        maxAmount: 0,
        isBought: false
    },
    {
        id: 3,
        description: "Improve P boost formula",
        price: new Decimal(100),
        priceMultiplier: new Decimal(10),
        currentAmount: new Decimal(0),
        effect: (game) => {
            game.setPeBoostToP(n => n.plus(1));
        },
        position: {x: 0, y: 0},
        maxAmount: 0,
        isBought: false
    },
    {
        id: 4,
        description: "Improve PP boost formula",
        price: new Decimal(100),
        priceMultiplier: new Decimal(10),
        currentAmount: new Decimal(0),
        effect: (game) => {
            game.setPeBoostToPP(n => n.plus(1));
        },
        position: {x: 0, y: 0},
        maxAmount: 0,
        isBought: false
    },
]

// Snapshot base prices at module load time, before any session mutations
// eslint-disable-next-line react-refresh/only-export-components
export const generatorBasePrices = new Map<number, Decimal>(
    generatorUpgrades.map(u => [u.id, u.price])
);

const GeneratorTab = ({game, stats, generatorStart}: IGeneratorProps) => {
    const fillRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef(Math.max(game.generatorDuration, 40));
    // eslint-disable-next-line react-hooks/refs
    durationRef.current = Math.max(game.generatorDuration, 40);

    // eslint-disable-next-line react-hooks/refs
    const isCurrentMode = durationRef.current <= 500;
    // eslint-disable-next-line react-hooks/refs
    const isIntervalMaxed = durationRef.current <= 40;
    // eslint-disable-next-line no-useless-assignment
    let isBoostToPSoftcapped = false
    // eslint-disable-next-line no-useless-assignment
    let isBoostToPPSoftcapped = false

    useEffect(() => {
        let rafId: number;
        const tick = () => {
            if (fillRef.current) {
                if (durationRef.current <= 500) {
                    fillRef.current.style.width = '100%';
                } else {
                    const elapsed = Date.now() - generatorStart;
                    const progress = Math.min(elapsed / durationRef.current, 1);
                    fillRef.current.style.width = `${progress * 100}%`;
                }
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [generatorStart]);

    let peBoostToP  = game.prestigeEnergy.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(6))
    if(peBoostToP.gte(new Decimal(1e10)))
    {
        peBoostToP = new Decimal(7e8).times(game.prestigeEnergy.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(50)));
        isBoostToPSoftcapped = true
    } else {
        isBoostToPSoftcapped = false
    }

    let peBoostToPP = game.prestigeEnergy.pow(0.1).pow(generatorUpgrades[3].currentAmount.plus(4).div(6))
    if(peBoostToPP.gte(new Decimal(1e4 ))) {
        peBoostToPP = new Decimal(3.34e3).times(game.prestigeEnergy.pow(0.1).pow(generatorUpgrades[3].currentAmount.plus(4).div(50)));
        isBoostToPPSoftcapped = true
    } else {
        isBoostToPPSoftcapped = false
    }

    function buyUpgrade(upg: IBuyableUpgrade) {
        const price = upg.price;
        if (upg.id === 1 || upg.id === 2) {
            if (game.prestigePoint.lt(price)) return;
            game.setPrestigePoint(n => n.minus(price));
        } else {
            if (game.prestigeEnergy.lt(price)) return;
            game.setPrestigeEnergy(n => n.minus(price));
        }
        upg.price = price.times(upg.priceMultiplier);
        upg.currentAmount = upg.currentAmount.plus(1);
        upg.effect(game);
        stats.setTotalUpgradesBought(n => n.plus(1));
    }

    return (
        <div className="generator-tab">

            <div className="generator-tab__header">
                <span className="generator-tab__header-icon">⚡</span>
                <span>Generator</span>
            </div>

            <section className="generatorCurrencyBar">
                <p>PE boost to P: x{fmt_upgrade(peBoostToP)} {isBoostToPSoftcapped && "(Soft capped)"}</p>
                <p>PE boost to PP: x{fmt_upgrade(peBoostToPP)} {isBoostToPPSoftcapped && "(Soft capped)"}</p>
                {/* eslint-disable-next-line react-hooks/refs */}
                <p>Interval: {(durationRef.current / 1000).toFixed(3)}s</p>
                <p>PE per loop: {fmt(new Decimal(2).pow(generatorUpgrades[1].currentAmount))}</p>
            </section>

            <div className="generator-bar-wrapper">
                <div className={`generator-bar${isCurrentMode ? ' generator-bar--current' : ''}`}>
                    <div className="generator-bar__fill" ref={fillRef} />
                    {!isCurrentMode && <div className="generator-bar__shimmer" />}
                    <div className="generator-bar__label">
                        {isCurrentMode
                            // eslint-disable-next-line react-hooks/refs
                            ? `⚡ CURRENT — ${fmt(game.peMulti.times(new Decimal(1000).dividedBy(durationRef.current)))} PE/s`
                            // eslint-disable-next-line react-hooks/refs
                            : `Generating… ${fmt_upgrade(game.peMulti.times(new Decimal(1000).dividedBy(durationRef.current)))} PE/s`}
                    </div>
                </div>
                {!isCurrentMode && <>
                    <div className="generator-bar__ticks">
                        {Array.from({ length: 7 }, (_, i) => (
                            <div key={i} className="generator-bar__tick" />
                        ))}
                    </div>
                    <div className="generator-bar__time-row">
                        <span>0s</span>
                        <span>{(Math.max(game.generatorDuration, 40)/1000).toFixed(2)}s</span>
                    </div>
                </>}
            </div>

            <div className="generator-upgrades-grid">
                {generatorUpgrades.map(upg => {
                    const maxed = upg.id === 1 && isIntervalMaxed;
                    return (
                        <div key={upg.id} className={`generator-upgrade-card${maxed ? ' generator-upgrade-card--maxed' : ''}`}>
                            <div className="generator-upgrade-card__glow" />
                            <div className="generator-upgrade-card__id">#{upg.id}</div>
                            <div className="generator-upgrade-card__desc">{upg.description}</div>

                            {maxed
                                ? <span className="generator-upgrade-card__maxed-badge">Maxed</span>
                                : (upg.id === 1 || upg.id === 2)
                                    ? <button onClick={() => buyUpgrade(upg)} className="generator-upgrade-card__btn" disabled={upg.price.gt(game.prestigePoint)}>
                                        {fmt(upg.price)} PP
                                      </button>
                                    : <button onClick={() => buyUpgrade(upg)} className="generator-upgrade-card__btn" disabled={upg.price.gt(game.prestigeEnergy)}>
                                        {fmt(upg.price)} PE
                                      </button>
                            }
                        </div>
                    );
                })}
            </div>

        </div>
    )
}

export default GeneratorTab
