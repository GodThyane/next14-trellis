'use server';

import { CopyListFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/list-options';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const copyList = async (formData: CopyListFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se encontró la organización.',
      };
   }

   const { id, boardId } = formData;
   let list;

   try {
      const listToCopy = await db.list.findUnique({
         where: {
            id,
            boardId,
            board: {
               orgId,
            },
         },
         include: {
            cards: true,
         },
      });

      if (!listToCopy) {
         return {
            ok: false,
            message: 'No se encontró la lista a copiar.',
         };
      }

      const lastList = await db.list.findFirst({
         where: { boardId },
         orderBy: { order: 'desc' },
         select: { order: true },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      list = await db.list.create({
         data: {
            title: `${listToCopy.title} - Copia`,
            order: newOrder,
            boardId: listToCopy.boardId,
            cards: {
               createMany: {
                  data: listToCopy.cards.map((card) => ({
                     title: card.title,
                     description: card.description,
                     order: card.order,
                  })),
               },
            },
         },
         include: {
            cards: true,
         },
      });

      await createAuditLog({
         entityTitle: list.title,
         entityId: list.id,
         entityType: ENTITY_TYPE.LIST,
         action: ACTION.CREATE,
      });
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'No se pudo copiar la lista. Intente de nuevo.',
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      message: 'Lista copiada correctamente.',
      list,
   };
};
