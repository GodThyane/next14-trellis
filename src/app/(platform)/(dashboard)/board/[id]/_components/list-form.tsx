'use client';

import React, { ElementRef, useRef, useState } from 'react';
import ListWrapper from '@/app/(platform)/(dashboard)/board/[id]/_components/list-wrapper';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateListSchema } from '@/actions/list/list.schema';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { createList } from '@/actions/list/create-list.action';
import { toast } from 'sonner';

export type CreateListFormValues = {
   title: string;
   boardId: string;
};

interface ListFormProps {
   boardId?: string;
}

const ListForm = ({ boardId }: ListFormProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const formRef = useRef<ElementRef<'form'>>(null);
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setFocus,
      reset,
   } = useForm<CreateListFormValues>({
      resolver: zodResolver(CreateListSchema),
      defaultValues: {
         title: '',
         boardId: boardId,
      },
   });

   const enableEditing = () => {
      setIsEditing(true);
      setTimeout(() => {
         setFocus('title');
      });
   };

   const disableEditing = () => {
      setIsEditing(false);
   };

   const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
         disableEditing();
      }
   };

   useEventListener('keydown', onKeyDown);
   useOnClickOutside(formRef, disableEditing);

   const onSubmit = async (data: CreateListFormValues) => {
      const { ok, message } = await createList(data);
      if (ok) {
         reset();
         toast.success(message);
         disableEditing();
      } else {
         toast.error(message);
      }
   };

   if (isEditing) {
      return (
         <ListWrapper>
            <form
               className={'w-full p-3 rounded-md bg-white space-y-4 shadow-md'}
               ref={formRef}
               onSubmit={handleSubmit(onSubmit)}
            >
               <FormInput
                  type={'text'}
                  name={'title'}
                  id={'title'}
                  register={register}
                  error={errors.title}
                  className={
                     'text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition'
                  }
                  placeholder={'Ingresa el título de la lista...'}
                  pending={isSubmitting}
               />
               <div className="flex items-center gap-x-1 justify-between">
                  <Button
                     type={'submit'}
                     className={'w-full'}
                     disabled={isSubmitting}
                     variant={'primary'}
                  >
                     Agregar a lista
                  </Button>
                  <Button
                     onClick={disableEditing}
                     size={'sm'}
                     variant={'ghost'}
                     disabled={isSubmitting}
                  >
                     <X className={'h-5 w-5'} />
                  </Button>
               </div>
            </form>
         </ListWrapper>
      );
   }

   return (
      <ListWrapper>
         <button
            onClick={enableEditing}
            className={
               'w-full rounded-md bg-white hover:bg-white/50 transition p-3 flex items-center font-medium text-sm'
            }
         >
            <Plus className={'w-4 h-4 mr-2'} />
            Agregar a la lista
         </button>
      </ListWrapper>
   );
};

export default ListForm;
