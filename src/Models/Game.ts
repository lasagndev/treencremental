import type {Dispatch, SetStateAction} from "react";


export class Game {
    point
    setPoint
    globalPointAddition
    setGlobalPointAddition
    globalPointMultiplier
    setGlobalPointMultiplier
    globalPointExponent
    setGlobalPointExponent


    constructor(point: number,
                setPoint: Dispatch<SetStateAction<number>>,
                globalPointAddition: number,
                setGlobalPointAddition: Dispatch<SetStateAction<number>>,
                globalPointMultiplier: number,
                setGlobalPointMultiplier: Dispatch<SetStateAction<number>>,
                globalPointExponent: number,
                setGlobalPointExponent: Dispatch<SetStateAction<number>>) {

        this.point = point;
        this.setPoint  = setPoint;
        this.globalPointAddition = globalPointAddition;
        this.setGlobalPointAddition = setGlobalPointAddition;
        this.globalPointMultiplier = globalPointMultiplier;
        this.setGlobalPointMultiplier = setGlobalPointMultiplier;
        this.globalPointExponent = globalPointExponent;
        this.setGlobalPointExponent = setGlobalPointExponent;
    }
}