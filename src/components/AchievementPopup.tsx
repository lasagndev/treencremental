import { useEffect } from "react";
import type { IAchievement } from "../Models/IAchievement.ts";

interface Props {
    achievement: IAchievement;
    onDone: () => void;
}

function AchievementPopup({ achievement, onDone }: Props) {
    useEffect(() => {
        const t = setTimeout(onDone, 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="achievement-popup">
            <div className="achievement-popup__label">Achievement Unlocked!</div>
            <div className="achievement-popup__name">{achievement.name}</div>
            <div className="achievement-popup__desc">{achievement.description}</div>
            <div className="achievement-popup__bar" />
        </div>
    );
}

export default AchievementPopup;
