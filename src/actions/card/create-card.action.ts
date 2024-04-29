'use server';

import { CreateCardFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/card-form';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const createCard = async (formData: CreateCardFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         message: 'No tiene una organización seleccionada',
         ok: false,
      };
   }

   const { title, listId } = formData;

   let card;

   try {
      const list = await db.list.findUnique({
         where: {
            id: listId,
            board: {
               orgId,
            },
         },
      });

      if (!list) {
         return {
            message: 'No se encontró la lista',
            ok: false,
         };
      }

      const lastCard = await db.card.findFirst({
         where: {
            listId,
         },
         orderBy: {
            order: 'desc',
         },
         select: {
            order: true,
         },
      });
      const newOrder = lastCard ? lastCard.order + 1 : 1;

      card = await db.card.create({
         data: {
            title,
            listId,
            order: newOrder,
         },
         include: {
            list: {
               select: {
                  boardId: true,
               },
            },
         },
      });

      await createAuditLog({
         entityId: card.id,
         entityTitle: card.title,
         entityType: ENTITY_TYPE.CARD,
         action: ACTION.CREATE,
      });
   } catch (e) {
      console.log(e);
      return {
         message: 'Error intentando crear la tarjeta',
         ok: false,
      };
   }

   revalidatePath(`/board/${card.list.boardId}`);
   return {
      message: 'Tarjeta creada correctamente',
      ok: true,
      data: card,
   };
};
