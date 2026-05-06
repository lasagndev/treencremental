
import "../styles/NavBar.css"

interface Props {
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}


function NavBar( { setCurrentTab } : Props ) {

    return (
        <section className="navBar">
            <button onClick={ () => setCurrentTab("MainTree") }>Main Tree</button>
            <button onClick={ () => setCurrentTab("PrestigeTree") }>Prestige Tree</button>
        </section>
    )


}

export default NavBar;