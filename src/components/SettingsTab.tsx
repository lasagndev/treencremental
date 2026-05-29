import { useRef } from "react";
import "../styles/SettingsTab.css"
import {resetSave, exportSave, importSave} from "../Hooks/useSaveSystem.ts";
import type {Game} from "../Models/Game.ts";

interface Props {
    onSave: () => void
    game: Game
}

function SettingsTab({ onSave, game }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <section className="settingsTab">
            <h2 className="settingsTab__title">Settings</h2>
            <div className="settingsTab__group">
                <button className="settingsTab__btn" onClick={onSave}>
                    Save
                </button>
                <button className="settingsTab__btn" onClick={exportSave}>
                    Export Save
                </button>
                <button className="settingsTab__btn" onClick={() => fileInputRef.current?.click()}>
                    Import Save
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".sav"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) importSave(file);
                    }}
                />
                <button
                    className="settingsTab__btn settingsTab__btn--danger"
                    onClick={() => { if (window.confirm("Reset all progress? This cannot be undone.")) resetSave(); }}>
                    Reset Save
                </button>
            </div>

            <br/>

            <h2 className="settingsTab__title">Keybinds</h2>
            <div className="settingsTab__keybinds">
                <div className="settingsTab__keybind">
                    <kbd className="settingsTab__key">1</kbd>
                    <span>Main tree</span>
                </div>
                {game.canShowPrestigeTree && <>
                    <div className="settingsTab__keybind">
                        <kbd className="settingsTab__key">2</kbd>
                        <span>Prestige tree</span>
                    </div>
                    <div className="settingsTab__keybind">
                        <kbd className="settingsTab__key">3</kbd>
                        <span>Automation</span>
                    </div>
                    <div className="settingsTab__keybind">
                        <kbd className="settingsTab__key">P</kbd>
                        <span>Prestige</span>
                    </div>
                </>}
                {game.canShowGenerator &&
                    <div className="settingsTab__keybind">
                        <kbd className="settingsTab__key">4</kbd>
                        <span>Generator</span>
                    </div>
                }
            </div>

        </section>
    )
}

export default SettingsTab;
