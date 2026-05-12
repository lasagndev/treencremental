import type {Game} from "../Models/Game.ts";
import "../styles/CurrencyBar.css";
import type Decimal from "break_eternity.js";

interface Props {
    game: Game;
}

export function fmt(n: Decimal): string {
    if (n.gte('1e1000000')) return n.toExponential(6).replace('e+', 'e')
    if (n.gte('1e100000'))  return n.toExponential(5).replace('e+', 'e')
    if (n.gte('1e10000'))   return n.toExponential(4).replace('e+', 'e')
    if (n.gte('1e1000'))    return n.toExponential(3).replace('e+', 'e')
    if (n.gte(1e6))         return n.toExponential(2).replace('e+', 'e')
    return n.toFixed(0)
}

function CurrencyBar( { game }: Props ) {

    const pointsPerSecond = game.globalPointAddition.times(game.globalPointMultiplier).pow(game.globalPointExponent)

    return (
        <section className={"CurrencyBar"}>
            <div className={"CurrencyBar__group"}>
                <div className={"CurrencyBar__row"}>
                    <h2>P {fmt(game.point)}</h2>
                    {game.canShowPrestigeTree && <>
                        <div className={"CurrencyBar__divider"} />
                        <h2 className={"CurrencyBar__prestige"}>PP {fmt(game.prestigePoint)}</h2>
                    </>}
                </div>
                <h3>+ {fmt(pointsPerSecond)} p/s</h3>
            </div>
        </section>



    )

}

export default CurrencyBar;