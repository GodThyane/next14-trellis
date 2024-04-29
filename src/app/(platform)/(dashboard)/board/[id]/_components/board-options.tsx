'use client';

import React, { useState } from 'react';
import {
   Popover,
   PopoverClose,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, X } from 'lucide-react';
import { deleteBoard } from '@/actions/board/delete-board.action';
import { toast } from 'sonner';

interface Props {
   id: string;
}

const BoardOptions = ({ id }: Props) => {
   const [isLoading, setIsLoading] = useState(false);

   const onRemoveBoard = async () => {
      setIsLoading(true);
      const res = await deleteBoard(id);
      setIsLoading(false);

      if (res) {
         toast.error(res.message);
      }
   };

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button className={'h-auto w-auto p-2'} variant={'transparent'}>
               <MoreHorizontal className={'h-4 w-4'} />
            </Button>
         </PopoverTrigger>
         <PopoverContent
            className={'px-0 pt-3 pb-3'}
            side={'bottom'}
            align={'start'}
         >
            <div
               className={
                  'text-sm font-medium text-center text-neutral-600 pb-4'
               }
            >
               Acciones del tablero
            </div>
            <PopoverClose asChild>
               <Button
                  className={
                     'h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
                  }
                  variant={'ghost'}
               >
                  <X className={'h-4 w-4'} />
               </Button>
            </PopoverClose>
            <Button
               variant={'ghost'}
               className={
                  'rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
               }
               onClick={onRemoveBoard}
               disabled={isLoading}
            >
               Eliminar tablero
            </Button>
         </PopoverContent>
      </Popover>
   );
};

export default BoardOptions;
