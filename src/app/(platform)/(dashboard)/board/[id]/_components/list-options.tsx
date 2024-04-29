'use client';

import React, { ElementRef, useRef } from 'react';
import { ListWithCards } from '@/types';
import {
   Popover,
   PopoverClose,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyListSchema, DeleteListSchema } from '@/actions/list/list.schema';
import { Separator } from '@/components/ui/separator';
import { deleteList } from '@/actions/list/delete-list.action';
import { toast } from 'sonner';
import { copyList } from '@/actions/list/copy-list.action';
export type DeleteListFormValues = {
   id: string;
   boardId: string;
};

export type CopyListFormValues = {
   id: string;
   boardId: string;
};

interface ListOptionsProps {
   data: ListWithCards;
   onAddCard?: () => void;
}

const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
   const closeRef = useRef<ElementRef<'button'>>(null);

   const {
      handleSubmit: handleDeleteList,
      formState: { isSubmitting: isSubmittingDeleteList },
   } = useForm<DeleteListFormValues>({
      resolver: zodResolver(DeleteListSchema),
      defaultValues: {
         id: data.id,
         boardId: data.boardId,
      },
   });

   const {
      handleSubmit: handleCopyList,
      formState: { isSubmitting: isSubmittingCopyList },
   } = useForm<CopyListFormValues>({
      resolver: zodResolver(CopyListSchema),
      defaultValues: {
         id: data.id,
         boardId: data.boardId,
      },
   });

   const onDeleteList = async (formData: DeleteListFormValues) => {
      const { ok, message } = await deleteList(formData);
      if (ok) {
         toast.success(message);
      } else {
         toast.error(message);
      }
   };

   const onCopyList = async (formData: CopyListFormValues) => {
      const { ok, message } = await copyList(formData);
      if (ok) {
         toast.success(message);
         closeRef.current?.click();
      } else {
         toast.error(message);
      }
   };

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button className={'h-auto w-auto p-2'} variant={'ghost'}>
               <MoreHorizontal size={16} />
            </Button>
         </PopoverTrigger>
         <PopoverContent
            className={'px-0 pt-3 pb-3'}
            side={'bottom'}
            align={'center'}
         >
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
               Acciones de la lista
            </div>
            <PopoverClose ref={closeRef} asChild>
               <Button
                  className={
                     'h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
                  }
                  variant={'ghost'}
               >
                  <X size={16} />
               </Button>
            </PopoverClose>
            <Button
               onClick={onAddCard}
               className={
                  'rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
               }
               variant={'ghost'}
            >
               Agregar tarjeta
            </Button>
            <form onSubmit={handleCopyList(onCopyList)}>
               <Button
                  type={'submit'}
                  className={
                     'rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
                  }
                  disabled={isSubmittingCopyList}
                  variant={'ghost'}
               >
                  Copiar lista
               </Button>
            </form>
            <Separator />
            <form onSubmit={handleDeleteList(onDeleteList)}>
               <Button
                  type={'submit'}
                  className={
                     'rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
                  }
                  disabled={isSubmittingDeleteList}
                  variant={'ghost'}
               >
                  Eliminar lista
               </Button>
            </form>
         </PopoverContent>
      </Popover>
   );
};

export default ListOptions;
