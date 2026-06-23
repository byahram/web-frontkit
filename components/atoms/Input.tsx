import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, disabled, ...props }, ref) => {
    const inputId = useId();

    return (
      <div className="w-full max-w-xs flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/30"
              : "border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/30",
            "disabled:opacity-50 disabled:bg-zinc-50 dark:disabled:bg-zinc-900/50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <span className="text-[11px] text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
