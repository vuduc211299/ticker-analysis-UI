import { formatPrice } from "@/lib/format";

interface TooltipPayloadItem {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-zinc-400 text-xs mb-1">{label}</p>
      <p className="text-emerald-400 font-semibold text-sm">
        {formatPrice(payload[0].value)}
      </p>
    </div>
  );
}
