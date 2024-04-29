'use client';
import React, { useState } from 'react';
import { ListWithCards } from '@/types';
import ListHeader from '@/app/(platform)/(dashboard)/board/[id]/_components/list-header';
import CardForm from '@/app/(platform)/(dashboard)/board/[id]/_components/card-form';
import { cn } from '@/lib/utils';
import CardItem from '@/app/(platform)/(dashboard)/board/[id]/_components/card-item';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface ListItemProps {
   data: ListWithCards;
   index: number;
}

const ListItem = ({ data, index }: ListItemProps) => {
   const [isEditing, setIsEditing] = useState(false);

   const disableEditing = () => {
      setIsEditing(false);
   };

   const enableEditing = () => {
      setIsEditing(true);
   };

   return (
      <Draggable draggableId={data.id} index={index}>
         {(provided) => (
            <li
               {...provided.draggableProps}
               ref={provided.innerRef}
               className={'shrink-0 h-full w-[272px] select-none'}
            >
               <div
                  {...provided.dragHandleProps}
                  className={'w-full rounded-md bg-[#f1f2f4] shadow-md pb-2'}
               >
                  <ListHeader onAddCard={enableEditing} data={data} />
                  <Droppable droppableId={data.id} type={'card'}>
                     {(provided) => (
                        <ol
                           ref={provided.innerRef}
                           {...provided.droppableProps}
                           className={cn(
                              '' + 'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
                              data.cards.length > 0 ? 'mt-2' : 'mt-0'
                           )}
                        >
                           {data.cards.map((card, index) => (
                              <CardItem
                                 key={card.id}
                                 index={index}
                                 data={card}
                              />
                           ))}
                           {provided.placeholder}
                        </ol>
                     )}
                  </Droppable>
                  <CardForm
                     listId={data.id}
                     isEditing={isEditing}
                     enableEditing={enableEditing}
                     disableEditing={disableEditing}
                  />
               </div>
            </li>
         )}
      </Draggable>
   );
};

export default ListItem;
