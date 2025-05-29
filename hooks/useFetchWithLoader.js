"use client";
import { useLoader } from "@/context/LoaderContext";
import { useCallback } from "react";

export const useFetchWithLoader = () => {
  const { showLoader, hideLoader } = useLoader();

  const fetchWithLoader = useCallback(
    async (url, options = {}) => {
      showLoader();
      try {
        const response = await fetch(url, options);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  return fetchWithLoader;
};
