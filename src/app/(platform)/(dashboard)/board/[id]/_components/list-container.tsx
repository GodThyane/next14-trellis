'use client';

import { ListWithCards } from '@/types';
import ListForm from '@/app/(platform)/(dashboard)/board/[id]/_components/list-form';
import { useEffect, useState } from 'react';
import ListItem from '@/app/(platform)/(dashboard)/board/[id]/_components/list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateListOrderSchema } from '@/actions/list-order/list-order.schema';
import { updateListOrder } from '@/actions/list-order/update-list-order.action';
import { toast } from 'sonner';
import { UpdateCardOrderSchema } from '@/actions/card-order/card-order.schema';
import { updateCardOrder } from '@/actions/card-order/update-card-order.action';
import { Card } from '@prisma/client';

interface Props {
   data: ListWithCards[];
   boardId: string;
}

export type UpdateListOrderFormValues = {
   items: {
      id: string;
      title: string;
      order: number;
      createdAt: Date;
      updatedAt: Date;
   }[];
   boardId: string;
};

export type UpdateCardOrderFormValues = {
   items: {
      id: string;
      title: string;
      order: number;
      listId: string;
      createdAt: Date;
      updatedAt: Date;
   }[];
   boardId: string;
};

function reOrder<T>(list: T[], startIndex: number, endIndex: number): T[] {
   const result = Array.from(list);
   const [removed] = result.splice(startIndex, 1);
   result.splice(endIndex, 0, removed);
   return result;
}

const ListContainer = ({ data, boardId }: Props) => {
   const { handleSubmit, reset } = useForm<UpdateListOrderFormValues>({
      resolver: zodResolver(UpdateListOrderSchema),
      defaultValues: {
         items: data.map((item, index) => ({ ...item, order: index })),
         boardId,
      },
   });

   const { handleSubmit: handleSubmitCard, reset: resetCard } =
      useForm<UpdateCardOrderFormValues>({
         resolver: zodResolver(UpdateCardOrderSchema),
         defaultValues: {
            items: [
               {
                  id: '',
                  title: '',
                  order: 0,
                  listId: '',
                  createdAt: new Date(),
                  updatedAt: new Date(),
               },
            ],
            boardId,
         },
      });

   const [orderedData, setOrderedData] = useState(data);
   const [reorderListCard, setReorderListCard] = useState<Card[]>([]);

   useEffect(() => {
      setOrderedData(data);
   }, [data]);

   useEffect(() => {
      reset({
         items: orderedData.map((item, index) => ({ ...item, order: index })),
         boardId,
      });
   }, [boardId, orderedData, reset]);

   useEffect(() => {
      resetCard({
         items: reorderListCard.map((item, index) => ({
            ...item,
            order: index,
         })),
         boardId,
      });
   }, [boardId, reorderListCard, resetCard]);

   const onDragEnd = (result: any) => {
      const { destination, source, type } = result;

      if (!destination) {
         return;
      }

      // Si dropped en la misma posición
      if (
         destination.droppableId === source.droppableId &&
         destination.index === source.index
      ) {
         return;
      }

      // Si es una lista
      if (type === 'list') {
         const items = reOrder(
            orderedData,
            source.index,
            destination.index
         ).map((item, index) => ({ ...item, order: index }));

         setOrderedData(items);
         setTimeout(() => {
            handleSubmit(onSubmit)();
         });
      }

      // Si es una tarjeta
      if (type === 'card') {
         let newOrderedData = [...orderedData];

         // Encuentra la lista de origen
         const sourceList = newOrderedData.find(
            (list) => list.id === source.droppableId
         );

         const destList = newOrderedData.find(
            (list) => list.id === destination.droppableId
         );

         if (!sourceList || !destList) return;

         // Validar su la tarjeta existe en la lista de origen
         if (!sourceList.cards) {
            sourceList.cards = [];
         }

         // Validar si la tarjeta existe en la lista de destino
         if (!destList.cards) {
            destList.cards = [];
         }

         // Moviendo dentro de la misma lista
         if (source.droppableId === destination.droppableId) {
            const reorderedCards = reOrder(
               sourceList.cards,
               source.index,
               destination.index
            );

            reorderedCards.forEach((card, index) => {
               card.order = index;
            });

            sourceList.cards = reorderedCards;

            setReorderListCard(reorderedCards);
            setOrderedData(newOrderedData);
            setTimeout(() => {
               handleSubmitCard(onSubmitCard)();
            });
         } else {
            // Moviendo a otra lista
            // Remover de la lista de origen
            const [movedCard] = sourceList.cards.splice(source.index, 1);

            // Asignar el id de la lista de destino
            movedCard.listId = destination.droppableId;
            // Agregar a la lista de destino
            destList.cards.splice(destination.index, 0, movedCard);

            sourceList.cards.forEach((card, index) => {
               card.order = index;
            });

            // Actualizar el orden de las tarjetas de la lista de destino
            destList.cards.forEach((card, index) => {
               card.order = index;
            });

            setOrderedData(newOrderedData);
            setReorderListCard(destList.cards);
            setTimeout(() => {
               handleSubmitCard(onSubmitCard)();
            });
         }
      }
   };

   const onSubmit = async (values: UpdateListOrderFormValues) => {
      const { ok, message } = await updateListOrder(values);
      if (ok) {
         toast.success(message);
      } else {
         toast.error(message);
      }
   };

   const onSubmitCard = async (values: UpdateCardOrderFormValues) => {
      const { ok, message } = await updateCardOrder(values);
      if (ok) {
         toast.success(message);
      } else {
         toast.error(message);
      }
   };

   return (
      <DragDropContext onDragEnd={onDragEnd}>
         <Droppable droppableId={'lists'} type="list" direction={'horizontal'}>
            {(provided) => (
               <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={'flex gap-x-3 h-full'}
               >
                  {orderedData.map((list, index) => (
                     <ListItem key={list.id} data={list} index={index} />
                  ))}
                  {provided.placeholder}
                  <ListForm boardId={boardId} />
                  <div className={'flex-shrink-0 w-1'} />
               </ol>
            )}
         </Droppable>
      </DragDropContext>
   );
};

export default ListContainer;
