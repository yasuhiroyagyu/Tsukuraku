import { describe, expect, it } from "vitest";
import type { Store } from "../../types";
import { calculateDistanceKm, estimateTravelTime, getStoreTravelTime } from "./travelTime";

const store: Store = {
  id: "test",
  name: "テスト",
  branchName: "店舗",
  address: "つくば市",
  distanceKm: 3,
  latitude: 36.08,
  longitude: 140.11,
  fallbackWalkingMinutes: 40,
  fallbackCyclingMinutes: 12,
};

describe("travel time", () => {
  it("uses preset university times without a current position", () => {
    expect(getStoreTravelTime(store)).toEqual({
      walkingMinutes: 40,
      cyclingMinutes: 12,
    });
  });

  it("estimates walking and cycling times from coordinates", () => {
    const distance = calculateDistanceKm(
      { latitude: 36.08, longitude: 140.11 },
      { latitude: 36.09, longitude: 140.11 },
    );
    const travelTime = estimateTravelTime(distance);

    expect(distance).toBeGreaterThan(1);
    expect(travelTime.walkingMinutes).toBeGreaterThan(travelTime.cyclingMinutes);
  });

  it("supports store data saved before travel fields were added", () => {
    const legacyStore = {
      ...store,
      latitude: undefined,
      longitude: undefined,
      fallbackWalkingMinutes: undefined,
      fallbackCyclingMinutes: undefined,
    } as unknown as Store;

    expect(getStoreTravelTime(legacyStore)).toEqual({
      walkingMinutes: 38,
      cyclingMinutes: 12,
    });
  });
});
