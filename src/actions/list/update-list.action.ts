'use server';

import { UpdateListFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/list-header';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const updateList = async (formData: UpdateListFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se encontró la organización',
      };
   }
   const { title, id, boardId } = formData;
   let list;
   try {
      list = await db.list.update({
         where: {
            id,
            boardId,
            board: {
               orgId,
            },
         },
         data: {
            title,
         },
      });

      if (!list) {
         return {
            ok: false,
            message: 'No se encontró la lista',
         };
      }

      await createAuditLog({
         entityTitle: list.title,
         entityId: list.id,
         entityType: ENTITY_TYPE.LIST,
         action: ACTION.UPDATE,
      });
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'Ocurrió un error al actualizar la lista',
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      message: `Lista ${list.title} actualizada`,
      data: list,
   };
};
