'use server';

import { UpdateBoardFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/board-title-form';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

export const updateBoard = async (formData: UpdateBoardFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         message: 'No tiene una organización seleccionada',
         ok: false,
      };
   }

   const { title, id } = formData;
   let board;
   try {
      board = await db.board.update({
         where: {
            id,
            orgId,
         },
         data: {
            title,
         },
      });

      if (!board) {
         return {
            message: 'Tablero no encontrado',
            ok: false,
         };
      }

      await createAuditLog({
         entityTitle: board.title,
         entityId: board.id,
         entityType: ENTITY_TYPE.BOARD,
         action: ACTION.UPDATE,
      });

      // Revalidate board
      revalidatePath(`/board/${board.id}`);
      revalidatePath(`/organization/${orgId}`);

      return {
         message: `Tablero ${board.title} actualizado correctamente`,
         ok: true,
         data: board,
      };
   } catch (e) {
      console.log(e);
      return {
         message: 'Error actualizando el tablero',
         ok: false,
      };
   }
};
