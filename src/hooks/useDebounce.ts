import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t); // cancel the previous timer on every change
  }, [value, delay]);

  return debounced;
}