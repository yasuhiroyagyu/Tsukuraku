export const formatPrice = (value: number) => `${value.toLocaleString("ja-JP")}円`;

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ja-JP", { month: "short", day: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );

export const formatQuantity = (quantity: number, unit: string) => `${quantity}${unit}`;
