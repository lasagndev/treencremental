import "../styles/NavBar.css"

interface Props {
    currentTab: string
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}

function NavBar( { currentTab, setCurrentTab } : Props ) {

    return (
        <section className="navBar">
            <button
                className={currentTab === "MainTree" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("MainTree") }>
                Main Tree
            </button>
            <button
                className={currentTab === "PrestigeTree" ? "navTab--active" : ""}
                onClick={ () => setCurrentTab("PrestigeTree") }>
                Prestige Tree
            </button>
        </section>
    )

}

export default NavBar;