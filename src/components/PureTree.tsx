import type {Game} from "../Models/Game.ts";

interface PureTreeProps {
    game: Game
    handleNegation: () => void
}

const PureTree = ({game, handleNegation} : PureTreeProps) => {

    return(
        <>
            <button onClick={() => {
                handleNegation()
                console.log(game)
            }}>Wejdz do Płocka, postawie ci klocka</button>
        </>
    )

}

export default PureTree;