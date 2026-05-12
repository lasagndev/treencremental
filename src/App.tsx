import './App.css'
import { useGameLoop } from "./Hooks/useGameLoop.ts";
import { usePointUpgrades } from "./Hooks/usePointUpgrades.ts";
import CurrencyBar from "./components/CurrencyBar.tsx";
import PointTree from "./components/PointTree.tsx";
import NavBar from "./components/NavBar.tsx";
import {useState} from "react";
import PrestigeTree from "./components/PrestigeTree.tsx";



function App() {

    const game = useGameLoop();
    const pointUpgrades = usePointUpgrades();

    const [currentTab, setCurrentTab] = useState("MainTree");

    return (
        <>
            <CurrencyBar game={game}/>
            <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} game={game} />

            <section className="MainTab">
                {currentTab === "MainTree" && <PointTree game={game} upgrades={pointUpgrades}/> }
                {currentTab === "PrestigeTree" && <PrestigeTree game={game}/> }
            </section>

        </>
    )
}

export default App
