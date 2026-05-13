import "../styles/NavBar.css"
import type {Game} from "../Models/Game.ts";

interface Props {
    currentTab: string
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>
    game: Game
}

function NavBar( { currentTab, setCurrentTab, game } : Props ) {

    return (
        <section className="navBar">
            <button
                className={currentTab === "MainTree" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("MainTree") }>
                Main Tree
            </button>
            {game.canShowPrestigeTree && <button
                className={currentTab === "PrestigeTree" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("PrestigeTree") }>
                Prestige Tree
            </button>}
        </section>
    )

}

export default NavBar;