"use client";

import { useEffect, useMemo, useState } from "react";

interface ScrambleTextProps {
  text: string;
  speed?: number; // ms between scrambles
  duration?: number; // total scramble duration
  className?: string;
}

const charset = "!@#$%^&*()_+-=[]{};:,.<>/?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({
  text,
  speed = 30,
  duration = 600,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const iterations = useMemo(() => Math.max(1, Math.floor(duration / speed)), [duration, speed]);

  useEffect(() => {
    let frame = 0;
    const timer = setInterval(() => {
      frame += 1;
      if (frame >= iterations) {
        setDisplay(text);
        clearInterval(timer);
        return;
      }
      const scramble = text
        .split("")
        .map((char, idx) => (Math.random() < 0.6 ? charset[Math.floor(Math.random() * charset.length)] : char))
        .join("");
      setDisplay(scramble);
    }, speed);

    return () => clearInterval(timer);
  }, [text, iterations, speed]);

  return <span className={className}>{display}</span>;
}
