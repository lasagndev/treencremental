import type {Dispatch, SetStateAction} from "react";
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

    constructor(point: Decimal,
                setPoint: Dispatch<SetStateAction<Decimal>>,
                globalPointAddition: Decimal,
                setGlobalPointAddition: Dispatch<SetStateAction<Decimal>>,
                globalPointMultiplier: Decimal,
                setGlobalPointMultiplier: Dispatch<SetStateAction<Decimal>>,
                globalPointExponent: Decimal,
                setGlobalPointExponent: Dispatch<SetStateAction<Decimal>>,
                globalMultiplierMultiplier: Decimal,
                setGlobalMultiplierMultiplier: Dispatch<SetStateAction<Decimal>>,
                canShowPrestigeTree: boolean,
                setCanShowPrestigeTree: Dispatch<SetStateAction<boolean>>,
                prestigePoint: Decimal,
                setPrestigePoint: Dispatch<SetStateAction<Decimal>>,
                pointMultiFromPrestige: Decimal,
                setPointMultiFromPrestige: Dispatch<SetStateAction<Decimal>>,
                pointExponentFromPrestige: Decimal,
                setPointExponentFromPrestige: Dispatch<SetStateAction<Decimal>>,
                prestigePointMulti: Decimal,
                setPrestigePointMulti: Dispatch<SetStateAction<Decimal>>,) {

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
        this.pointMultiFromPrestige = pointMultiFromPrestige;
        this.setPointMultiFromPrestige = setPointMultiFromPrestige;
        this.pointExponentFromPrestige = pointExponentFromPrestige;
        this.setPointExponentFromPrestige = setPointExponentFromPrestige;
        this.prestigePointMulti = prestigePointMulti;
        this.setPrestigePointMulti = setPrestigePointMulti;
    }
}