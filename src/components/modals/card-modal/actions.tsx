'use client';

import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CardWithList } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, Delete } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyCardSchema, DeleteCardSchema } from '@/actions/card/card.schema';
import { useParams } from 'next/navigation';
import { copyCard } from '@/actions/card/copy-card.action';
import { toast } from 'sonner';
import { deleteCard } from '@/actions/card/delete-card.action';
import { useCardModalStore } from '@/stores/use-card-modal';

interface ActionsProps {
   data: CardWithList;
}

export type CopyTypeFormValues = {
   id: string;
   boardId: string;
};

export type DeleteTypeFormValues = {
   id: string;
   boardId: string;
};

const Actions = ({ data }: ActionsProps) => {
   const params = useParams();
   const boardId = params.boardId as string;
   const onClose = useCardModalStore((state) => state.onClose);
   const onOpen = useCardModalStore((state) => state.onOpen);

   const {
      reset,
      getValues,
      handleSubmit,
      formState: { isSubmitting },
   } = useForm<CopyTypeFormValues>({
      resolver: zodResolver(CopyCardSchema),
      defaultValues: {
         id: data.id,
         boardId: '',
      },
   });

   const {
      reset: resetDelete,
      getValues: getValuesDelete,
      formState: { isSubmitting: isSubmittingDelete },
   } = useForm<DeleteTypeFormValues>({
      resolver: zodResolver(DeleteCardSchema),
      defaultValues: {
         id: data.id,
         boardId: '',
      },
   });

   useEffect(() => {
      reset({
         id: data.id,
         boardId,
      });
   }, [boardId, data.id, reset]);

   useEffect(() => {
      resetDelete({
         id: data.id,
         boardId,
      });
   }, [boardId, data.id, resetDelete]);

   const onCopy = async () => {
      const form = getValues();
      const { ok, message, data } = await copyCard(form);
      if (ok && data) {
         toast.success(message);
         onClose();
         onOpen(data.id);
      } else {
         toast.error(message);
      }
   };
   const onDelete = async () => {
      const form = getValuesDelete();
      const { ok, message } = await deleteCard(form);
      if (ok) {
         toast.success(message);
         onClose();
      } else {
         toast.error(message);
      }
   };

   return (
      <div className={'space-y-2 mt-2'}>
         <p className={'text-xs font-semibold'}>Acciones</p>
         <form onSubmit={handleSubmit(onCopy)}>
            <Button
               variant={'gray'}
               className={'w-full justify-start'}
               size={'inline'}
               onClick={onCopy}
               disabled={isSubmitting || isSubmittingDelete}
            >
               <Copy size={16} className={'mr-2'} />
               Copiar
            </Button>
         </form>
         <form onSubmit={handleSubmit(onDelete)}>
            <Button
               variant={'gray'}
               className={'w-full justify-start'}
               size={'inline'}
               onClick={onDelete}
               disabled={isSubmitting || isSubmittingDelete}
            >
               <Delete size={16} className={'mr-2'} />
               Eliminar
            </Button>
         </form>
      </div>
   );
};

export default Actions;

const ActionsSkeleton = () => {
   return (
      <div className="space-y-2 mt-2">
         <Skeleton className={'w-20 h-4 bg-neutral-200'} />
         <Skeleton className={'w-full h-8 bg-neutral-200'} />
         <Skeleton className={'w-full h-8 bg-neutral-200'} />
      </div>
   );
};

Actions.Skeleton = ActionsSkeleton;
