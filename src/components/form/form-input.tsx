'use client';

import { FieldError, UseFormRegister } from 'react-hook-form';

interface FormInputProps {
   type: string;
   placeholder?: string;
   name: string;
   id?: string;
   register: UseFormRegister<any>;
   error: FieldError | undefined;
   valueAsNumber?: boolean;
   pending?: boolean;
   className?: string;
   label?: string;
   onBlur?: () => void;
   autofocus?: boolean;
}

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';

const FormInput = ({
   type,
   placeholder,
   name,
   id,
   register,
   error,
   valueAsNumber,
   pending,
   label,
   className,
   onBlur,
   autofocus,
}: FormInputProps) => {
   return (
      <div className={'space-y-2'}>
         <div className={'space-y-1'}>
            {label && (
               <Label
                  htmlFor={id}
                  className={'text-xs font-semibold text-neutral-700'}
               >
                  {label}
               </Label>
            )}
            <Input
               type={type}
               placeholder={placeholder}
               {...register(name, { valueAsNumber, onBlur })}
               disabled={pending}
               className={cn('text-sm px-2 py-1 h-7', className)}
               aria-describedby={`${name}-error`}
               autoFocus={autofocus}
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

export default FormInput;
