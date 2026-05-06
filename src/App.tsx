import './App.css'
import { useGameLoop } from "./Hooks/useGameLoop.ts";
import CurrencyBar from "./components/CurrencyBar.tsx";
import PointTree from "./components/PointTree.tsx";
import NavBar from "./components/NavBar.tsx";
import {useState} from "react";
import PrestigeTree from "./components/PrestigeTree.tsx";



function App() {


    const game = useGameLoop();


    const [currentTab, setCurrentTab] = useState("MainTree");


    return (
        <>
            <CurrencyBar game={game}/>
            <NavBar setCurrentTab={setCurrentTab} />

            <section className="MainTab">
                {currentTab === "MainTree" && <PointTree game={game}/> }
                {currentTab === "PrestigeTree" && <PrestigeTree game={game}/> }
            </section>

            {/*<button onClick={() => {game.setGlobalPointAddition(n => n+1)}}>DODAJ SIURA</button>
            <h3>{game.globalPointAddition}</h3>
            <button onClick={() => {game.setGlobalPointMultiplier(n => n+1)}}>MNÓŻ SIURA</button>
            <h3>{game.globalPointMultiplier}</h3>
            <button onClick={() => {game.setGlobalPointExponent(n => n+1)}}>POTEGUJ SIURA</button>
            <h3>{game.globalPointExponent}</h3>*/}
        </>
    )
}

export default App
