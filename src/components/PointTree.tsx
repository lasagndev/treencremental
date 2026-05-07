import type {Game} from "../Models/Game.ts";
import {pUp1} from "../data/pointUpgrades.ts";
import type {IBuyableUpgrade, IOneTimeUpgrade} from "../Models/IUpgrade.ts";
import type {usePointUpgrades} from "../Hooks/usePointUpgrades.ts";
import "../styles/PointTree.css"
import {useState, useRef, useEffect} from "react";
import type {CSSProperties} from "react";

const UPGRADE_GAP = 160 // px between upgrade steps

function getUpgradeStyle(id: number): CSSProperties {
    const category = Math.floor(id / 100)
    const step = id % 100
    const base: CSSProperties = {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        margin: 0,
    }
    switch (category) {
        case 1: return { ...base, left: `calc(50% - ${step * UPGRADE_GAP}px)` }
        case 2: return { ...base, left: `calc(50% + ${step * UPGRADE_GAP}px)` }
        case 3: return { ...base, top:  `calc(50% + ${step * UPGRADE_GAP}px)` }
        case 4: return { ...base, top:  `calc(50% - ${step * UPGRADE_GAP}px)` }
        default: return base
    }
}

function getUpgradeCenter(id: number, w: number, h: number): { x: number, y: number } {
    const category = Math.floor(id / 100)
    const step = id % 100
    const cx = w / 2
    const cy = h / 2
    switch (category) {
        case 1: return { x: cx - step * UPGRADE_GAP, y: cy }
        case 2: return { x: cx + step * UPGRADE_GAP, y: cy }
        case 3: return { x: cx,                      y: cy + step * UPGRADE_GAP }
        case 4: return { x: cx,                      y: cy - step * UPGRADE_GAP }
        default: return { x: cx, y: cy }
    }
}

interface PointTreeProps {
    game: Game
    upgrades: ReturnType<typeof usePointUpgrades>
}

const PointTree = ( {game, upgrades} : PointTreeProps ) => {
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



    function up1() {
        game.setPoint(n => n - pUp1.price)
        game.setGlobalPointAddition(n => n + 1)
        pUp1.isBought = true
    }

    function buyOneTime(upg: IOneTimeUpgrade) {
        game.setPoint(n => n - upg.price)
        upg.effect(game)
        setOneTimeUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, isBought: true } : u))
    }

    function buyBuyable(upg: IBuyableUpgrade) {
        const currentPrice = upg.price
        game.setPoint(n => n - currentPrice)
        upg.effect(game)
        setBuyableUpgrades(prev => prev.map(u => u.id === upg.id ? {
            ...u,
            price: u.price * u.priceMultiplier,
            currentAmount: u.currentAmount + 1,
            isMaxed: u.currentAmount + 1 === u.maxAmount
        } : u))
    }

    function isLocked(id: number): boolean {
        const step = id % 100
        if (step <= 1) return false
        const prevId = id - 1
        const prevBuyable = buyableUpgrades.find(u => u.id === prevId)
        if (prevBuyable) return prevBuyable.currentAmount === 0
        const prevOneTime = oneTimeUpgrades.find(u => u.id === prevId)
        if (prevOneTime) return !prevOneTime.isBought
        return false
    }

    function oneTimeClass(upg: IOneTimeUpgrade): string {
        if (isLocked(upg.id)) return 'upgradeButton--locked'
        if (upg.isBought) return 'upgradeButton--maxed'
        if (upg.price > game.point) return 'upgradeButton--unaffordable'
        return 'upgradeButton--affordable'
    }

    function buyableClass(upg: IBuyableUpgrade): string {
        if (isLocked(upg.id)) return 'upgradeButton--locked'
        if (upg.isMaxed) return 'upgradeButton--maxed'
        if (upg.price <= game.point) return 'upgradeButton--affordable'
        if (upg.currentAmount > 0) return 'upgradeButton--partial'
        return 'upgradeButton--unaffordable'
    }

    function rootClass(): string {
        if (pUp1.isBought) return 'upgradeButton--maxed'
        if (pUp1.price > game.point) return 'upgradeButton--unaffordable'
        return 'upgradeButton--affordable'
    }

    function getConnections(): Array<{ from: number, to: number }> {
        const allMapped = [...buyableUpgrades, ...oneTimeUpgrades]
        return allMapped.map(upg => ({
            from: upg.id % 100 === 1 ? pUp1.id : upg.id - 1,
            to: upg.id,
        }))
    }

    function isNodeActive(id: number): boolean {
        if (id === pUp1.id) return pUp1.isBought
        const buyable = buyableUpgrades.find(u => u.id === id)
        if (buyable) return buyable.currentAmount > 0
        const oneTime = oneTimeUpgrades.find(u => u.id === id)
        if (oneTime) return oneTime.isBought
        return false
    }

    function getLineState(from: number, to: number): 'locked' | 'active' | 'default' {
        if (isLocked(to)) return 'locked'
        if (isNodeActive(from)) return 'active'
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

            {game.globalPointAddition > 0 && <section className={"pointTreeCurrencyBar"}>
                <p>Base point gain: {game.globalPointAddition}</p>
                {game.globalPointMultiplier > 1 && <p>Point multi: {game.globalPointMultiplier.toFixed(1)}</p>}
                {game.globalPointExponent > 1 && <p>Point exponent: {game.globalPointExponent}</p>}
            </section>}

            <div className="upgradeCanvas" style={{ transform: `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})` }}>

                {width > 0 && (
                    <svg className="upgradeSvg">
                        {getConnections().map(({ from, to }) => {
                            const a = getUpgradeCenter(from, width, height)
                            const b = getUpgradeCenter(to, width, height)
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
                    style={getUpgradeStyle(pUp1.id)}
                    onClick={() => up1()}
                    disabled={pUp1.isBought || pUp1.price > game.point}>
                    <p className={"upgradeId"}>{pUp1.id}</p>
                    {pUp1.description}
                    <br/>
                    Price: {pUp1.price}
                </button>

                {buyableUpgrades.map(upg => (
                    <button
                        key={upg.id}
                        className={`upgradeButton ${buyableClass(upg)}`}
                        style={getUpgradeStyle(upg.id)}
                        onClick={() => buyBuyable(upg)}
                        disabled={upg.isMaxed || upg.price > game.point || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.description}
                        <br/>
                        Price: {Math.round(upg.price)}
                        <br/>
                        {upg.currentAmount}/{upg.maxAmount}
                    </button>
                ))}

                {oneTimeUpgrades.map(upg => (
                    <button
                        key={upg.id}
                        className={`upgradeButton ${oneTimeClass(upg)}`}
                        style={getUpgradeStyle(upg.id)}
                        onClick={() => buyOneTime(upg)}
                        disabled={upg.isBought || upg.price > game.point || isLocked(upg.id)}>
                        <p className={"upgradeId"}>{upg.id}</p>
                        {upg.description}
                        <br/>
                        Price: {upg.price}
                    </button>
                ))}

            </div>
        </section>
    )

}

export default PointTree;
