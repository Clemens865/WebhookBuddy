import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-border-gray dark:bg-input-field bg-white text-void-black dark:text-text-primary px-3 py-2 text-sm ring-offset-void-black placeholder:text-gray-400 dark:placeholder:text-icon-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pulse focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
