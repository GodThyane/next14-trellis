'use server';

import { CreateListFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/list-form';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const createList = async (formData: CreateListFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se encontró la organización',
      };
   }
   const { title, boardId } = formData;
   let list;
   try {
      const board = await db.board.findUnique({
         where: {
            id: boardId,
            orgId,
         },
      });

      if (!board) {
         return {
            ok: false,
            message: 'No se encontró el tablero',
         };
      }

      const lastList = await db.list.findFirst({
         where: {
            boardId,
         },
         orderBy: {
            order: 'desc',
         },
         select: {
            order: true,
         },
      });

      const newOrder = lastList ? lastList.order + 1 : 1;

      list = await db.list.create({
         data: {
            title,
            boardId,
            order: newOrder,
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
         message: 'Ocurrió un error al crear la lista',
      };
   }

   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      data: list,
      message: 'Lista creada correctamente',
   };
};
