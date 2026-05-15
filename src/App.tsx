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
import {ppUp1} from "./data/prestigeUpgrades.ts";
import SettingsTab from "./components/SettingsTab.tsx";
import AchievementsTab from "./components/AchievementsTab.tsx";
import StatisticsTab from "./components/StatisticsTab.tsx";
import {useStatistics} from "./Hooks/useStatistics.ts";
import {useAchievements} from "./Hooks/useAchievements.ts";
import AchievementPopup from "./components/AchievementPopup.tsx";
import Decimal from "break_eternity.js";



function App() {

    const stats = useStatistics();
    const game = useGameLoop(stats);
    const pointUpgrades = usePointUpgrades();
    const prestigeUpgrades = usePrestigeUpgrades();
    const achievementsHook = useAchievements();

    const gameRef = useRef(game);
    const statsRef = useRef(stats);
    const pointUpgradesRef = useRef(pointUpgrades);
    const prestigeUpgradesRef = useRef(prestigeUpgrades);
    const pUp1Ref = useRef(pUp1.isBought);
    const ppUp1Ref = useRef(ppUp1.isBought);
    const prestigeUnlockRef = useRef(prestigeUnlock.isBought);
    const achievementsRef = useRef(achievementsHook.achievements);
    const checkAchievementsRef = useRef(achievementsHook.checkAchievements);

    // eslint-disable-next-line react-hooks/refs
    gameRef.current = game;
    // eslint-disable-next-line react-hooks/refs
    statsRef.current = stats;
    // eslint-disable-next-line react-hooks/refs
    pointUpgradesRef.current = pointUpgrades;
    // eslint-disable-next-line react-hooks/refs
    prestigeUpgradesRef.current = prestigeUpgrades;
    // eslint-disable-next-line react-hooks/refs
    pUp1Ref.current = pUp1.isBought;
    // eslint-disable-next-line react-hooks/refs
    ppUp1Ref.current = ppUp1.isBought;
    // eslint-disable-next-line react-hooks/refs
    prestigeUnlockRef.current = prestigeUnlock.isBought;
    // eslint-disable-next-line react-hooks/refs
    achievementsRef.current = achievementsHook.achievements;
    // eslint-disable-next-line react-hooks/refs
    checkAchievementsRef.current = achievementsHook.checkAchievements;

    function handleSave() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSaveSystem(gameRef.current, statsRef.current, pointUpgradesRef.current, prestigeUpgradesRef.current, pUp1Ref.current, ppUp1Ref.current, prestigeUnlockRef.current, achievementsRef.current)
        // eslint-disable-next-line react-hooks/immutability
        setToastKey(Date.now())
    }

    useEffect(() => {
        const jajo = setInterval(handleSave, 30000)
        return () => clearInterval(jajo)
    }, [])

    useEffect(() => {
        const siur = setInterval(() => {
            stats.setTimePlayed(n => n.plus(new Decimal(1)))
            console.log(stats.timePlayed)
        }, 1000)
        return () => clearInterval(siur)
    }, []);

    useEffect(() => {
        const ach = setInterval(() => {
            checkAchievementsRef.current(gameRef.current, statsRef.current);
        }, 1000);
        return () => clearInterval(ach);
    }, []);


    const [toastKey, setToastKey] = useState<number | null>(null);
    const [currentTab, setCurrentTab] = useState("MainTree");

    return (
        <>
            <CurrencyBar game={game}/>
            <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} game={game} />

            <section className="MainTab">
                {currentTab === "MainTree" && <PointTree game={game} upgrades={pointUpgrades} stats={stats}/> }
                {currentTab === "PrestigeTree" && <PrestigeTree game={game} upgrades={prestigeUpgrades} stats={stats}/> }
                {currentTab === "Achievements" && <AchievementsTab achievements={achievementsHook.achievements} />}
                {currentTab === "Statistics" && <StatisticsTab stats={stats} />}
                {currentTab === "Settings" && <SettingsTab onSave={handleSave} />}
            </section>

            {toastKey !== null && <div key={toastKey} className="save-toast">Game saved...</div>}
            {achievementsHook.popupQueue.length > 0 && (
                <AchievementPopup
                    key={achievementsHook.popupQueue[0].id}
                    achievement={achievementsHook.popupQueue[0]}
                    onDone={achievementsHook.dismissPopup}
                />
            )}
        </>
    )
}

export default App
