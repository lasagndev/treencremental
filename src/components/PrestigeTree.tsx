import type {Game} from "../Models/Game.ts";
import {ppUp1} from "../data/prestigeUpgrades.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade, UpgradePosition} from "../Models/IUpgrade.ts";
import type {usePrestigeUpgrades} from "../Hooks/usePrestigeUpgrades.ts";
import "../styles/PrestigeTree.css"
import {useState, useRef, useEffect} from "react";
import type {CSSProperties} from "react";
import {fmt} from "./CurrencyBar.tsx";
import type {Statistics} from "../Models/Statistics.ts";

const UPGRADE_GAP = 160

function getUpgradeStyle(pos: UpgradePosition): CSSProperties {
    return {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: `calc(50% + ${pos.y * UPGRADE_GAP}px)`,
        left: `calc(50% + ${pos.x * UPGRADE_GAP}px)`,
        margin: 0,
    }
}

function getUpgradeCenter(pos: UpgradePosition, w: number, h: number): { x: number, y: number } {
    return {
        x: w / 2 + pos.x * UPGRADE_GAP,
        y: h / 2 + pos.y * UPGRADE_GAP,
    }
}

interface PrestigeTreeProps {
    game: Game
    upgrades: ReturnType<typeof usePrestigeUpgrades>
    stats: Statistics
}

const PrestigeTree = ({ game, upgrades, stats }: PrestigeTreeProps) => {
    const { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades } = upgrades

    const containerRef = useRef<HTMLElement>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [view, setView] = useState({ panX: 0, panY: 0, zoom: 1 })
    const isDragging = useRef(false)
    const dragOrigin = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 })

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const observer = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            setContainerSize({ width, height })
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const rect = containerRef.current!.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top
            setView(prev => {
                const factor = e.deltaY < 0 ? 1.1 : 0.9
                const newZoom = Math.max(0.3, Math.min(3, prev.zoom * factor))
                const ratio = newZoom / prev.zoom
                return {
                    panX: mouseX - ratio * (mouseX - prev.panX),
                    panY: mouseY - ratio * (mouseY - prev.panY),
                    zoom: newZoom,
                }
            })
        }
        el.addEventListener('wheel', onWheel, { passive: false })
        return () => el.removeEventListener('wheel', onWheel)
    }, [])

    function handleMouseDown(e: React.MouseEvent) {
        if (e.button !== 0) return
        if ((e.target as HTMLElement).closest('.upgradeButton')) return
        isDragging.current = true
        dragOrigin.current = { mouseX: e.clientX, mouseY: e.clientY, panX: view.panX, panY: view.panY }
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (!isDragging.current) return
        setView(prev => ({
            ...prev,
            panX: dragOrigin.current.panX + e.clientX - dragOrigin.current.mouseX,
            panY: dragOrigin.current.panY + e.clientY - dragOrigin.current.mouseY,
        }))
    }

    function handleMouseUp() {
        isDragging.current = false
    }

    const posById: Record<number, UpgradePosition> = { [ppUp1.id]: ppUp1.position }
    buyableUpgrades.forEach(u => { posById[u.id] = u.position })
    oneTimeUpgrades.forEach(u => { posById[u.id] = u.position })

    function buyRoot() {
        game.setPrestigePoint(n => n.minus(ppUp1.price))
        stats.setTotalUpgradesBought(n => n.plus(1))
        ppUp1.effect(game)
        ppUp1.isBought = true
    }

    function buyOneTime(upg: IOneTimeUpgrade) {
        game.setPrestigePoint(n => n.minus(upg.price))
        upg.effect(game)
        stats.setTotalUpgradesBought(n => n.plus(1))
        setOneTimeUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, isBought: true } : u))
    }

    function getPrice(upg: IBuyableUpgrade) {
        return upg.calcPrice ? upg.calcPrice(upg) : upg.price
    }

    function buyBuyable(upg: IBuyableUpgrade) {
        game.setPrestigePoint(n => n.minus(getPrice(upg)))
        upg.effect(game)
        stats.setTotalUpgradesBought(n => n.plus(1))
        setBuyableUpgrades(prev => prev.map(u => u.id === upg.id ? {
            ...u,
            ...(u.calcPrice ? {} : { price: u.price.times(u.priceMultiplier) }),
            currentAmount: u.currentAmount.plus(1),
            isMaxed: u.currentAmount.plus(1).eq(u.maxAmount)
        } : u))
    }

    function isLocked(id: number): boolean {
        const upg = [...buyableUpgrades, ...oneTimeUpgrades].find(u => u.id === id)
        if (!upg || upg.parentId === undefined) return false
        const { parentId } = upg
        if (parentId === ppUp1.id) return false
        const parentBuyable = buyableUpgrades.find(u => u.id === parentId)
        if (parentBuyable) return parentBuyable.currentAmount.eq(0)
        const parentOneTime = oneTimeUpgrades.find(u => u.id === parentId)
        if (parentOneTime) return !parentOneTime.isBought
        return false
    }

    function rootClass(): string {
        if (ppUp1.isBought) return 'upgradeButton--maxed'
        if (ppUp1.price.gt(game.prestigePoint)) return 'upgradeButton--unaffordable'
        return 'upgradeButton--affordable'
    }

    function oneTimeClass(upg: IOneTimeUpgrade): string {
        if (isLocked(upg.id)) return 'upgradeButton--locked'
        if (upg.isBought) return 'upgradeButton--maxed'
        if (upg.price.gt(game.prestigePoint)) return 'upgradeButton--unaffordable'
        return 'upgradeButton--affordable'
    }

    function buyableClass(upg: IBuyableUpgrade): string {
        if (isLocked(upg.id)) return 'upgradeButton--locked'
        if (upg.isMaxed) return 'upgradeButton--maxed'
        if (getPrice(upg).lte(game.prestigePoint)) return 'upgradeButton--affordable'
        if (upg.currentAmount.gt(0)) return 'upgradeButton--partial'
        return 'upgradeButton--unaffordable'
    }

    function getConnections(): Array<{ from: number, to: number }> {
        return [...buyableUpgrades, ...oneTimeUpgrades]
            .filter(upg => upg.parentId !== undefined)
            .map(upg => ({ from: upg.parentId!, to: upg.id }))
    }

    function isNodeActive(id: number): boolean {
        if (id === ppUp1.id) return ppUp1.isBought
        const buyable = buyableUpgrades.find(u => u.id === id)
        if (buyable) return buyable.currentAmount.gt(0)
        const oneTime = oneTimeUpgrades.find(u => u.id === id)
        if (oneTime) return oneTime.isBought
        return false
    }

    function getLineState(from: number, to: number): 'locked' | 'active' | 'default' {
        if (isLocked(to)) return 'locked'
        if (isNodeActive(from) && isNodeActive(to)) return 'active'
        return 'default'
    }

    const { width, height } = containerSize

    return (
        <section
            className="prestigeTree"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <section className="prestigeTreeCurrencyBar">
                <p>Prestige Points: {fmt(game.prestigePoint)}</p>
            </section>

            <div className="upgradeCanvas" style={{ transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})` }}>

                {width > 0 && (
                    <svg className="upgradeSvg" overflow="visible">
                        {getConnections().map(({ from, to }) => {
                            const a = getUpgradeCenter(posById[from], width, height)
                            const b = getUpgradeCenter(posById[to], width, height)
                            const state = getLineState(from, to)
                            return (
                                <g key={`${from}-${to}`} className={`upgradeLine upgradeLine--${state}`}>
                                    <line className="upgradeLine__tube" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                                    <line className="upgradeLine__core" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                                    {state === 'active' && (
                                        <line className="upgradeLine__dash" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                )}

                <button
                    id={"rootUpgrade"}
                    className={`upgradeButton ${rootClass()}`}
                    style={getUpgradeStyle(ppUp1.position)}
                    onClick={() => buyRoot()}
                    disabled={ppUp1.isBought || ppUp1.price.gt(game.prestigePoint)}>
                    <p className={"upgradeId"}>{ppUp1.id}</p>
                    {ppUp1.description}
                    <br/>
                    Price: {fmt(ppUp1.price)} PP
                </button>

                {buyableUpgrades.map(upg => (
                    <button
                        key={upg.id}
                        className={`upgradeButton ${buyableClass(upg)}`}
                        style={getUpgradeStyle(upg.position)}
                        onClick={() => buyBuyable(upg)}
                        disabled={upg.isMaxed || getPrice(upg).gt(game.prestigePoint) || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.dynamicDescription ? upg.dynamicDescription(game) : upg.description}
                        <br/>
                        Price: {fmt(getPrice(upg))} PP
                        <br/>
                        {upg.currentAmount.toFixed(0)}/{upg.maxAmount}
                    </button>
                ))}

                {oneTimeUpgrades.map(upg => (
                    <button
                        key={upg.id}
                        className={`upgradeButton ${oneTimeClass(upg)}`}
                        style={getUpgradeStyle(upg.position)}
                        onClick={() => buyOneTime(upg)}
                        disabled={upg.isBought || upg.price.gt(game.prestigePoint) || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.dynamicDescription ? upg.dynamicDescription(game) : upg.description}
                        <br/>
                        Price: {fmt(upg.price)} PP
                    </button>
                ))}

            </div>
        </section>
    )
}

export default PrestigeTree;
