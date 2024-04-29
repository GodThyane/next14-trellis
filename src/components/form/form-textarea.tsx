'use client';

import { FieldError, UseFormRegister } from 'react-hook-form';
import React, { KeyboardEventHandler } from 'react';

interface FormTextareaProps {
   id?: string;
   name: string;
   label?: string;
   placeholder?: string;
   register: UseFormRegister<any>;
   error: FieldError | undefined;
   valueAsNumber?: boolean;
   pending?: boolean;
   className?: string;
   onBlur?: () => void;
   onClick?: () => void;
   onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
   autofocus?: boolean;
}

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormTextArea = ({
   id,
   name,
   label,
   placeholder,
   register,
   error,
   valueAsNumber,
   pending,
   className,
   onBlur,
   onClick,
   onKeyDown,
   autofocus,
}: FormTextareaProps) => {
   return (
      <div className={'space-y-2 w-full'}>
         <div className="space-y-1 w-full">
            {label && (
               <Label
                  htmlFor={id}
                  className={'text-xs font-semibold text-neutral-700'}
               >
                  {label}
               </Label>
            )}
            <Textarea
               onKeyDown={onKeyDown}
               {...register(name, { valueAsNumber, onBlur })}
               onClick={onClick}
               aria-describedby={`${name}-error`}
               autoFocus={autofocus}
               disabled={pending}
               className={cn('text-sm px-2 py-1 h-7', className)}
               placeholder={placeholder}
            />
            {error && (
               <div
                  aria-live={'polite'}
                  className="flex items-center mt-2 text-xs text-rose-500 font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm"
               >
                  <XCircle className={'h-4 w-4 mr-2'} />
                  {error.message}
               </div>
            )}
         </div>
      </div>
   );
};

export default FormTextArea;
