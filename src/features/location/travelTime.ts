import type { Store } from "../../types";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type TravelTime = {
  walkingMinutes: number;
  cyclingMinutes: number;
};

const earthRadiusKm = 6371;
const routeFactor = 1.25;
const walkingSpeedKmH = 4.8;
const cyclingSpeedKmH = 15;

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

export function calculateDistanceKm(from: Coordinates, to: Coordinates) {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function estimateTravelTime(distanceKm: number): TravelTime {
  const estimatedRouteKm = distanceKm * routeFactor;
  return {
    walkingMinutes: Math.max(1, Math.round((estimatedRouteKm / walkingSpeedKmH) * 60)),
    cyclingMinutes: Math.max(1, Math.round((estimatedRouteKm / cyclingSpeedKmH) * 60)),
  };
}

export function getStoreTravelTime(store: Store, currentPosition?: Coordinates): TravelTime {
  const hasStoreCoordinates =
    Number.isFinite(store.latitude) && Number.isFinite(store.longitude);
  if (!currentPosition || !hasStoreCoordinates) {
    return {
      walkingMinutes: store.fallbackWalkingMinutes ??
        Math.max(1, Math.round((store.distanceKm / walkingSpeedKmH) * 60)),
      cyclingMinutes: store.fallbackCyclingMinutes ??
        Math.max(1, Math.round((store.distanceKm / cyclingSpeedKmH) * 60)),
    };
  }
  return estimateTravelTime(calculateDistanceKm(currentPosition, store));
}

export function canUseCurrentLocationForStore(store: Store) {
  return Number.isFinite(store.latitude) && Number.isFinite(store.longitude);
}
