import type {Game} from "../Models/Game.ts";
import {fmt_upgrade} from "../data/pointUpgrades.ts";
import "../styles/MultiClicker.css";

interface MultiClickerProps {
    game: Game;
}

const MultiClicker = ({game} : MultiClickerProps) => {
    function handleClick() {
        game.setGlobalPointMultiplier(prev => prev.plus(game.multiPerClick))
    }

    function handleBetterClick() {
        game.setMultiPerClick(prev => prev.times(2))
    }

    return (
        <div className="multiClicker-tab">
            <div className="multiClicker-tab__header">
                <span className="multiClicker-tab__header-icon">✦</span>
                <span>Multi Clicker</span>
            </div>

            <div className="multiClickerCurrencyBar">
                <p className="multiClickerCurrencyBar__label">Current Multi</p>
                <p className="multiClickerCurrencyBar__value">x{fmt_upgrade(game.globalPointMultiplier)}</p>
            </div>

            <div className="multiClicker-button-wrap">
                <button className="multiClickerButton" onClick={handleClick}>
                    <span className="multiClickerButton__plus">+{fmt_upgrade(game.multiPerClick)}</span>
                    <span className="multiClickerButton__label">multi</span>
                </button>
            </div>

            <div className="multiClicker-button-wrap">
                <button className="multiClickerButton" onClick={handleBetterClick}>
                    <span className="multiClickerButton__plus">*2 MPC</span>
                </button>
            </div>

        </div>
    )
}

export default MultiClicker;