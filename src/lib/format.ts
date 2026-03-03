export function formatTimestamp(ms: number) {
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatPrice(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }

  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }

  return `$${value.toFixed(6)}`;
}
