import type {Game} from "../Models/Game.ts";
import "../styles/CurrencyBar.css";
interface Props {
    game: Game;
}

function CurrencyBar( { game }: Props ) {

    const pointsPerSecond = game.globalPointAddition.times(game.globalPointMultiplier).pow(game.globalPointExponent)

    return (
        <section className={"CurrencyBar"}>
            <h2>p {game.point.lt(1e6) ? game.point.toFixed(0) : game.point.toExponential(2).replace('e+', 'e')}</h2>
            <h3>+ {pointsPerSecond.lt(1e6) ? pointsPerSecond.toFixed(0) : pointsPerSecond.toExponential(2).replace('e+', 'e')} p/s</h3>
        </section>
    )

}

export default CurrencyBar;