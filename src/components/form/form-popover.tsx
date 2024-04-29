'use client';

import React, { ElementRef } from 'react';
import {
   Popover,
   PopoverClose,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import FormInput from '@/components/form/form-input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBoard } from '@/actions/board/create-board-action';
import { toast } from 'sonner';
import { CreateBoardSchema } from '@/actions/board/board.schema';
import { useRouter } from 'next/navigation';
import { useProModal } from '@/stores/use-pro-modal';

interface Props {
   children: React.ReactNode;
   side?: 'left' | 'right' | 'top' | 'bottom';
   align?: 'start' | 'center' | 'end';
   sideOffset?: number;
   text: string;
}

export type BoardFormValues = {
   title: string;
};

const FormPopover = ({
   children,
   side = 'bottom',
   align,
   sideOffset = 0,
   text,
}: Props) => {
   const closeRef = React.useRef<ElementRef<'button'>>(null);
   const router = useRouter();
   const { onOpen } = useProModal();

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
   } = useForm<BoardFormValues>({
      resolver: zodResolver(CreateBoardSchema),
   });

   const onSubmit = async (data: BoardFormValues) => {
      const {
         ok,
         message,
         data: board,
         showProModal,
      } = await createBoard(data);
      if (ok && board) {
         const { id } = board;
         toast.success(message);
         reset();
         closeRef.current?.click();
         router.push(`/board/${id}`);
      } else {
         toast.error(message);
         if (showProModal) {
            onOpen();
         }
      }
   };

   return (
      <Popover>
         <PopoverTrigger>{children}</PopoverTrigger>
         <PopoverContent
            align={align}
            className={'w-80 pt-3'}
            side={side}
            sideOffset={sideOffset}
         >
            <div className={'text-sm font-medium text-center text-neutral-600'}>
               {text}
            </div>
            <PopoverClose ref={closeRef} asChild>
               <Button
                  className={
                     'h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
                  }
                  variant={'ghost'}
               >
                  <X className={'h-4 w-4'} />
               </Button>
            </PopoverClose>
            <form onSubmit={handleSubmit(onSubmit)} className={'space-y-4'}>
               <div className={'space-y-4'}>
                  <FormInput
                     type={'text'}
                     name={'title'}
                     register={register}
                     error={errors.title}
                     pending={isSubmitting}
                     id={'title'}
                     label={'Título del tablero'}
                     autofocus
                  />
                  <Button
                     type={'submit'}
                     className={'w-full'}
                     disabled={isSubmitting}
                     variant={'primary'}
                  >
                     Crear tablero
                  </Button>
               </div>
            </form>
         </PopoverContent>
      </Popover>
   );
};

export default FormPopover;
