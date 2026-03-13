import { Handle, Position } from "@xyflow/react";
import { cn } from "../lib/utils";

interface ResourceNodeData {
  label: string;
  type: string;
  impacted: boolean;
  riskLevel?: string;
}

const TYPE_STYLES: Record<
  string,
  { dot: string; border: string; bg: string; text: string }
> = {
  vm: {
    dot: "bg-red-500",
    border: "border-red-500",
    bg: "bg-red-950/70",
    text: "text-red-200",
  },
  database: {
    dot: "bg-yellow-500",
    border: "border-yellow-500",
    bg: "bg-yellow-950/70",
    text: "text-yellow-200",
  },
  app: {
    dot: "bg-green-500",
    border: "border-green-500",
    bg: "bg-green-950/70",
    text: "text-green-200",
  },
  unknown: {
    dot: "bg-slate-500",
    border: "border-slate-500",
    bg: "bg-slate-800/80",
    text: "text-slate-200",
  },
};

export function ResourceNode(props: { data: ResourceNodeData }) {
  const { label, type } = props.data;
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.unknown;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-300 border-2 !border-slate-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-300 !border-slate-400"
      />
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl border-2 px-4 py-3 shadow-sm",
          "min-w-[180px] transition-all duration-300 ease-out",
          "hover:shadow-md hover:scale-[1.02]",
          style.bg,
          style.border,
        )}
      >
        <div
          className={cn("h-3 w-3 shrink-0 rounded-full", style.dot)}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className={cn("truncate text-sm font-semibold", style.text)}>
            {label}
          </div>
          <div
            className={cn(
              "text-xs uppercase tracking-wider opacity-70",
              style.text,
            )}
          >
            {type}
          </div>
        </div>
      </div>
    </>
  );
}
