import Decimal from "break_eternity.js";


export class Game {
    point
    setPoint
    globalPointAddition
    setGlobalPointAddition
    globalPointMultiplier
    setGlobalPointMultiplier
    globalPointExponent
    setGlobalPointExponent
    globalMultiplierMultiplier
    setGlobalMultiplierMultiplier

    pointGainFromPrestige
    setPointGainFromPrestige
    pointMultiFromPrestige
    setPointMultiFromPrestige
    pointExponentFromPrestige
    setPointExponentFromPrestige

    canShowPrestigeTree
    setCanShowPrestigeTree

    prestigePoint
    setPrestigePoint
    prestigePointMulti
    setPrestigePointMulti

    dynamicUpgradeValues
    setDynamicUpgradeValues

    automationInterval
    setAutomationInterval

    canShowGenerator
    setCanShowGenerator

    prestigeEnergy
    setPrestigeEnergy

    generatorDuration
    setGeneratorDuration

    peMulti
    setPeMulti

    peBoostToP
    setPeBoostToP

    peBoostToPP
    setPeBoostToPP

    constructor(point: Decimal,
                setPoint: React.Dispatch<React.SetStateAction<Decimal>>,
                globalPointAddition: Decimal,
                setGlobalPointAddition: React.Dispatch<React.SetStateAction<Decimal>>,
                globalPointMultiplier: Decimal,
                setGlobalPointMultiplier: React.Dispatch<React.SetStateAction<Decimal>>,
                globalPointExponent: Decimal,
                setGlobalPointExponent: React.Dispatch<React.SetStateAction<Decimal>>,
                globalMultiplierMultiplier: Decimal,
                setGlobalMultiplierMultiplier: React.Dispatch<React.SetStateAction<Decimal>>,
                canShowPrestigeTree: boolean,
                setCanShowPrestigeTree: React.Dispatch<React.SetStateAction<boolean>>,
                prestigePoint: Decimal,
                setPrestigePoint: React.Dispatch<React.SetStateAction<Decimal>>,
                pointGainFromPrestige: Decimal,
                setPointGainFromPrestige: React.Dispatch<React.SetStateAction<Decimal>>,
                pointMultiFromPrestige: Decimal,
                setPointMultiFromPrestige: React.Dispatch<React.SetStateAction<Decimal>>,
                pointExponentFromPrestige: Decimal,
                setPointExponentFromPrestige: React.Dispatch<React.SetStateAction<Decimal>>,
                prestigePointMulti: Decimal,
                setPrestigePointMulti: React.Dispatch<React.SetStateAction<Decimal>>,
                dynamicUpgradeValues: Record<number, Decimal>,
                setDynamicUpgradeValues: React.Dispatch<React.SetStateAction<Record<number, Decimal>>>,
                automationInterval: number,
                setAutomationInterval: React.Dispatch<React.SetStateAction<number>>,
                canShowGenerator: boolean,
                setCanShowGenerator: React.Dispatch<React.SetStateAction<boolean>>,
                prestigeEnergy: Decimal,
                setPrestigeEnergy: React.Dispatch<React.SetStateAction<Decimal>>,
                generatorDuration: number,
                setGeneratorDuration: React.Dispatch<React.SetStateAction<number>>,
                peMulti: Decimal,
                setPeMulti: React.Dispatch<React.SetStateAction<Decimal>>,
                peBoostToP: Decimal,
                setPeBoostToP: React.Dispatch<React.SetStateAction<Decimal>>,
                peBoostToPP: Decimal,
                setPeBoostToPP: React.Dispatch<React.SetStateAction<Decimal>>) {

        this.point = point;
        this.setPoint  = setPoint;
        this.globalPointAddition = globalPointAddition;
        this.setGlobalPointAddition = setGlobalPointAddition;
        this.globalPointMultiplier = globalPointMultiplier;
        this.setGlobalPointMultiplier = setGlobalPointMultiplier;
        this.globalPointExponent = globalPointExponent;
        this.setGlobalPointExponent = setGlobalPointExponent;
        this.globalMultiplierMultiplier = globalMultiplierMultiplier;
        this.setGlobalMultiplierMultiplier = setGlobalMultiplierMultiplier;
        this.canShowPrestigeTree = canShowPrestigeTree;
        this.setCanShowPrestigeTree = setCanShowPrestigeTree;
        this.prestigePoint = prestigePoint;
        this.setPrestigePoint = setPrestigePoint;
        this.pointGainFromPrestige = pointGainFromPrestige;
        this.setPointGainFromPrestige = setPointGainFromPrestige;
        this.pointMultiFromPrestige = pointMultiFromPrestige;
        this.setPointMultiFromPrestige = setPointMultiFromPrestige;
        this.pointExponentFromPrestige = pointExponentFromPrestige;
        this.setPointExponentFromPrestige = setPointExponentFromPrestige;
        this.prestigePointMulti = prestigePointMulti;
        this.setPrestigePointMulti = setPrestigePointMulti;
        this.dynamicUpgradeValues = dynamicUpgradeValues;
        this.setDynamicUpgradeValues = setDynamicUpgradeValues;
        this.automationInterval = automationInterval;
        this.setAutomationInterval = setAutomationInterval;
        this.canShowGenerator = canShowGenerator;
        this.setCanShowGenerator = setCanShowGenerator;
        this.prestigeEnergy = prestigeEnergy;
        this.setPrestigeEnergy = setPrestigeEnergy;
        this.generatorDuration = generatorDuration;
        this.setGeneratorDuration = setGeneratorDuration;
        this.peMulti = peMulti;
        this.setPeMulti = setPeMulti;
        this.peBoostToP = peBoostToP;
        this.setPeBoostToP = setPeBoostToP;
        this.peBoostToPP = peBoostToPP;
        this.setPeBoostToPP = setPeBoostToPP;
    }
}
