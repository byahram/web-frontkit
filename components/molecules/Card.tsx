import React from "react";
import { Badge } from "../atoms/Badge";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  showBadge?: boolean;
  badgeText?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function Card({
  className,
  title,
  description,
  showBadge = false,
  badgeText = "New",
  buttonText,
  onButtonClick,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "w-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-lg shadow-zinc-100 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col",
        className
      )}
      {...props}
    >
      {/* Visual Cover */}
      <div className="h-32 bg-gradient-to-tr from-indigo-500 to-purple-600 relative p-4 flex items-end select-none">
        {showBadge && badgeText && (
          <Badge
            variant="outline"
            size="sm"
            className="absolute top-3 right-3 text-white border-white/20 bg-black/20 backdrop-blur-md"
          >
            {badgeText}
          </Badge>
        )}
        <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xs">
          FK
        </div>
      </div>

      {/* Contents */}
      <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="mt-2 w-full py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 text-xs font-semibold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer select-none"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
