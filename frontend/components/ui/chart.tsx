"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// ─── ChartConfig ─────────────────────────────────────────────────────────────

export type ChartConfig = Record<
  string,
  { label?: string; color?: string; icon?: React.ComponentType<{ className?: string }> }
>;

// ─── ChartContainer ────────────────────────────────────────────────────────────

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
};

export function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
  const style = React.useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value?.color) {
        vars[`--color-${key}`] = value.color;
      }
    }
    return vars as React.CSSProperties;
  }, [config]);

  return (
    <div
      className={cn("w-full", className)}
      style={style}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={0}>
        {React.Children.only(children) as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

// ─── ChartTooltipContent (for use inside Recharts Tooltip) ─────────────────────

type TooltipPayloadItem = {
  name?: string;
  value?: string | number;
  dataKey?: string;
  color?: string;
  fill?: string;
  payload?: Record<string, unknown>;
};

type ChartTooltipContentPropsInternal = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (label: unknown) => React.ReactNode;
  formatter?: (value: unknown, name: unknown, item: TooltipPayloadItem, index: number) => React.ReactNode;
  className?: string;
  nameKey?: string;
  labelKey?: string;
};

export function ChartTooltipContent({
  active,
  payload = [],
  label,
  hideLabel,
  hideIndicator,
  labelFormatter,
  formatter,
  className,
}: ChartTooltipContentPropsInternal) {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!hideLabel && displayLabel != null && (
        <div className="font-medium text-foreground">{displayLabel}</div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const value = formatter
            ? formatter(item.value, item.name, item, index)
            : typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value;
          const name = item.name ?? item.dataKey;
          const color = item.color ?? item.fill;
          return (
            <div
              key={index}
              className="flex w-full items-center gap-2"
            >
              {!hideIndicator && color && (
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: color }}
                />
              )}
              <div className="flex flex-1 justify-between gap-4">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ChartTooltip (Recharts Tooltip with content prop) ─────────────────────────

type ChartTooltipProps = React.ComponentProps<typeof Tooltip>;

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  return <Tooltip content={content} {...props} />;
}
