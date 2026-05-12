import type {Game} from "../Models/Game.ts";
import {prestigeUnlock, pUp1} from "../data/pointUpgrades.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade, UpgradePosition} from "../Models/IUpgrade.ts";
import type {usePointUpgrades} from "../Hooks/usePointUpgrades.ts";
import "../styles/PointTree.css"
import {useState, useRef, useEffect} from "react";
import type {CSSProperties} from "react";
import Decimal from "break_eternity.js";
import {fmt} from "./CurrencyBar.tsx";

const UPGRADE_GAP = 160 // px between upgrade nodes

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

interface PointTreeProps {
    game: Game
    upgrades: ReturnType<typeof usePointUpgrades>
}

const PointTree = ( {game, upgrades} : PointTreeProps ) => {
    const { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades, resetUpgrades } = upgrades
    const prestigePointFormula = game.point.log10().dividedBy(15).pow(7).floor()

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

    // Build id → position lookup for SVG line drawing
    const posById: Record<number, UpgradePosition> = { [pUp1.id]: pUp1.position }
    buyableUpgrades.forEach(u => { posById[u.id] = u.position })
    oneTimeUpgrades.forEach(u => { posById[u.id] = u.position })

    function up1() {
        console.log(game.prestigePoint.toFixed(2))
        game.setPoint(n => n.minus(pUp1.price))
        game.setGlobalPointAddition(n => n.plus(1))
        pUp1.isBought = true
    }

    function buyPrestigeUnlock() {
        game.setPoint(n => n.minus(prestigeUnlock.price))
        prestigeUnlock.effect(game)
        prestigeUnlock.isBought = true
    }

    function handlePrestige() {
        game.setPrestigePoint(n => n.plus(prestigePointFormula))

        game.setPoint(_ => new Decimal(10))
        game.setGlobalPointAddition(_ => new Decimal(0))
        game.setGlobalPointMultiplier(_ => new Decimal(1))
        game.setGlobalPointExponent(_ => new Decimal(1))
        game.setGlobalMultiplierMultiplier(_ => new Decimal(1))
        pUp1.isBought = false
        resetUpgrades()

        game.setCanShowPrestigeTree(true)
    }

    function buyOneTime(upg: IOneTimeUpgrade) {
        game.setPoint(n => n.minus(upg.price))
        upg.effect(game)
        setOneTimeUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, isBought: true } : u))
    }

    function getPrice(upg: IBuyableUpgrade) {
        return upg.calcPrice ? upg.calcPrice(upg) : upg.price
    }

    function buyBuyable(upg: IBuyableUpgrade) {
        game.setPoint(n => n.minus(getPrice(upg)))
        upg.effect(game)
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
        // direct children of root are never locked
        if (parentId === pUp1.id) return false
        const parentBuyable = buyableUpgrades.find(u => u.id === parentId)
        if (parentBuyable) return parentBuyable.currentAmount.eq(0)
        const parentOneTime = oneTimeUpgrades.find(u => u.id === parentId)
        if (parentOneTime) return !parentOneTime.isBought
        return false
    }

    function oneTimeClass(upg: IOneTimeUpgrade): string {
        if (isLocked(upg.id)) return 'upgradeButton--locked'
        if (upg.isBought) return 'upgradeButton--maxed'
        if (upg.price.gt(game.point)) return 'upgradeButton--unaffordable'
        return 'upgradeButton--affordable'
    }

    function buyableClass(upg: IBuyableUpgrade): string {
        if (isLocked(upg.id)) return 'upgradeButton--locked'
        if (upg.isMaxed) return 'upgradeButton--maxed'
        if (getPrice(upg).lte(game.point)) return 'upgradeButton--affordable'
        if (upg.currentAmount.gt(0)) return 'upgradeButton--partial'
        return 'upgradeButton--unaffordable'
    }

    function unlockClass(): string {
        if (prestigeUnlock.isBought) return 'upgradeButton--maxed'
        if (prestigeUnlock.price.gt(game.point)) return 'upgradeButton--unaffordable'
        return 'upgradeButton--unlock'
    }

    function rootClass(): string {
        if (pUp1.isBought) return 'upgradeButton--maxed'
        if (pUp1.price.gt(game.point)) return 'upgradeButton--unaffordable'
        return 'upgradeButton--affordable'
    }

    function getConnections(): Array<{ from: number, to: number }> {
        return [...buyableUpgrades, ...oneTimeUpgrades]
            .filter(upg => upg.parentId !== undefined)
            .map(upg => ({ from: upg.parentId!, to: upg.id }))
    }

    function isNodeActive(id: number): boolean {
        if (id === pUp1.id) return pUp1.isBought
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
            className="pointTree"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {prestigeUnlock.isBought && (
                <button
                    className="prestigeButton"
                    onClick={handlePrestige}
                    disabled={game.point.lt(1e15)}>
                    PRESTIGE<br/>
                    for { game.point.gte(1e15) ? prestigePointFormula.toFixed(0) : 0 } PP
                </button>
            )}

            {game.globalPointAddition.gt(0) && <section className={"pointTreeCurrencyBar"}>
                <p>Base point gain: {fmt(game.globalPointAddition)}</p>
                {game.globalPointMultiplier.gt(1) && <p>Point multi: {fmt(game.globalPointMultiplier)}</p>}
                {game.globalPointExponent.gt(1) && <p>Point exponent: {fmt(game.globalPointExponent)}</p>}
            </section>}



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
                    style={getUpgradeStyle(pUp1.position)}
                    onClick={() => up1()}
                    disabled={pUp1.isBought || pUp1.price.gt(game.point)}>
                    <p className={"upgradeId"}>{pUp1.id}</p>
                    {pUp1.description}
                    <br/>
                    Price: {pUp1.price.toFixed(0)}
                </button>

                {(game.point.gte(1e10) || prestigeUnlock.isBought) &&
                    <button
                        id={"prestigeUnlock"}
                        className={`upgradeButton ${unlockClass()}`}
                        style={getUpgradeStyle(prestigeUnlock.position)}
                        onClick={() => buyPrestigeUnlock()}
                        disabled={prestigeUnlock.isBought || prestigeUnlock.price.gt(game.point)}>
                        <p className={"upgradeId"}>{prestigeUnlock.id}</p>
                        {prestigeUnlock.description}
                        <br/>
                        Price: {prestigeUnlock.price.toExponential(2).replace('e+', 'e')}
                    </button>
                }

                {buyableUpgrades.map(upg => (
                    <button
                        key={upg.id}
                        className={`upgradeButton ${buyableClass(upg)}`}
                        style={getUpgradeStyle(upg.position)}
                        onClick={() => buyBuyable(upg)}
                        disabled={upg.isMaxed || getPrice(upg).gt(game.point) || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.dynamicDescription ? upg.dynamicDescription(game) : upg.description}
                        <br/>
                        Price: {getPrice(upg).gte(1e6) ? getPrice(upg).toExponential(2).replace('e+', 'e') : getPrice(upg).toFixed(0) }
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
                        disabled={upg.isBought || upg.price.gt(game.point) || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.dynamicDescription ? upg.dynamicDescription(game) : upg.description}
                        <br/>
                        Price: {upg.price.gte(1e6) ? upg.price.toExponential(2).replace('e+', 'e') : upg.price.toFixed(0)}
                    </button>
                ))}

            </div>
        </section>
    )

}

export default PointTree;
