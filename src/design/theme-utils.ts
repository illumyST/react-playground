// Helper utilities for working with @theme color variables
// Usage: <div className={bg('primary') + ' ' + text('on-primary')}>...</div>

export type SemanticToken =
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  | 'surface' | 'surface-1' | 'surface-2' | 'surface-3' | 'surface-4' | 'surface-5'
  | 'on-primary' | 'on-secondary' | 'on-success' | 'on-warning' | 'on-error'
  | 'on-surface' | 'on-surface-variant'
  | 'outline' | 'outline-1' | 'outline-2' | 'outline-3' | 'outline-4' | 'outline-5'
  | 'success-variant-1' | 'success-variant-2'
  | 'warning-variant-1' | 'warning-variant-2'
  | 'error-variant-1' | 'error-variant-2'
  | 'secondary-variant'
  | 'neutral' | 'neutral-container-1' | 'neutral-container-2';

const pv = (name: string) => `--color-${name}`;
export const colorVar = (name: string) => `var(${pv(name)})`;

// Tailwind arbitrary value helpers
export const bg = (token: string) => `bg-[${pv(token)}]`;
export const text = (token: string) => `text-[${pv(token)}]`;
export const border = (token: string) => `border-[${pv(token)}]`;
export const ring = (token: string) => `ring-[${pv(token)}]`;

// Combine utility classes conveniently
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

// Button variant presets (example)
export const buttonVariants = {
  primary: cx(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition',
    'bg-primary',
    'text-on-primary',
    'hover:brightness-110 active:brightness-95',
    'disabled:opacity-60 disabled:cursor-not-allowed'
  ),
  secondary: cx(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition',
    'bg-secondary',
    'text-on-secondary',
    'hover:brightness-110 active:brightness-95',
    'disabled:opacity-60 disabled:cursor-not-allowed'
  ),
  outline: cx(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition border',
    'border-outline-3',
    'text-on-surface',
    'hover:bg-surface-3 active:bg-surface-4',
    'disabled:opacity-60 disabled:cursor-not-allowed'
  )
} as const;

export type ButtonVariantKey = keyof typeof buttonVariants;
