import { useEffect, useRef, useState } from "react";

interface CounterProps {
  end: number;
  duration?: number;
  start?: boolean;
}

const Counter = ({ end, duration = 3500, start = false }: CounterProps) => {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!start || hasStarted.current) return;

    hasStarted.current = true;
    let current = 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return <>{count}</>;
};

export default Counter;