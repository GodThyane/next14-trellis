'use client';

import React, { ElementRef, KeyboardEventHandler, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import FormTextarea from '@/components/form/form-textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCardSchema } from '@/actions/card/card.schema';
import { createCard } from '@/actions/card/create-card.action';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { toast } from 'sonner';

export type CreateCardFormValues = {
   title: string;
   listId: string;
};

interface CardFormProps {
   isEditing: boolean;
   enableEditing: () => void;
   disableEditing: () => void;
   listId: string;
}

const CardForm = ({
   isEditing,
   enableEditing,
   disableEditing,
   listId,
}: CardFormProps) => {
   const formRef = useRef<ElementRef<'form'>>(null);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
   } = useForm<CreateCardFormValues>({
      resolver: zodResolver(CreateCardSchema),
      defaultValues: {
         title: '',
         listId: listId,
      },
   });

   const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
         disableEditing();
      }
   };

   useOnClickOutside(formRef, disableEditing);
   useEventListener('keydown', onKeyDown);

   const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   const onSubmit = async (values: CreateCardFormValues) => {
      const { ok, message } = await createCard(values);

      if (ok) {
         toast.success(message);
         reset();
      } else {
         toast.error(message);
      }
   };

   if (isEditing) {
      return (
         <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className={'m-1 py-0.5 px-1 space-y-4'}
         >
            <FormTextarea
               id={'title'}
               name={'title'}
               register={register}
               error={errors.title}
               placeholder={'Ingresa el título de la tarjeta'}
               onKeyDown={onTextareaKeyDown}
               pending={isSubmitting}
               autofocus
            />
            <div className="flex items-center gap-x-1">
               <Button
                  type={'submit'}
                  variant={'primary'}
                  className={'w-full'}
                  disabled={isSubmitting}
               >
                  Agregar tarjeta
               </Button>
               <Button
                  onClick={disableEditing}
                  size={'sm'}
                  variant={'ghost'}
                  disabled={isSubmitting}
               >
                  <X size={20} />
               </Button>
            </div>
         </form>
      );
   }

   return (
      <div className={'pt-2 px-2'}>
         <Button
            onClick={enableEditing}
            className={
               'h-auto px-2 py-1.5 justify-start text-muted-foreground text-sm'
            }
            size={'sm'}
            variant={'ghost'}
         >
            <Plus size={16} className={'mr-2'} />
            Agregar tarjeta
         </Button>
      </div>
   );
};

export default CardForm;
