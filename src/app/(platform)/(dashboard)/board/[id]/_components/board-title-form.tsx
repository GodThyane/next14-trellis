'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Board } from '@/app/(platform)/(dashboard)/board/[id]/_components/board-navbar';
import FormInput from '@/components/form/form-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateBoardSchema } from '@/actions/board/board.schema';
import { updateBoard } from '@/actions/board/update-board.action';
import { toast } from 'sonner';

interface BoardTitleFormProps {
   data: Board;
}

export type UpdateBoardFormValues = {
   title: string;
   id: string;
};

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
      setFocus,
   } = useForm<UpdateBoardFormValues>({
      resolver: zodResolver(UpdateBoardSchema),
      defaultValues: {
         title: data.title,
         id: data.id,
      },
   });

   useEffect(() => {
      setValue('title', data.title);
   }, [data.title, setValue]);

   const [isEditing, setIsEditing] = useState(false);

   const disableEditing = () => {
      setIsEditing(false);
   };

   const enableEditing = () => {
      setIsEditing(true);
      setTimeout(() => {
         setFocus('title');
      });
   };

   const onBlur = () => {
      handleSubmit(onSubmit)();
   };

   const onSubmit = async (data: UpdateBoardFormValues) => {
      const { ok, message, data: board } = await updateBoard(data);

      if (ok && board) {
         toast.success(message);
         setValue('title', board.title);
         disableEditing();
      } else {
         toast.error(message);
      }
   };

   if (isEditing) {
      return (
         <form
            onSubmit={handleSubmit(onSubmit)}
            className={'flex items-center gap-x-2'}
         >
            <FormInput
               type={'text'}
               name={'title'}
               register={register}
               onBlur={onBlur}
               error={errors.title}
               className={
                  'text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none'
               }
               pending={isSubmitting}
            />
         </form>
      );
   }

   return (
      <Button
         onClick={enableEditing}
         className={'font-bold text-lg h-auto w-auto p-1 px-2'}
         variant={'transparent'}
      >
         {data.title}
      </Button>
   );
};

export default BoardTitleForm;
