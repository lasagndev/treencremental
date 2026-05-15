import "../styles/AchievementsTab.css"
import type { IAchievement } from "../Models/IAchievement.ts";
import type { CSSProperties } from "react";

interface AchievementsTabProps {
    achievements: IAchievement[];
}

function AchievementsTab({ achievements }: AchievementsTabProps) {
    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    const pct = achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0;

    return (
        <section className="achievementsTab">

            <div className="achievementsTab__header">
                <div className="achievementsTab__titleWrap">
                    <h2 className="achievementsTab__title">Achievements</h2>
                    <span className="achievementsTab__subtitle">{unlockedCount} of {achievements.length} unlocked</span>
                </div>
                <div className="achievementsTab__badge">
                    <div className="achievementsTab__badgeInner">
                        {unlockedCount}<span className="achievementsTab__badgeSep">/</span>{achievements.length}
                    </div>
                </div>
            </div>

            <div className="achievementsTab__divider" />

            <div className="achievementsTab__progress">
                <div className="achievementsTab__progressFill" style={{ width: `${pct}%` }} />
            </div>

            <div className="achievementsTab__grid">
                {achievements.map((a, i) => (
                    <div
                        key={a.id}
                        className={`achievementsTab__card ${a.isUnlocked ? 'achievementsTab__card--unlocked' : 'achievementsTab__card--locked'}`}
                        style={{ '--i': i } as CSSProperties}
                    >
                        {a.isUnlocked && <div className="achievementsTab__shimmer" />}
                        {a.isUnlocked && <div className="achievementsTab__holo" />}
                        <div className="achievementsTab__cardInner">
                            <div className="achievementsTab__icon">{a.isUnlocked ? '🏆' : '🔒'}</div>
                            <div className="achievementsTab__name">{a.name}</div>
                            <div className="achievementsTab__desc">
                                {a.isUnlocked ? a.description : '???'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default AchievementsTab;
