import { useCallback, useEffect, useState } from "react";
import type { Coordinates } from "../features/location/travelTime";

export type LocationStatus = "requesting" | "current" | "fallback";

let sharedLocationRequest: Promise<Coordinates> | null = null;

function requestCoordinates() {
  if (!navigator.geolocation) {
    return Promise.reject(new Error("Geolocation is not supported"));
  }
  if (!sharedLocationRequest) {
    sharedLocationRequest = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        reject,
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
      );
    });
  }
  return sharedLocationRequest;
}

export function useTravelTimes() {
  const [position, setPosition] = useState<Coordinates>();
  const [status, setStatus] = useState<LocationStatus>("requesting");

  const locate = useCallback(() => {
    setStatus("requesting");
    requestCoordinates()
      .then((coordinates) => {
        setPosition(coordinates);
        setStatus("current");
      })
      .catch(() => {
        setPosition(undefined);
        setStatus("fallback");
      });
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  return { position, status, retry: locate };
}
