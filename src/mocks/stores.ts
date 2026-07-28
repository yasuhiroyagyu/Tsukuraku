import type { Store } from "../types";

export const mockStores: Store[] = [
  {
    id: "kasumi",
    name: "カスミ",
    branchName: "学園店",
    address: "茨城県つくば市竹園2丁目12-1",
    distanceKm: 2.8,
    latitude: 36.0758,
    longitude: 140.1214,
    fallbackWalkingMinutes: 36,
    fallbackCyclingMinutes: 10,
  },
  {
    id: "trial",
    name: "トライアル",
    branchName: "つくば学園都市店",
    address: "茨城県つくば市学園の森3丁目12-6",
    distanceKm: 4.2,
    latitude: 36.1073,
    longitude: 140.0787,
    fallbackWalkingMinutes: 54,
    fallbackCyclingMinutes: 15,
  },
  {
    id: "lopia",
    name: "ロピア",
    branchName: "トナリエクレオ店",
    address: "茨城県つくば市吾妻1丁目7-1",
    distanceKm: 3.5,
    latitude: 36.0817,
    longitude: 140.1114,
    fallbackWalkingMinutes: 45,
    fallbackCyclingMinutes: 13,
  },
];
