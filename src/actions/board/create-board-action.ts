'use server';

import { db } from '@/lib/db';

import { revalidatePath } from 'next/cache';
import { BoardFormValues } from '@/components/form/form-popover';
import { auth } from '@clerk/nextjs/server';
import createAuditLog from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';

export const createBoard = async (formData: BoardFormValues) => {
   const { title } = formData;
   const { orgId } = auth();
   if (!orgId)
      return {
         message: 'No tiene una organización seleccionada',
         ok: false,
      };

   const canCreate = await hasAvailableCount();
   const isPro = await checkSubscription();
   if (!canCreate && !isPro)
      return {
         message:
            'Has alcanzado tu límite de tableros gratuitos. Actualiza tu plan para crear más.',
         ok: false,
         showProModal: true,
      };

   try {
      const board = await db.board.create({
         data: {
            title,
            orgId,
         },
      });
      if (!isPro) {
         await incrementAvailableCount();
      }

      await createAuditLog({
         entityTitle: board.title,
         entityId: board.id,
         entityType: ENTITY_TYPE.BOARD,
         action: ACTION.CREATE,
      });

      // Revalidate path
      revalidatePath(`/organization/${orgId}`);
      revalidatePath(`/board/${board.id}`);

      return {
         message: 'Tablero creado correctamente',
         ok: true,
         data: board,
      };
   } catch (e) {
      console.log(e);
      return {
         message: 'Error creating board',
         ok: false,
      };
   }
};
