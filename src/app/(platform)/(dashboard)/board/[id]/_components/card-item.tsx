'use client';

import React from 'react';
import { Card } from '@prisma/client';
import { Draggable } from '@hello-pangea/dnd';
import { useCardModalStore } from '@/stores/use-card-modal';

interface CardItemProps {
   index: number;
   data: Card;
}

const CardItem = ({ index, data }: CardItemProps) => {
   const onOpen = useCardModalStore((state) => state.onOpen);

   return (
      <Draggable draggableId={data.id} index={index}>
         {(provide) => (
            <div
               {...provide.draggableProps}
               {...provide.dragHandleProps}
               ref={provide.innerRef}
               role={'button'}
               onClick={() => onOpen(data.id)}
               className={
                  'text-left truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-md'
               }
            >
               {data.title}
            </div>
         )}
      </Draggable>
   );
};

export default CardItem;
