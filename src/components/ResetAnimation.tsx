import { useEffect } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import "../styles/ResetAnimation.css";

export type ResetAnimType = "prestige" | "void";

export interface ResetAnimState {
    type: ResetAnimType;
    key: number;
}

interface Props {
    anim: ResetAnimState | null;
    onDone: () => void;
}

const DURATIONS: Record<ResetAnimType, number> = {
    prestige: 1300,
    void: 2700,
};

function withIndex(i: number): CSSProperties {
    return { "--i": i } as CSSProperties;
}

const ResetAnimation = ({ anim, onDone }: Props) => {
    useEffect(() => {
        if (!anim) return;
        // onDone intentionally excluded: App re-renders far more often than the
        // animation's lifetime, and a fresh inline callback each render would
        // otherwise keep restarting this timer before it ever fires.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const t = setTimeout(onDone, DURATIONS[anim.type]);
        return () => clearTimeout(t);
    }, [anim]);

    if (!anim) return null;

    if (anim.type === "prestige") {
        return createPortal(
            <div className="resetAnim resetAnim--prestige" key={anim.key}>
                <div className="resetAnim__flash" />
                <div className="resetAnim__ring resetAnim__ring--1" />
                <div className="resetAnim__ring resetAnim__ring--2" />
                <div className="resetAnim__particles">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <span key={i} className="resetAnim__particle" style={withIndex(i)} />
                    ))}
                </div>
                <div className="resetAnim__label resetAnim__label--prestige">Prestige</div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="resetAnim resetAnim--void" key={anim.key}>
            <div className="resetAnim__vignette" />
            <div className="resetAnim__vortex" />
            <div className="resetAnim__glitchBars">
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="resetAnim__glitchBar" style={withIndex(i)} />
                ))}
            </div>
            <div className="resetAnim__shock resetAnim__shock--1" />
            <div className="resetAnim__shock resetAnim__shock--2" />
            <div className="resetAnim__shock resetAnim__shock--3" />
            <div className="resetAnim__ash">
                {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="resetAnim__ashParticle" style={withIndex(i)} />
                ))}
            </div>
            <div className="resetAnim__label resetAnim__label--void">Void</div>
        </div>,
        document.body
    );
};

export default ResetAnimation;
