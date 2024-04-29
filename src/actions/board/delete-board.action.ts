'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { decreaseAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';

export const deleteBoard = async (id: string) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         message: 'No tiene una organización seleccionada',
         ok: false,
      };
   }

   const isPro = await checkSubscription();

   try {
      const board = await db.board.delete({
         where: {
            id,
            orgId,
         },
      });

      if (!isPro) {
         await decreaseAvailableCount();
      }

      await createAuditLog({
         entityTitle: board.title,
         entityId: board.id,
         entityType: ENTITY_TYPE.BOARD,
         action: ACTION.DELETE,
      });
   } catch (e) {
      console.log(e);
      return {
         message: 'Error al eliminar el tablero',
         ok: false,
      };
   }

   revalidatePath(`/organization/${orgId}`);
   redirect(`/organization/${orgId}`);
};
