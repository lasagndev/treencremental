import { useEffect, useRef, useState } from "react";
import { Game } from "../Models/Game.ts";

export function useGameLoop() {
  const [point, setPoint] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(1);
  const [globalPointMultiplier, setGlobalPointMultiplier] = useState(1);
  const [globalPointExponent, setGlobalPointExponent] = useState(1);

  const game = new Game(point, setPoint,
      bonusPoints, setBonusPoints,
      globalPointMultiplier, setGlobalPointMultiplier,
      globalPointExponent, setGlobalPointExponent);


  const globalPointAdditionRef = useRef(bonusPoints);
  const globalPointMultiplierRef = useRef(globalPointMultiplier);
  const globalPointExponentRef = useRef(globalPointExponent);

  useEffect(() => {
    globalPointAdditionRef.current = bonusPoints;
    globalPointMultiplierRef.current = globalPointMultiplier;
    globalPointExponentRef.current = globalPointExponent;

  }, [bonusPoints, globalPointMultiplier, globalPointExponent]);

  useEffect(() => {
    const skibidi = setInterval(() => {
      setPoint(prev => prev + Math.pow((globalPointAdditionRef.current * globalPointMultiplierRef.current), globalPointExponentRef.current) / 25);
      }, 40);
    return () => clearInterval(skibidi);
  }, []);

  return game;
}
