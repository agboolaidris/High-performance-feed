type Currency = "NGN" | "USD";

export function currencyFormat(
  value: number,
  currency: Currency = "NGN"
): string {
  if (currency === "USD") {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  return value.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
}
