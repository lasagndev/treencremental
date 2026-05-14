import './App.css'
import { useGameLoop } from "./Hooks/useGameLoop.ts";
import { usePointUpgrades } from "./Hooks/usePointUpgrades.ts";
import { usePrestigeUpgrades } from "./Hooks/usePrestigeUpgrades.ts";
import CurrencyBar from "./components/CurrencyBar.tsx";
import PointTree from "./components/PointTree.tsx";
import NavBar from "./components/NavBar.tsx";
import {useEffect, useRef, useState} from "react";
import PrestigeTree from "./components/PrestigeTree.tsx";
import {useSaveSystem} from "./Hooks/useSaveSystem.ts";
import {prestigeUnlock, pUp1} from "./data/pointUpgrades.ts";
import SettingsTab from "./components/SettingsTab.tsx";
import AchievementsTab from "./components/AchievementsTab.tsx";
import StatisticsTab from "./components/StatisticsTab.tsx";



function App() {

    const game = useGameLoop();
    const pointUpgrades = usePointUpgrades();
    const prestigeUpgrades = usePrestigeUpgrades();

    const gameRef = useRef(game);
    const pointUpgradesRef = useRef(pointUpgrades);
    const prestigeUpgradesRef = useRef(prestigeUpgrades);
    const pUp1Ref = useRef(pUp1.isBought);
    const prestigeUnlockRef = useRef(prestigeUnlock.isBought);

    gameRef.current = game;
    pointUpgradesRef.current = pointUpgrades;
    prestigeUpgradesRef.current = prestigeUpgrades;
    pUp1Ref.current = pUp1.isBought;
    prestigeUnlockRef.current = prestigeUnlock.isBought;

    function handleSave() {
        useSaveSystem(gameRef.current, pointUpgradesRef.current, prestigeUpgradesRef.current, pUp1Ref.current, prestigeUnlockRef.current)
        setToastKey(Date.now())
    }

    useEffect(() => {
        const jajo = setInterval(handleSave, 30000)
        return () => clearInterval(jajo)
    }, [])


    const [toastKey, setToastKey] = useState<number | null>(null);
    const [currentTab, setCurrentTab] = useState("MainTree");

    return (
        <>
            <CurrencyBar game={game}/>
            <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} game={game} />

            <section className="MainTab">
                {currentTab === "MainTree" && <PointTree game={game} upgrades={pointUpgrades}/> }
                {currentTab === "PrestigeTree" && <PrestigeTree game={game} upgrades={prestigeUpgrades}/> }
                {currentTab === "Achievements" && <AchievementsTab />}
                {currentTab === "Statistics" && <StatisticsTab />}
                {currentTab === "Settings" && <SettingsTab onSave={handleSave} />}
            </section>

            {toastKey !== null && <div key={toastKey} className="save-toast">Game saved...</div>}
        </>
    )
}

export default App
