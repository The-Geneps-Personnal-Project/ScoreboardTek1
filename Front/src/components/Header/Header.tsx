import React, { useRef, useEffect, useState } from "react";
import "./Header.css";

export const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const [restart, setRestart] = useState(false);

  useEffect(() => {
    const animateText = () => {
      if (textRef.current) {
        const elem = textRef.current;
        let delay = 200;
        let delay_start = 0;
        const contents = elem.textContent!.trim();
        elem.textContent = ""; 
        const letters = contents.split("");

        elem.style.visibility = 'visible';

        letters.forEach((letter, index) => {
          setTimeout(() => {
            elem.textContent += letter;
          }, delay_start + delay * index);
        });

        delay_start += delay * letters.length;  
      }
    };

    const startAnimation = () => {
      animateText();
    };
    startAnimation();
    const resetIntervalId = setInterval(() => {
      setRestart(prev => !prev); 
    }, 5 * 1000);

    return () => clearInterval(resetIntervalId);
  }, [restart]);

  return (
    <div className="Header">
      <h1 className="animate-text" ref={textRef}>SCOREBOARD</h1>
    </div>
  );
};
