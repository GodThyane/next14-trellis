'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { deleteBoard } from '@/actions/board/delete-board.action';
import { useForm } from 'react-hook-form';

interface Props {
   title: string;
   id: string;
}

const BoardCard = ({ title, id }: Props) => {
   const {
      handleSubmit,
      formState: { isSubmitting },
   } = useForm();

   const onDelete = async () => {
      await deleteBoard(id);
   };

   return (
      <form
         onSubmit={handleSubmit(onDelete)}
         className={'flex items-center gap-x-2'}
      >
         <p>Título del tablero: {title}</p>
         <Button
            type={'submit'}
            variant={'destructive'}
            size={'sm'}
            disabled={isSubmitting}
         >
            Eliminar
         </Button>
      </form>
   );
};

export default BoardCard;
