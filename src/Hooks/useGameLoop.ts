import { useEffect, useRef, useState } from "react";
import { Game } from "../Models/Game.ts";
import Decimal from "break_eternity.js";

export function useGameLoop() {
  const [point, setPoint] = useState(new Decimal(10));
  const [bonusPoints, setBonusPoints] = useState(new Decimal(0));
  const [globalMultiplierMultiplier, setGlobalMultiplierMultiplier] = useState(new Decimal(1));
  const [globalPointMultiplier, setGlobalPointMultiplier] = useState(new Decimal(1));
  const [globalPointExponent, setGlobalPointExponent] = useState(new Decimal(1));
  const [canShowPrestigeTree, setCanShowPrestigeTree] = useState(true);
  const [prestigePoint, setPrestigePoint] = useState(new Decimal(10));

  const game = new Game(point, setPoint,
      bonusPoints, setBonusPoints,
      globalPointMultiplier, setGlobalPointMultiplier,
      globalPointExponent, setGlobalPointExponent,
      globalMultiplierMultiplier, setGlobalMultiplierMultiplier,
      canShowPrestigeTree, setCanShowPrestigeTree,

      prestigePoint, setPrestigePoint);


  const globalPointAdditionRef = useRef(bonusPoints);
  const globalPointMultiplierRef = useRef(globalPointMultiplier);
  const globalPointExponentRef = useRef(globalPointExponent);
  const globalMultiplierMultiplierRef = useRef(globalMultiplierMultiplier);

  useEffect(() => {
    globalPointAdditionRef.current = bonusPoints;
    globalPointMultiplierRef.current = globalPointMultiplier;
    globalPointExponentRef.current = globalPointExponent;
    globalMultiplierMultiplierRef.current = globalMultiplierMultiplier;

  }, [bonusPoints, globalPointMultiplier, globalPointExponent, globalMultiplierMultiplier]);

  useEffect(() => {
    const skibidi = setInterval(() => {
      setPoint(prev => prev.plus(globalPointAdditionRef.current.times(globalPointMultiplierRef.current).pow(globalPointExponentRef.current).dividedBy(25)));
      }, 40);
    return () => clearInterval(skibidi);
  }, []);

  return game;
}
