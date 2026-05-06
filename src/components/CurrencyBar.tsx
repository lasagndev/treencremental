import type {Game} from "../Models/Game.ts";
import "../styles/CurrencyBar.css";

interface Props {
    game: Game;
}

function CurrencyBar( { game }: Props ) {

    return (
        <section className={"CurrencyBar"}>
            <h2>p {game.point.toFixed(0)}</h2>
            <h3> + {Math.pow((game.globalPointAddition * game.globalPointMultiplier), game.globalPointExponent ).toFixed(0)} p/s </h3>
        </section>
    )

}

export default CurrencyBar;