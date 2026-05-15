import { useState, useRef, useEffect } from "react";
import type { IAchievement } from "../Models/IAchievement.ts";
import type { Game } from "../Models/Game.ts";
import type { Statistics } from "../Models/Statistics.ts";
import { allAchievements } from "../data/Achievements.ts";

function loadSaved(): { id: number; isUnlocked: boolean }[] | null {
    try {
        return JSON.parse(localStorage.getItem("achievements") ?? "null");
    } catch {
        return null;
    }
}

export function useAchievements() {
    const [achievements, setAchievements] = useState<IAchievement[]>(() => {
        const saved = loadSaved();
        if (!saved) return allAchievements.map(a => ({ ...a }));
        const map = new Map(saved.map(s => [s.id, s.isUnlocked]));
        return allAchievements.map(a => ({ ...a, isUnlocked: map.get(a.id) ?? false }));
    });

    const [popupQueue, setPopupQueue] = useState<IAchievement[]>([]);

    // Tracks which achievements were already unlocked so we don't re-popup saved ones
    const prevUnlockedIds = useRef(
        new Set(achievements.filter(a => a.isUnlocked).map(a => a.id))
    );

    useEffect(() => {
        const newlyUnlocked = achievements.filter(
            a => a.isUnlocked && !prevUnlockedIds.current.has(a.id)
        );
        if (newlyUnlocked.length > 0) {
            setPopupQueue(q => [...q, ...newlyUnlocked]);
        }
        prevUnlockedIds.current = new Set(achievements.filter(a => a.isUnlocked).map(a => a.id));
    }, [achievements]);

    function checkAchievements(game: Game, stats: Statistics) {
        setAchievements(prev => prev.map(a => {
            if (a.isUnlocked) return a;
            if (a.condition(game, stats)) return { ...a, isUnlocked: true };
            return a;
        }));
    }

    function dismissPopup() {
        setPopupQueue(q => q.slice(1));
    }

    return { achievements, checkAchievements, popupQueue, dismissPopup };
}
