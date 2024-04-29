'use server';

import { DeleteListFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/list-options';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const deleteList = async (formData: DeleteListFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         message: 'No tiene una organización seleccionada',
         ok: false,
      };
   }

   const { id, boardId } = formData;

   try {
      const list = await db.list.delete({
         where: {
            id,
            boardId,
            board: {
               orgId,
            },
         },
      });

      await createAuditLog({
         entityTitle: list.title,
         entityId: list.id,
         entityType: ENTITY_TYPE.LIST,
         action: ACTION.DELETE,
      });
   } catch (e) {
      console.log(e);
      return {
         message: 'Error al eliminar la lista',
         ok: false,
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      message: 'Lista eliminada correctamente',
      ok: true,
   };
};
