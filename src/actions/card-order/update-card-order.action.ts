'use server';
import { auth } from '@clerk/nextjs/server';
import { UpdateCardOrderFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/list-container';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const updateCardOrder = async (formData: UpdateCardOrderFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se pudo obtener el id de la organización',
      };
   }

   const { items, boardId } = formData;
   let updatedCards;

   try {
      const transaction = items.map((card) =>
         db.card.update({
            where: {
               id: card.id,
               list: {
                  board: {
                     orgId,
                  },
               },
            },
            data: {
               order: card.order,
               listId: card.listId,
            },
         })
      );

      updatedCards = await db.$transaction(transaction);
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'No se pudo actualizar el orden de la tarjeta',
      };
   }

   // Revalidar
   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      message: 'Se actualizó el orden de la tarjeta',
      data: updatedCards,
   };
};
