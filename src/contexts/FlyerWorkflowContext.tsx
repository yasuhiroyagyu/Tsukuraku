import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockFlyerItems } from "../mocks/flyerItems";
import { mockFlyers } from "../mocks/flyers";
import { mockStores } from "../mocks/stores";
import { flyerRepository } from "../repositories/flyerRepository";
import type { Flyer, FlyerItem, FlyerItemStatus } from "../types";

export type ReviewSource = "manual_checked" | "entry_required" | "mock";

export type FlyerReviewBatch = {
  flyer: Flyer;
  fileName: string;
  storeName: string;
  source: ReviewSource;
  items: FlyerItem[];
};

type StageReviewInput = Omit<FlyerReviewBatch, "storeName">;

type FlyerWorkflowValue = {
  reviewBatch: FlyerReviewBatch;
  stageReview: (input: StageReviewInput) => void;
  updateItem: (item: FlyerItem) => void;
  setItemStatus: (id: string, status: FlyerItemStatus) => Promise<void>;
  approveAll: () => Promise<void>;
};

const fallbackFlyer = mockFlyers[0];
const fallbackItems = mockFlyerItems
  .filter((item) => ["chicken-thigh", "onion", "egg"].includes(item.ingredientId ?? ""))
  .map((item) => ({ ...item, status: "review_required" as const }));

const initialBatch: FlyerReviewBatch = {
  flyer: fallbackFlyer,
  fileName: "サンプルチラシ",
  storeName: "カスミ 学園店",
  source: "mock",
  items: fallbackItems,
};

const FlyerWorkflowContext = createContext<FlyerWorkflowValue | null>(null);

export function FlyerWorkflowProvider({ children }: { children: ReactNode }) {
  const [reviewBatch, setReviewBatch] = useState(initialBatch);

  const value = useMemo<FlyerWorkflowValue>(() => ({
    reviewBatch,
    stageReview: (input) => {
      const store = mockStores.find((candidate) => candidate.id === input.flyer.storeId);
      setReviewBatch({
        ...input,
        storeName: store ? `${store.name} ${store.branchName}` : input.flyer.storeId,
      });
    },
    updateItem: (nextItem) => {
      setReviewBatch((current) => ({
        ...current,
        items: current.items.map((item) => item.id === nextItem.id ? nextItem : item),
      }));
    },
    setItemStatus: async (id, status) => {
      const nextBatch = {
        ...reviewBatch,
        items: reviewBatch.items.map((item) => item.id === id ? { ...item, status } : item),
      };
      setReviewBatch(nextBatch);
      await flyerRepository.save(nextBatch.flyer, nextBatch.items);
    },
    approveAll: async () => {
      const nextBatch: FlyerReviewBatch = {
        ...reviewBatch,
        flyer: { ...reviewBatch.flyer, status: "approved" },
        items: reviewBatch.items.map((item) =>
          item.status === "review_required" ? { ...item, status: "approved" } : item,
        ),
      };
      setReviewBatch(nextBatch);
      await flyerRepository.save(nextBatch.flyer, nextBatch.items);
    },
  }), [reviewBatch]);

  return (
    <FlyerWorkflowContext.Provider value={value}>
      {children}
    </FlyerWorkflowContext.Provider>
  );
}

export function useFlyerWorkflow() {
  const context = useContext(FlyerWorkflowContext);
  if (!context) {
    throw new Error("useFlyerWorkflow must be used inside FlyerWorkflowProvider");
  }
  return context;
}
