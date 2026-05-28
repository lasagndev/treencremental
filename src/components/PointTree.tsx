import type {Game} from "../Models/Game.ts";
import {fmt_upgrade, prestigeUnlock, pUp1} from "../data/pointUpgrades.ts";
import {generatorUpgrades} from "./GeneratorTab.tsx";
import type {IBuyableUpgrade, IOneTimeUpgrade, UpgradePosition} from "../Models/IUpgrade.ts";
import type {usePointUpgrades} from "../Hooks/usePointUpgrades.ts";
import "../styles/PointTree.css"
import {useState, useRef, useEffect, type RefObject} from "react";
import type {CSSProperties} from "react";
import Decimal from "break_eternity.js";
import {fmt} from "./CurrencyBar.tsx";
import type {Statistics} from "../Models/Statistics.ts";

const UPGRADE_GAP = 160 // px between upgrade nodes
const SIURY_IDS = new Set([401, 402, 501, 502, 503, 504, 505])

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
    stats: Statistics
    handlePrestigeRef: RefObject<() => void>
}

const PointTree = ( {game, upgrades, stats, handlePrestigeRef} : PointTreeProps ) => {
    const { oneTimeUpgrades, setOneTimeUpgrades, buyableUpgrades, setBuyableUpgrades, resetUpgrades } = upgrades

    let peBoostToPP = game.prestigeEnergy.pow(0.1).pow(generatorUpgrades[3].currentAmount.plus(4).div(6))
    if(peBoostToPP.gte(new Decimal(1e4))) {
        peBoostToPP = new Decimal(3.34e3).times(game.prestigeEnergy.pow(0.1).pow(generatorUpgrades[3].currentAmount.plus(4).div(50)));
    }
    const dynamicPPGain = game.dynamicUpgradeValues[106] ?? new Decimal(1);
    const prestigePointFormula = game.point.log10().dividedBy(15).pow(7).times(game.prestigePointMulti).times(peBoostToPP).times(dynamicPPGain).floor()



    const containerRef = useRef<HTMLElement>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    const [view, setView] = useState({ panX: 0, panY: 0, zoom: 1 })
    const viewRef = useRef(view)
    const isDragging = useRef(false)
    const dragOrigin = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 })
    const pinchOrigin = useRef<{
        dist: number; zoom: number;
        centerX: number; centerY: number;
        panX: number; panY: number;
    } | null>(null)

    const [isBuyMaxMode, setIsBuyMaxMode] = useState(false)

    function handleMaxBuy(upg: IBuyableUpgrade) {
        if (!isBuyMaxMode || SIURY_IDS.has(upg.id)) {
            buyBuyable(upg)
            return
        }

        const singlePrice  = getPrice(upg)
        const remaining    = upg.maxAmount - upg.currentAmount.toNumber()
        let available      = game.point
        let simulatedAmt   = upg.currentAmount
        let simulatedPrice = upg.price
        let totalCost      = new Decimal(0)
        let count          = 0

        if (singlePrice.lte(0)) {
            count = Math.min(remaining, MAX_BUY_BATCH)
        } else {
            while (simulatedAmt.lt(upg.maxAmount) && count < MAX_BUY_BATCH) {
                const price = upg.calcPrice
                    ? upg.calcPrice({ ...upg, currentAmount: simulatedAmt })
                    : simulatedPrice
                if (available.lt(price)) break
                available      = available.minus(price)
                totalCost      = totalCost.plus(price)
                simulatedAmt   = simulatedAmt.plus(1)
                if (!upg.calcPrice) simulatedPrice = simulatedPrice.times(upg.priceMultiplier)
                count++
            }
        }

        if (count === 0) return


        for (let i = 0; i < count; i++) upg.effect(game)

        game.setPoint(n => n.minus(totalCost))
        stats.setTotalUpgradesBought(n => n.plus(count))

        setBuyableUpgrades(prev => prev.map(u => {
            if (u.id !== upg.id) return u
            const newAmount = u.currentAmount.plus(count)
            return {
                ...u,
                ...(u.calcPrice ? {} : { price: u.price.times(u.priceMultiplier.pow(count)) }),
                currentAmount: newAmount,
                isMaxed: newAmount.gte(u.maxAmount),
            }
        }))
    }

    useEffect(() => { viewRef.current = view }, [view])

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

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                isDragging.current = true
                pinchOrigin.current = null
                dragOrigin.current = {
                    mouseX: e.touches[0].clientX,
                    mouseY: e.touches[0].clientY,
                    panX: viewRef.current.panX,
                    panY: viewRef.current.panY,
                }
            } else if (e.touches.length === 2) {
                isDragging.current = false
                const t0 = e.touches[0], t1 = e.touches[1]
                const rect = el.getBoundingClientRect()
                pinchOrigin.current = {
                    dist: Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY),
                    zoom: viewRef.current.zoom,
                    centerX: (t0.clientX + t1.clientX) / 2 - rect.left,
                    centerY: (t0.clientY + t1.clientY) / 2 - rect.top,
                    panX: viewRef.current.panX,
                    panY: viewRef.current.panY,
                }
            }
        }

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault()
            if (e.touches.length === 1 && isDragging.current) {
                const { mouseX, mouseY, panX, panY } = dragOrigin.current
                setView(prev => ({
                    ...prev,
                    panX: panX + e.touches[0].clientX - mouseX,
                    panY: panY + e.touches[0].clientY - mouseY,
                }))
            } else if (e.touches.length === 2 && pinchOrigin.current) {
                const t0 = e.touches[0], t1 = e.touches[1]
                const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
                const { dist: initDist, zoom: initZoom, centerX, centerY, panX, panY } = pinchOrigin.current
                const newZoom = Math.max(0.3, Math.min(3, initZoom * (dist / initDist)))
                const ratio = newZoom / initZoom
                setView({
                    zoom: newZoom,
                    panX: centerX - ratio * (centerX - panX),
                    panY: centerY - ratio * (centerY - panY),
                })
            }
        }

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length === 0) {
                isDragging.current = false
                pinchOrigin.current = null
            } else if (e.touches.length === 1) {
                isDragging.current = true
                pinchOrigin.current = null
                dragOrigin.current = {
                    mouseX: e.touches[0].clientX,
                    mouseY: e.touches[0].clientY,
                    panX: viewRef.current.panX,
                    panY: viewRef.current.panY,
                }
            }
        }

        el.addEventListener('touchstart', onTouchStart, { passive: false })
        el.addEventListener('touchmove', onTouchMove, { passive: false })
        el.addEventListener('touchend', onTouchEnd, { passive: false })
        el.addEventListener('touchcancel', onTouchEnd, { passive: false })
        return () => {
            el.removeEventListener('touchstart', onTouchStart)
            el.removeEventListener('touchmove', onTouchMove)
            el.removeEventListener('touchend', onTouchEnd)
            el.removeEventListener('touchcancel', onTouchEnd)
        }
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
    posById[prestigeUnlock.id] = prestigeUnlock.position

    function up1() {
        console.log(game.prestigePoint.toFixed(2))
        game.setPoint(n => n.minus(pUp1.price))
        game.setGlobalPointAddition(n => n.plus(1))
        stats.setTotalUpgradesBought(n => n.plus(1))
        pUp1.isBought = true
    }

    function buyPrestigeUnlock() {
        game.setPoint(n => n.minus(prestigeUnlock.price))
        prestigeUnlock.effect(game)
        prestigeUnlock.isBought = true
    }

    function handlePrestige() {
        game.setPrestigePoint(n => n.plus(prestigePointFormula))
        stats.setAllPrestigePoints(n => n.plus(prestigePointFormula))
        // TypeScript suck my balls

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        game.setPoint(_ => new Decimal(10))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        game.setGlobalPointAddition(_ => new Decimal(1).plus(game.pointGainFromPrestige))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        game.setGlobalPointMultiplier(_ => new Decimal(1).times(game.pointMultiFromPrestige))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        game.setGlobalPointExponent(_ => new Decimal(1).times(game.pointExponentFromPrestige))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        game.setGlobalMultiplierMultiplier(_ => new Decimal(1).times(game.pointMultiFromPrestige))
        resetUpgrades()
        stats.setTotalPrestiges(n => n.plus(1))
        game.setCanShowPrestigeTree(true)
    }

    function buyOneTime(upg: IOneTimeUpgrade) {
        game.setPoint(n => n.minus(upg.price))
        upg.effect(game)
        stats.setTotalUpgradesBought(n => n.plus(1))
        setOneTimeUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, isBought: true } : u))
    }

    function getPrice(upg: IBuyableUpgrade) {
        return upg.calcPrice ? upg.calcPrice(upg) : upg.price
    }

    const MAX_BUY_BATCH = 10_000

    function getBuyMaxInfo(upg: IBuyableUpgrade): { cost: Decimal, count: number } {
        const singlePrice = getPrice(upg)
        const remaining   = upg.maxAmount - upg.currentAmount.toNumber()

        // Free upgrades: no loop needed, just cap at batch limit
        if (singlePrice.lte(0)) {
            return { cost: new Decimal(0), count: Math.min(remaining, MAX_BUY_BATCH) }
        }

        let available      = game.point
        let simulatedAmt   = upg.currentAmount
        let simulatedPrice = upg.price
        let totalCost      = new Decimal(0)
        let count          = 0

        while (simulatedAmt.lt(upg.maxAmount) && count < MAX_BUY_BATCH) {
            const price = upg.calcPrice
                ? upg.calcPrice({ ...upg, currentAmount: simulatedAmt })
                : simulatedPrice
            if (available.lt(price)) break
            available      = available.minus(price)
            totalCost      = totalCost.plus(price)
            simulatedAmt   = simulatedAmt.plus(1)
            if (!upg.calcPrice) simulatedPrice = simulatedPrice.times(upg.priceMultiplier)
            count++
        }

        // If we can't afford any, fall back to showing the next single price
        return { cost: count > 0 ? totalCost : singlePrice, count }
    }

    function buyBuyable(upg: IBuyableUpgrade) {
        game.setPoint(n => n.minus(getPrice(upg)))
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

    function isVisible(upg: { whenCanShow?: string }): boolean {
        if (!upg.whenCanShow) return true
        if (upg.whenCanShow === 'prestige') return game.canShowPrestigeTree
        return true
    }

    function getConnections(): Array<{ from: number, to: number }> {
        const connections = [...buyableUpgrades, ...oneTimeUpgrades]
            .filter(upg => upg.parentId !== undefined && isVisible(upg))
            .map(upg => ({ from: upg.parentId!, to: upg.id }))
        if (prestigeUnlock.parentId !== undefined && (game.point.gte(1e10) || prestigeUnlock.isBought))
            connections.push({ from: prestigeUnlock.parentId, to: prestigeUnlock.id })
        return connections
    }

    function isNodeActive(id: number): boolean {
        if (id === pUp1.id) return pUp1.isBought
        if (id === prestigeUnlock.id) return prestigeUnlock.isBought
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

    // eslint-disable-next-line react-hooks/refs
    handlePrestigeRef.current = handlePrestige

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
                    for { game.point.gte(1e15) ? fmt(prestigePointFormula) : 0 } PP
                </button>
            )}

            {game.globalPointAddition.gt(0) && <section className={"pointTreeCurrencyBar"}>
                <p>Base point gain: {fmt_upgrade(game.globalPointAddition)}</p>
                {game.globalPointMultiplier.gt(1) && <p>Point multi: {fmt_upgrade(game.globalPointMultiplier)}</p>}
                {game.globalPointExponent.gt(1) && <p>Point exponent: {fmt_upgrade(game.globalPointExponent)}</p>}
            </section>}


            { game.canShowPrestigeTree && <button className="bulkBuyButton" onClick={() => { setIsBuyMaxMode(n => !n) }}>
                { isBuyMaxMode && <span className="bulkBuyButton__label">Buy max</span>}
                { !isBuyMaxMode && <span className="bulkBuyButton__label">Buy 1</span>}
            </button>}




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
                        Price: {fmt(prestigeUnlock.price)}
                    </button>
                }

                {buyableUpgrades.filter(isVisible).map(upg => {
                    const isSiury = SIURY_IDS.has(upg.id)
                    const { cost, count } = (isBuyMaxMode && !isSiury) ? getBuyMaxInfo(upg) : { cost: getPrice(upg), count: 1 }
                    const descText = (isBuyMaxMode && !isSiury && count > 1 && upg.bulkDescription)
                        ? upg.bulkDescription(count, game)
                        : (upg.dynamicDescription ? upg.dynamicDescription(game) : upg.description)
                    return (
                        <button
                            key={upg.id}
                            className={`upgradeButton ${buyableClass(upg)}`}
                            style={getUpgradeStyle(upg.position)}
                            onClick={() => handleMaxBuy(upg)}
                            disabled={upg.isMaxed || getPrice(upg).gt(game.point) || isLocked(upg.id)}>
                            <p className={"upgradeId"}>{upg.id}</p>
                            {descText}
                            <br/>
                            Price: {fmt(cost)}{isBuyMaxMode && !isSiury && count > 1 ? ` ×${count}` : ''}
                            <br/>
                            {upg.currentAmount.toFixed(0)}/{upg.maxAmount}
                        </button>
                    )
                })}

                {oneTimeUpgrades.filter(isVisible).map(upg => (
                    <button
                        key={upg.id}
                        className={`upgradeButton ${oneTimeClass(upg)}`}
                        style={getUpgradeStyle(upg.position)}
                        onClick={() => buyOneTime(upg)}
                        disabled={upg.isBought || upg.price.gt(game.point) || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.dynamicDescription ? upg.dynamicDescription(game) : upg.description}
                        <br/>
                        Price: {fmt(upg.price)}
                    </button>
                ))}

            </div>
        </section>
    )

}

export default PointTree;
