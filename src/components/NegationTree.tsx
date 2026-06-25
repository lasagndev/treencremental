import type {Game} from "../Models/Game.ts";

interface NegationTreeProps {
    game: Game
    handleNegation: () => void
}

const NegationTree = ({game, handleNegation} : NegationTreeProps) => {

    return (
    <>
        <h2>Hej jestes w Płocku</h2>
        <button onClick={() => {handleNegation()
            console.log(game)}}>Postaw klocka</button>
    </>
    )
}

export default NegationTree;