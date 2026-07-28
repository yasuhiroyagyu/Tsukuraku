import type { Flyer } from "../types";

export const mockFlyers: Flyer[] = [
  { id: "flyer-kasumi", storeId: "kasumi", imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80", validFrom: "2026-07-26", validTo: "2026-07-31", status: "published" },
  { id: "flyer-trial", storeId: "trial", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80", validFrom: "2026-07-27", validTo: "2026-08-02", status: "review_required" },
  { id: "flyer-lopia", storeId: "lopia", imageUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=80", validFrom: "2026-07-25", validTo: "2026-07-31", status: "ocr_processing" },
];
