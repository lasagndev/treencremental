import "../styles/SettingsTab.css"
import {resetSave} from "../Hooks/useSaveSystem.ts";

interface Props {
    onSave: () => void
}

function SettingsTab({ onSave }: Props) {
    return (
        <section className="settingsTab">
            <h2 className="settingsTab__title">Settings</h2>
            <div className="settingsTab__group">
                <button className="settingsTab__btn" onClick={onSave}>
                    Save
                </button>
                <button
                    className="settingsTab__btn settingsTab__btn--danger"
                    onClick={() => { if (window.confirm("Reset all progress? This cannot be undone.")) resetSave(); }}>
                    Reset Save
                </button>
            </div>
        </section>
    )
}

export default SettingsTab;
