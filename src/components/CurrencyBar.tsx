import type {Game} from "../Models/Game.ts";
import "../styles/CurrencyBar.css";
import type Decimal from "break_eternity.js";

interface Props {
    game: Game;
}

function fmtExp(n: Decimal, d: number): string {
    const s = n.toExponential(d).replace('e+', 'e')
    const [mantissa, exp] = s.split('e')
    const decimals = mantissa.includes('.') ? mantissa.split('.')[1].length : 0
    return mantissa + '0'.repeat(d - decimals) + 'e' + exp
}

export function fmt(n: Decimal): string {
    if (n.gte('1e1000000')) return fmtExp(n, 6)
    if (n.gte('1e100000'))  return fmtExp(n, 5)
    if (n.gte('1e10000'))   return fmtExp(n, 4)
    if (n.gte('1e1000'))    return fmtExp(n, 3)
    if (n.gte(1e6))         return fmtExp(n, 2)
    return n.toFixed(0)
}

function CurrencyBar( { game }: Props ) {

    const pointsPerSecond = game.globalPointAddition.times(game.globalPointMultiplier).pow(game.globalPointExponent)

    return (
        <section className={"CurrencyBar"}>
            <div className={"CurrencyBar__group"}>
                <div className={"CurrencyBar__row"}>
                    <h2 className={"CurrencyBar__points"}>P <span className={"CurrencyBar__value"}>{fmt(game.point)}</span></h2>
                    {game.canShowPrestigeTree && <>
                        <div className={"CurrencyBar__divider"} />
                        <h2 className={"CurrencyBar__prestige"}>PP <span className={"CurrencyBar__value"}>{fmt(game.prestigePoint)}</span></h2>
                    </>}
                </div>
                <h3>+ {fmt(pointsPerSecond)} p/s</h3>
            </div>
        </section>



    )

}

export default CurrencyBar;