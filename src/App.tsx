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
import AutomationTab from "./components/AutomationTab.tsx";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "./Models/IUpgrade.ts";
import GeneratorTab, {generatorUpgrades} from "./components/GeneratorTab.tsx";




function App() {
    const stats = useStatistics();
    const prestigeUpgrades = usePrestigeUpgrades();
    const pp102Amount = prestigeUpgrades.buyableUpgrades.find(u => u.id === 102)?.currentAmount ?? new Decimal(0);
    const game = useGameLoop(stats, pp102Amount);
    const pointUpgrades = usePointUpgrades();
    const achievementsHook = useAchievements();


    // Restore module-level generator upgrades from localStorage on first mount
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("generatorUpgrades") ?? "null") as Array<{ id: number; price: string; currentAmount: string }> | null;
            if (saved) {
                saved.forEach(s => {
                    const upg = generatorUpgrades.find(u => u.id === s.id);
                    if (upg) {
                        upg.price = new Decimal(s.price);
                        upg.currentAmount = new Decimal(s.currentAmount);
                    }
                });
            }
        } catch { /* ignore corrupt saves */ }
    }, []);

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
        useSaveSystem(gameRef.current, statsRef.current, pointUpgradesRef.current, prestigeUpgradesRef.current, pUp1Ref.current, ppUp1Ref.current, prestigeUnlockRef.current, achievementsRef.current, generatorUpgrades)
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
        }, 1000)
        return () => clearInterval(siur)
    }, []);

    useEffect(() => {
        const who_touch_me_bird = setInterval(() => {
            checkAchievementsRef.current(gameRef.current, statsRef.current, pointUpgradesRef.current, prestigeUpgradesRef.current);
        }, 1000);
        return () => clearInterval(who_touch_me_bird);
    }, []);

    let automationInterval = game.automationInterval;
    if(automationInterval <= 100) automationInterval = 100;

    useEffect(() => {
        const automation = setInterval(() => {
            const game = gameRef.current;
            const stats = statsRef.current;
            const { buyableUpgrades, oneTimeUpgrades, setBuyableUpgrades, setOneTimeUpgrades } = pointUpgradesRef.current;
            const prestigeOneTime = prestigeUpgradesRef.current.oneTimeUpgrades;

            const tog = autoEnabledRef.current;
            const auto1to5   = (prestigeOneTime.find(u => u.id === 3001)?.isBought ?? false) && (tog[3001] ?? true);
            const auto6to10  = (prestigeOneTime.find(u => u.id === 3002)?.isBought ?? false) && (tog[3002] ?? true);
            const auto11to15 = (prestigeOneTime.find(u => u.id === 3003)?.isBought ?? false) && (tog[3003] ?? true);
            const auto16to20 = (prestigeOneTime.find(u => u.id === 3004)?.isBought ?? false) && (tog[3004] ?? true);
            const auto21to25 = (prestigeOneTime.find(u => u.id === 3005)?.isBought ?? false) && (tog[3005] ?? true);

            if (!auto1to5 && !auto6to10 && !auto11to15 && !auto16to20 && !auto21to25) return;

            // Track spend within this tick so multiple purchases don't overdraw the same balance
            let available = game.point;

            function isLocked(id: number): boolean {
                const upg = [...buyableUpgrades, ...oneTimeUpgrades].find(u => u.id === id);
                if (!upg || upg.parentId === undefined) return false;
                if (upg.parentId === pUp1.id) return false;
                const parentBuyable = buyableUpgrades.find(u => u.id === upg.parentId);
                if (parentBuyable) return parentBuyable.currentAmount.eq(0);
                const parentOneTime = oneTimeUpgrades.find(u => u.id === upg.parentId);
                if (parentOneTime) return !parentOneTime.isBought;
                return false;
            }

            function getPrice(upg: IBuyableUpgrade) {
                return upg.calcPrice ? upg.calcPrice(upg) : upg.price;
            }

            function buyOneTime(upg: IOneTimeUpgrade) {
                if (upg.isBought || isLocked(upg.id) || available.lt(upg.price)) return;
                available = available.minus(upg.price);
                game.setPoint(n => n.minus(upg.price));
                upg.effect(game);
                stats.setTotalUpgradesBought(n => n.plus(1));
                setOneTimeUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, isBought: true } : u));
            }

            function buyBuyable(upg: IBuyableUpgrade) {
                const price = getPrice(upg);
                if (upg.isMaxed || isLocked(upg.id) || available.lt(price)) return;
                available = available.minus(price);
                game.setPoint(n => n.minus(price));
                upg.effect(game);
                stats.setTotalUpgradesBought(n => n.plus(1));
                setBuyableUpgrades(prev => prev.map(u => u.id === upg.id ? {
                    ...u,
                    ...(u.calcPrice ? {} : { price: u.price.times(u.priceMultiplier) }),
                    currentAmount: u.currentAmount.plus(1),
                    isMaxed: u.currentAmount.plus(1).eq(u.maxAmount)
                } : u));
            }

            if (auto1to5) {
                buyableUpgrades.filter(u => u.id >= 101 && u.id <= 105).forEach(buyBuyable);
                oneTimeUpgrades.filter(u => u.id >= 201 && u.id <= 205).forEach(buyOneTime);
            }
            if (auto6to10) {
                buyableUpgrades.filter(u => u.id >= 106 && u.id <= 110).forEach(buyBuyable);
                oneTimeUpgrades.filter(u => u.id >= 206 && u.id <= 210).forEach(buyOneTime);
            }
            if (auto11to15) {
                buyableUpgrades.filter(u => u.id >= 111 && u.id <= 115).forEach(buyBuyable);
                oneTimeUpgrades.filter(u => u.id >= 211 && u.id <= 215).forEach(buyOneTime);
            }
            if (auto16to20) {
                buyableUpgrades.filter(u => u.id >= 116 && u.id <= 120).forEach(buyBuyable);
                oneTimeUpgrades.filter(u => u.id >= 216 && u.id <= 220).forEach(buyOneTime);
            }
            if(auto21to25) {
                buyableUpgrades.filter(u => u.id >= 121 && u.id <= 125).forEach(buyBuyable);
                oneTimeUpgrades.filter(u => u.id >= 221 && u.id <= 225).forEach(buyOneTime);
            }
            console.log(automationInterval)
        }, automationInterval);
        return () => clearInterval(automation);
    }, [automationInterval]);


    const [autoEnabled, setAutoEnabled] = useState<Record<number, boolean>>({ 3001: true, 3002: true, 3003: true, 3004: true, 3005: true })
    const autoEnabledRef = useRef(autoEnabled)
    // eslint-disable-next-line react-hooks/refs,react-hooks/immutability
    autoEnabledRef.current = autoEnabled

    function setAutoGroup(id: number, enabled: boolean) {
        setAutoEnabled(prev => ({ ...prev, [id]: enabled }))
    }

    const [generatorStart, setGeneratorStart] = useState<number>(() => {
        const saved = parseInt(localStorage.getItem("generatorStart") ?? "");
        const now = Date.now();
        if (isNaN(saved) || saved > now || saved < 1_000_000_000_000) return now;
        return saved;
    });
    const generatorStartRef = useRef(generatorStart);
    useEffect(() => { generatorStartRef.current = generatorStart; }, [generatorStart]);

    const generatorUnlockMountedRef = useRef(false);
    useEffect(() => {
        if (!generatorUnlockMountedRef.current) {
            generatorUnlockMountedRef.current = true;
            return;
        }
        if (game.canShowGenerator) {
            const now = Date.now();
            setGeneratorStart(now);
            generatorStartRef.current = now;
            localStorage.setItem("generatorStart", String(now));
        }
    }, [game.canShowGenerator]);

    useEffect(() => {

        const id = setInterval(() => {
            if (!gameRef.current.canShowGenerator) return;
            const now = Date.now();
            const duration = Math.max(Number(gameRef.current.generatorDuration), 40);
            if (duration <= 500) return; // current mode — PE added continuously by game loop
            if (now - generatorStartRef.current >= duration) {
                const missedTicks = Math.floor((now - generatorStartRef.current) / duration);
                const newStart = generatorStartRef.current + missedTicks * duration;
                generatorStartRef.current = newStart;
                setGeneratorStart(newStart);
                localStorage.setItem("generatorStart", String(newStart));
                gameRef.current.setPrestigeEnergy(n => n.plus(gameRef.current.peMulti.times(missedTicks)));
            }
        }, 16);
        return () => clearInterval(id);
    }, []);

    const [toastKey, setToastKey] = useState<number | null>(null);
    const [currentTab, setCurrentTab] = useState("MainTree");

    return (
        <>
            <CurrencyBar game={game}/>
            <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} game={game} />

            <section className="MainTab">
                {currentTab === "MainTree" && <PointTree game={game} upgrades={pointUpgrades} stats={stats}/> }
                {currentTab === "PrestigeTree" && <PrestigeTree game={game} upgrades={prestigeUpgrades} pointUpgrades={pointUpgrades} stats={stats}/> }
                {currentTab === "Achievements" && <AchievementsTab achievements={achievementsHook.achievements} />}
                {currentTab === "Statistics" && <StatisticsTab stats={stats} />}
                {currentTab === "Settings" && <SettingsTab onSave={handleSave} />}
                {currentTab === "Automation" && <AutomationTab game={game} stats={stats} prestigeOneTimeUpgrades={prestigeUpgrades.oneTimeUpgrades} setPrestigeOneTimeUpgrades={prestigeUpgrades.setOneTimeUpgrades} autoEnabled={autoEnabled} setAutoGroup={setAutoGroup} />}
                {currentTab === "Generator" && <GeneratorTab game={game} stats={stats} generatorStart={generatorStart}/>}
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
