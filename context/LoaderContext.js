// LoaderContext.js
"use client";
import { createContext, useContext, useState, useRef, useCallback } from "react";

const LoaderContext = createContext();
export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const counter = useRef(0);

  const showLoader = useCallback(() => {
    counter.current += 1;
    setLoading(true);
  }, []);

  const hideLoader = useCallback(async () => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) {
      await new Promise((res) => setTimeout(res, 500)); // min delay to avoid flicker
      setLoading(false);
    }
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
