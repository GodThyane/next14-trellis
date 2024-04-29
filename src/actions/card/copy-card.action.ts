'use server';

import { CopyTypeFormValues } from '@/components/modals/card-modal/actions';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const copyCard = async (data: CopyTypeFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se encontró la organización',
      };
   }

   const { id, boardId } = data;

   let card;
   try {
      const cardToCopy = await db.card.findUnique({
         where: {
            id,
            list: {
               board: {
                  orgId,
               },
            },
         },
      });

      if (!cardToCopy) {
         return {
            ok: false,
            message: 'No se encontró la tarjeta',
         };
      }

      const lastCard = await db.card.findFirst({
         where: {
            listId: cardToCopy.listId,
         },
         orderBy: {
            order: 'desc',
         },
      });

      const newOrder = lastCard ? lastCard.order + 1 : 1;

      card = await db.card.create({
         data: {
            title: `${cardToCopy.title} - Copia`,
            description: cardToCopy.description,
            order: newOrder,
            listId: cardToCopy.listId,
         },
      });

      await createAuditLog({
         entityTitle: card.title,
         entityId: card.id,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.CREATE,
      });
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al copiar la tarjeta',
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      data: card,
      message: 'Tarjeta copiada correctamente',
   };
};
