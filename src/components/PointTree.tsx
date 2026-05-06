import type {Game} from "../Models/Game.ts";

interface PointTreeProps {
    game: Game
}

const PointTree = ( {game} : PointTreeProps ) => {

    return (
        <>
            <button onClick={() => {game.setGlobalPointAddition(n => n+1)}}>Big ah upgrade</button>
        </>
    )

}

export default PointTree;