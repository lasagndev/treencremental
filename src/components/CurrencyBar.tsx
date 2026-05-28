import type {Game} from "../Models/Game.ts";
import "../styles/CurrencyBar.css";
import Decimal from "break_eternity.js";
import {generatorUpgrades} from "./GeneratorTab.tsx";

interface Props {
    game: Game;
}

function fmtExp(n: Decimal, d: number): string {
    const s = n.toExponential(d).replace('e+', 'e')
    const [mantissa, exp] = s.split('e')
    const decimals = mantissa.includes('.') ? mantissa.split('.')[1].length : 0
    const dot = decimals === 0 && d > 0 ? '.' : ''
    return mantissa + dot + '0'.repeat(Math.max(0, d - decimals)) + 'e' + exp
}

// eslint-disable-next-line react-refresh/only-export-components
export function fmt(n: Decimal): string {
    if (n.gte('1e1000000')) return fmtExp(n, 6)
    if (n.gte('1e100000'))  return fmtExp(n, 5)
    if (n.gte('1e10000'))   return fmtExp(n, 4)
    if (n.gte('1e1000'))    return fmtExp(n, 3)
    if (n.gte(1e6))         return fmtExp(n, 2)
    return n.toFixed(0)
}

function CurrencyBar( { game }: Props ) {

    let peBoostFactor = game.prestigeEnergy.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(6));
    if (peBoostFactor.gte(new Decimal(1e10))) peBoostFactor = new Decimal(7e8).times(game.prestigeEnergy.pow(0.3).pow(generatorUpgrades[2].currentAmount.plus(4).div(50)));
    const pointsPerSecond = game.globalPointAddition.times(game.globalPointMultiplier).times(game.dynamicUpgradeValues[102] ?? new Decimal(1)).times(peBoostFactor).pow(game.globalPointExponent)

    return (
        <section className={"CurrencyBar"}>
            <div className={"CurrencyBar__group"}>
                <div className={"CurrencyBar__row"}>
                    <h2 className={"CurrencyBar__points"}>P <span className={"CurrencyBar__value"}>{fmt(game.point)}</span></h2>
                    {game.canShowPrestigeTree && <>
                        <div className={"CurrencyBar__divider"} />
                        <h2 className={"CurrencyBar__prestige"}>PP <span className={"CurrencyBar__value"}>{fmt(game.prestigePoint)}</span></h2>
                    </>}
                    {game.canShowGenerator && <>
                        <div className={"CurrencyBar__divider"} />
                        <h2 className={"CurrencyBar__generator"}>PE <span className={"CurrencyBar__value"}>{fmt(game.prestigeEnergy)}</span></h2>
                    </>}
                </div>
                <h3>+ {fmt(pointsPerSecond)} p/s</h3>
            </div>
        </section>



    )

}

export default CurrencyBar;