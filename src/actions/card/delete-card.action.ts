'use server';

import { DeleteTypeFormValues } from '@/components/modals/card-modal/actions';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const deleteCard = async (data: DeleteTypeFormValues) => {
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
      card = await db.card.delete({
         where: {
            id,
            list: {
               board: {
                  orgId,
               },
            },
         },
      });

      await createAuditLog({
         entityTitle: card.title,
         entityId: card.id,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.DELETE,
      });
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Error al eliminar la tarjeta',
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      card,
      message: 'Tarjeta eliminada',
   };
};
