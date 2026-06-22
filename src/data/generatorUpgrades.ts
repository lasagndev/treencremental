// data/generatorUpgrades.ts
import Decimal from "break_eternity.js";
import type { Game } from "../Models/Game.ts";
import type { IBuyableUpgrade } from "../Models/IUpgrade.ts";

// The single source of truth for generator upgrade definitions.
// Treat this as a read-only template — never mutate these objects directly.
// eslint-disable-next-line react-refresh/only-export-components
export const defaultGeneratorUpgrades: IBuyableUpgrade[] = [
    {
        id: 1,
        description: "Generator interval /1.3",
        price: new Decimal(1000),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (game: Game) => {
            game.setGeneratorDuration(n => n / 1.3);
        },
        position: { x: 0, y: 0 },
        maxAmount: 0,
        isBought: false,
    },
    {
        id: 2,
        description: "Prestige Energy gain *2",
        price: new Decimal(1000),
        priceMultiplier: new Decimal(2),
        currentAmount: new Decimal(0),
        effect: (game: Game) => {
            game.setPeMulti(n => n.times(2));
        },
        position: { x: 0, y: 0 },
        maxAmount: 0,
        isBought: false,
    },
    {
        id: 3,
        description: "Improve P boost formula",
        price: new Decimal(100),
        priceMultiplier: new Decimal(10),
        currentAmount: new Decimal(0),
        effect: (game: Game) => {
            game.setPeBoostToP(n => n.plus(1));
        },
        position: { x: 0, y: 0 },
        maxAmount: 0,
        isBought: false,
    },
    {
        id: 4,
        description: "Improve PP boost formula",
        price: new Decimal(100),
        priceMultiplier: new Decimal(10),
        currentAmount: new Decimal(0),
        effect: (game: Game) => {
            game.setPeBoostToPP(n => n.plus(1));
        },
        position: { x: 0, y: 0 },
        maxAmount: 0,
        isBought: false,
    },
];


export const generatorBasePrices = new Map<number, Decimal>(
    defaultGeneratorUpgrades.map(u => [u.id, u.price])
);

export function freshGeneratorUpgrades(): IBuyableUpgrade[] {
    return defaultGeneratorUpgrades.map(u => ({
        ...u,
        price: new Decimal(u.price),
        priceMultiplier: new Decimal(u.priceMultiplier),
        currentAmount: new Decimal(u.currentAmount),
        position: { ...u.position },
    }));
}