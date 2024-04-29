'use client';

import React, { ElementRef, useRef, useState } from 'react';
import { ListWithCards } from '@/types';
import { useEventListener } from 'usehooks-ts';
import FormInput from '@/components/form/form-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateListSchema } from '@/actions/list/list.schema';
import { updateList } from '@/actions/list/update-list.action';
import { toast } from 'sonner';
import ListOptions from '@/app/(platform)/(dashboard)/board/[id]/_components/list-options';

interface ListHeaderProps {
   data: ListWithCards;
   onAddCard?: () => void;
}

export type UpdateListFormValues = {
   title: string;
   boardId: string;
   id: string;
};

const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
   const [title, setTitle] = useState(data.title);
   const [isEditing, setIsEditing] = useState(false);
   const formRef = useRef<ElementRef<'form'>>(null);

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<UpdateListFormValues>({
      resolver: zodResolver(UpdateListSchema),
      defaultValues: {
         title: data.title,
         boardId: data.boardId,
         id: data.id,
      },
   });

   const enableEditing = () => {
      setIsEditing(true);
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

   const onBlur = () => {
      if (isEditing) {
         handleSubmit(onSubmit)();
      }
   };

   const onSubmit = async (values: UpdateListFormValues) => {
      if (title === values.title) {
         disableEditing();
         return;
      }

      const { ok, message, data: updatedList } = await updateList(values);
      if (ok && updatedList) {
         toast.success(message);
         setTitle(updatedList.title);
         disableEditing();
      } else {
         toast.error(message);
      }
   };

   return (
      <div
         className={
            'pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'
         }
      >
         {isEditing ? (
            <form
               className={'flex-1 px-[2px]'}
               ref={formRef}
               onSubmit={handleSubmit(onSubmit)}
            >
               <FormInput
                  type={'text'}
                  name={'title'}
                  register={register}
                  error={errors.title}
                  placeholder={'Ingresa el título de la lista...'}
                  className={
                     'text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white'
                  }
                  pending={isSubmitting}
                  autofocus
                  onBlur={onBlur}
               />
            </form>
         ) : (
            <div
               role={'button'}
               onClick={enableEditing}
               className={
                  'w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent text-left whitespace-nowrap overflow-hidden text-ellipsis'
               }
            >
               {title}
            </div>
         )}
         <ListOptions data={data} onAddCard={onAddCard} />
      </div>
   );
};

export default ListHeader;
