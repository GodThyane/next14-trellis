import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import BoardNavbar from '@/app/(platform)/(dashboard)/board/[id]/_components/board-navbar';

export async function generateMetadata({ params }: { params: { id: string } }) {
   const { orgId } = auth();

   if (!orgId) {
      return {
         title: 'Tablero',
      };
   }

   const board = await db.board.findFirst({
      where: {
         id: params.id,
         orgId,
      },
   });

   return {
      title: board?.title ?? 'Tablero',
   };
}

const BoardByIdLayout = async ({
   children,
   params,
}: {
   children: React.ReactNode;
   params: { id: string };
}) => {
   const { orgId } = auth();

   if (!orgId) {
      redirect('/select-org');
   }

   const board = await db.board.findFirst({
      where: {
         id: params.id,
         orgId,
      },
   });

   if (!board) {
      notFound();
   }

   return (
      <main className={'relative h-full bg-no-repeat bg-cover bg-center'}>
         <BoardNavbar board={board}></BoardNavbar>
         <div className={'absolute inset-0 bg-black/10'} />
         <div className={'relative pt-28 h-full'}>{children}</div>
      </main>
   );
};

export default BoardByIdLayout;
