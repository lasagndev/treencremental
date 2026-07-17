import type Decimal from "break_eternity.js";
import type {IDegeneratorUpgrade} from "./IUpgrade.ts";

export interface IDegenerator {
    id: number,
    amount: Decimal,
    multiplier: Decimal,
    start: number,
    interval: number,
    amountUpgrade: IDegeneratorUpgrade,
    intervalUpgrade: IDegeneratorUpgrade,
    multiplierUpgrade: IDegeneratorUpgrade,
}


