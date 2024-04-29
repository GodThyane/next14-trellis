'use server';

import { UpdateCardFormValues } from '@/components/modals/card-modal/header';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const updateCard = async (formData: UpdateCardFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se encontró la organización',
      };
   }

   const { id, boardId, ...values } = formData;
   let card;
   try {
      card = await db.card.update({
         where: {
            id,
            list: {
               board: {
                  orgId,
               },
            },
         },
         data: {
            ...values,
         },
      });

      if (!card) {
         return {
            ok: false,
            message: 'No se encontró la tarjeta',
         };
      }

      await createAuditLog({
         entityTitle: card.title,
         entityId: card.id,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.UPDATE,
      });
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al actualizar la tarjeta',
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      message: 'Tarjeta actualizada',
      data: card,
   };
};
