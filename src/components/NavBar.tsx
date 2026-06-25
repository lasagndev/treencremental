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
            {!game.isNegated &&
            <>
                <button
                className={currentTab === "MainTree" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("MainTree") }>
                Main Tree
                </button>

                {game.canShowPrestigeTree &&
                    <>
                        <button
                            className={currentTab === "PrestigeTree" ? "navTab--active" : ""}
                            onClick={ () => setCurrentTab("PrestigeTree") }>
                            Prestige Tree
                        </button>
                        <button
                            className={currentTab === "Automation" ? "navTab--active" : ""}
                            onClick={() => setCurrentTab("Automation")}>
                            Automation
                        </button>

                {game.canShowGenerator &&

                    <button
                        className={currentTab === "Generator" ? "navTab--active" : ""}
                        onClick={ () => setCurrentTab("Generator") }>
                        Generator
                    </button>

                }
                    </>
                }

                {game.canShowVoidTree &&
                <>
                    <button className={currentTab === "VoidTree" ? "navTab--active" : ""}
                            onClick={() => setCurrentTab("VoidTree")}>
                        Void Tree</button>

                    <button className={currentTab === "PureTree" ? "navTab--active" : ""}
                            onClick={() => setCurrentTab("PureTree")}>
                        Pure Tree</button>
                </>}
            </>   }

            {game.isNegated &&
                <button
                    className={currentTab === "NegationTree" ? "navTab--active" : ""}
                    onClick={() => setCurrentTab("NegationTree")}>
                    Negation Tree
                </button>
            }


            <button
                style={{ marginLeft: "auto" }}
                className={currentTab === "Achievements" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("Achievements") }>
                Achievements
            </button>
            <button
                className={currentTab === "Statistics" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("Statistics") }>
                Statistics
            </button>
            <button
                className={currentTab === "Settings" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("Settings") }>
                Settings
            </button>
        </section>
    )

}

export default NavBar;
