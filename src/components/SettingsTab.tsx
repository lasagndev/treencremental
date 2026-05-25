import { useRef } from "react";
import "../styles/SettingsTab.css"
import {resetSave, exportSave, importSave} from "../Hooks/useSaveSystem.ts";

interface Props {
    onSave: () => void
}

function SettingsTab({ onSave }: Props) {
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
        </section>
    )
}

export default SettingsTab;
