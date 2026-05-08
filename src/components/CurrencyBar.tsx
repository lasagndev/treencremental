import type {Game} from "../Models/Game.ts";
import "../styles/CurrencyBar.css";
interface Props {
    game: Game;
}

function CurrencyBar( { game }: Props ) {

    return (
        <section className={"CurrencyBar"}>
            <h2>p {game.point.lt(1e9) ? game.point.toFixed(0) : game.point.toExponential(2).replace('e+', 'e')}</h2>
            <h3>+{game.globalPointAddition.times(game.globalPointMultiplier).pow(game.globalPointExponent).toFixed(2)} p/s</h3>
        </section>
    )

}

export default CurrencyBar;