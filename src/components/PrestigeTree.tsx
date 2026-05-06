import type {Game} from "../Models/Game.ts";

interface Props {
    game: Game;
}

const PrestigeTree = ({game}: Props) => {
    return (
        <>
            <button onClick={() => {game.setGlobalPointMultiplier(n => n + 1)}}>SKIBIDI MNOZNIK!!</button>
        </>
    )

}
export default PrestigeTree;