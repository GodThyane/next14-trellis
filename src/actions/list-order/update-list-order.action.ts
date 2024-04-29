'use server';
import { auth } from '@clerk/nextjs/server';
import { UpdateListOrderFormValues } from '@/app/(platform)/(dashboard)/board/[id]/_components/list-container';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const updateListOrder = async (formData: UpdateListOrderFormValues) => {
   const { orgId } = auth();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se pudo obtener el id de la organización',
      };
   }

   const { items, boardId } = formData;
   let lists;

   try {
      const transaction = items.map((list) =>
         db.list.update({
            where: {
               id: list.id,
               board: {
                  orgId,
               },
            },
            data: {
               order: list.order,
            },
         })
      );

      lists = await db.$transaction(transaction);
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'No se pudo actualizar el orden de las listas',
      };
   }

   // Revalidar
   revalidatePath(`/board/${boardId}`);
   return {
      ok: true,
      message: 'Se actualizó el orden de las listas',
      data: lists,
   };
};
