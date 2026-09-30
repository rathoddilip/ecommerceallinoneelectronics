import { cn } from "@/lib/utils";
import { cloneElement, isValidElement, useId } from "react";
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactElement, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  required,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement>) {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const control =
    isValidElement(children) && !(children.props as { id?: string }).id
      ? cloneElement(children as ReactElement<{ id?: string }>, { id: fieldId })
      : children;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-foreground/80">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      {control}
      {hint && <p className="text-xs text-foreground/50">{hint}</p>}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-11 rounded-lg border border-border-subtle bg-surface px-3.5 text-sm outline-none transition-colors placeholder:text-foreground/35",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-foreground/35",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full h-11 rounded-lg border border-border-subtle bg-surface px-3.5 text-sm outline-none transition-colors",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
