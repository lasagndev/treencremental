import type {Game} from "../Models/Game.ts";
import "../styles/VoidMilestones.css"
import Decimal from "break_eternity.js";
import {fmt} from "./CurrencyBar.tsx";
import {Fragment} from "react";
import type {CSSProperties} from "react";

const COLUMNS = 4

export interface IMilestone {
    id: number
    goal: Decimal          // threshold on the tracked currency
    description: string    // what the milestone grants, shown once reached
    lockedDescription?: string // optional hint shown while still locked, falls back to "???"
}

// Default chain of 10 milestones, in order.
// Swap goal/description values to whatever progression makes sense in-game.
const DEFAULT_MILESTONES: IMilestone[] = [
    { id: 1,  goal: new Decimal(1e2),  description: "The void stirs." },
    { id: 2,  goal: new Decimal(1e4),  description: "+10% point gain." },
    { id: 3,  goal: new Decimal(1e6),  description: "+25% point gain." },
    { id: 4,  goal: new Decimal(1e8),  description: "Unlocks negation tree." },
    { id: 5,  goal: new Decimal(1e10), description: "+50% point gain." },
    { id: 6,  goal: new Decimal(1e13), description: "Point exponent +0.05." },
    { id: 7,  goal: new Decimal(1e16), description: "+100% point gain." },
    { id: 8,  goal: new Decimal(1e20), description: "Point exponent +0.1." },
    { id: 9,  goal: new Decimal(1e25), description: "+200% point gain." },
    { id: 10, goal: new Decimal(1e30), description: "The void is sated." },
]

interface VoidMilestonesProps {
    game: Game
    milestones?: IMilestone[]
    // which Decimal on `game` gates progression — defaults to game.point
    currencyValue?: Decimal
    currencyLabel?: string
}

function chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = []
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
    return out
}

const VoidMilestones = ({
                            game,
                            milestones = DEFAULT_MILESTONES,
                            currencyValue,
                            currencyLabel = "Progress",
                        }: VoidMilestonesProps) => {

    const tracked = currencyValue ?? game.point

    function isReached(m: IMilestone): boolean {
        return tracked.gte(m.goal)
    }

    // fill % for a milestone: progress through the segment from the previous
    // milestone's goal up to this one's goal (0% at prev goal, 100% at this goal)
    function getFillPercent(m: IMilestone, index: number): number {
        if (isReached(m)) return 100
        const prevGoal = index > 0 ? milestones[index - 1].goal : new Decimal(0)
        const span = m.goal.minus(prevGoal)
        if (span.lte(0)) return tracked.gte(m.goal) ? 100 : 0
        const progressed = tracked.minus(prevGoal)
        if (progressed.lte(0)) return 0
        const pct = progressed.div(span).times(100)
        return Math.max(0, Math.min(99, pct.toNumber())) // cap below 100 until truly reached
    }

    // the first not-yet-reached milestone in order — gets the pulse highlight
    const nextMilestoneId = milestones.find(m => !isReached(m))?.id

    function milestoneClass(m: IMilestone): string {
        if (isReached(m)) return 'milestoneNode--reached'
        if (m.id === nextMilestoneId) return 'milestoneNode--next'
        return 'milestoneNode--locked'
    }

    const rows = chunk(milestones, COLUMNS)

    return (
        <section className="voidMilestones">
            <section className="voidMilestonesCurrencyBar">
                <p>{currencyLabel}: {fmt(tracked)}</p>
                {nextMilestoneId !== undefined && (
                    <p>Next: {fmt(milestones.find(m => m.id === nextMilestoneId)!.goal)}</p>
                )}
            </section>

            <div className="milestoneGrid">
                {rows.map((row, rowIndex) => {
                    const isLastRow = rowIndex === rows.length - 1
                    // the connector after this row is "active" if the last node in the row is reached
                    const lastInRow = row[row.length - 1]
                    const rowConnectorActive = isReached(lastInRow)

                    return (
                        <Fragment key={`row-${rowIndex}`}>
                            <div className="milestoneRow">
                                {row.map((m, i) => {
                                    const globalIndex = rowIndex * COLUMNS + i
                                    const reached = isReached(m)
                                    const fillPercent = getFillPercent(m, globalIndex)
                                    return (
                                        <Fragment key={m.id}>
                                            {i > 0 && (
                                                <div
                                                    className={`milestoneConnector ${isReached(row[i - 1]) ? 'milestoneConnector--active' : ''}`}
                                                />
                                            )}
                                            <div
                                                className={`milestoneNode ${milestoneClass(m)}`}
                                                style={{ '--fillPercent': `${fillPercent}%` } as CSSProperties}
                                            >
                                                <p className="milestoneId">{m.id}</p>
                                                <p className="milestoneDesc">
                                                    {reached ? m.description : (m.lockedDescription ?? "???")}
                                                </p>
                                                <p className="milestoneGoal">
                                                    {reached ? "Unlocked" : `${fillPercent.toFixed(0)}% · ${fmt(m.goal)}`}
                                                </p>
                                            </div>
                                        </Fragment>
                                    )
                                })}
                            </div>

                            {!isLastRow && (
                                <div className="milestoneConnectorWrap">
                                    <div
                                        className={`milestoneConnector milestoneConnector--vertical ${rowConnectorActive ? 'milestoneConnector--active' : ''}`}
                                    />
                                </div>
                            )}
                        </Fragment>
                    )
                })}
            </div>
        </section>
    )
}

export default VoidMilestones
