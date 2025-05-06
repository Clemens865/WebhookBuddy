import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pulse focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent dark:text-text-primary text-void-black border border-border-gray hover:bg-highlight-gray',
        primary: 'bg-neon-pulse text-void-black hover:bg-neon-pulse-hover',
        destructive: 'bg-transparent text-error border border-error hover:bg-error/10',
        outline: 'border border-border-gray bg-transparent dark:text-text-primary text-void-black hover:bg-highlight-gray',
        secondary: 'bg-transparent dark:text-text-primary text-void-black hover:bg-highlight-gray',
        ghost: 'hover:bg-highlight-gray dark:text-text-primary text-void-black',
        link: 'text-neon-pulse underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
