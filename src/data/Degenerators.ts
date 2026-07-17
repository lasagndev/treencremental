import type {IDegenerator} from "../Models/IDegenerator.ts";
import Decimal from "break_eternity.js";

const deg1: IDegenerator = {
    id: 1,
    amount: new Decimal(0),
    multiplier: new Decimal(1),
    start: 1,
    interval: 5000,
    amountUpgrade: {
        id: 1,
        description: "Add 1 degenerator",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            amount: deg.amount.plus(1)
        })
    },
    intervalUpgrade: {
        id: 2,
        description: "Make the interval faster",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
           interval: deg.interval / 1.4
        })
    },

    multiplierUpgrade: {
        id: 3,
        description: "multiplier * 1.2",
        price: new Decimal(20),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            multiplier: deg.multiplier.times(1.2)
        })
    }
}

const deg2: IDegenerator = {
    id: 2,
    amount: new Decimal(0),
    multiplier: new Decimal(1),
    start: 1,
    interval: 10000,
    amountUpgrade: {
        id: 1,
        description: "Add 1 degenerator",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            amount: deg.amount.plus(1)
        })
    },
    intervalUpgrade: {
        id: 2,
        description: "Make the interval faster",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            interval: deg.interval / 1.4
        })
    },

    multiplierUpgrade: {
        id: 3,
        description: "multiplier * 1.2",
        price: new Decimal(20),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            multiplier: deg.multiplier.times(1.2)
        })
    }
}

const deg3: IDegenerator = {
    id: 3,
    amount: new Decimal(0),
    multiplier: new Decimal(1),
    start: 1,
    interval: 20000,
    amountUpgrade: {
        id: 1,
        description: "Add 1 degenerator",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            amount: deg.amount.plus(1)
        })
    },
    intervalUpgrade: {
        id: 2,
        description: "Make the interval faster",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            interval: deg.interval / 1.4
        })
    },

    multiplierUpgrade: {
        id: 3,
        description: "multiplier * 1.2",
        price: new Decimal(20),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            multiplier: deg.multiplier.times(1.2)
        })
    }
}

const deg4: IDegenerator = {
    id: 4,
    amount: new Decimal(0),
    multiplier: new Decimal(1),
    start: 1,
    interval: 30000,
    amountUpgrade: {
        id: 1,
        description: "Add 1 degenerator",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            amount: deg.amount.plus(1)
        })
    },
    intervalUpgrade: {
        id: 2,
        description: "Make the interval faster",
        price: new Decimal(2),
        priceMultiplier: new Decimal(12),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            interval: deg.interval / 1.4
        })
    },

    multiplierUpgrade: {
        id: 3,
        description: "multiplier * 1.2",
        price: new Decimal(20),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (deg) => ({
            multiplier: deg.multiplier.times(1.2)
        })
    }
}

// The single source of truth for degenerator definitions.
// Treat this as a read-only template — never mutate these objects directly.
export const defaultDegenerators: IDegenerator[] = [deg1, deg2, deg3, deg4];

export function freshDegenerators(): IDegenerator[] {
    return defaultDegenerators.map(d => ({
        ...d,
        amount: new Decimal(d.amount),
        multiplier: new Decimal(d.multiplier),
        start: Date.now(),
        amountUpgrade: {
            ...d.amountUpgrade,
            price: new Decimal(d.amountUpgrade.price),
            priceMultiplier: new Decimal(d.amountUpgrade.priceMultiplier),
            currentAmount: new Decimal(d.amountUpgrade.currentAmount),
        },
        intervalUpgrade: {
            ...d.intervalUpgrade,
            price: new Decimal(d.intervalUpgrade.price),
            priceMultiplier: new Decimal(d.intervalUpgrade.priceMultiplier),
            currentAmount: new Decimal(d.intervalUpgrade.currentAmount),
        },
        multiplierUpgrade: {
            ...d.multiplierUpgrade,
            price: new Decimal(d.multiplierUpgrade.price),
            priceMultiplier: new Decimal(d.multiplierUpgrade.priceMultiplier),
            currentAmount: new Decimal(d.multiplierUpgrade.currentAmount),
        },
    }));
}