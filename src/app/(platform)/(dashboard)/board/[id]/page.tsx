import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ListContainer from '@/app/(platform)/(dashboard)/board/[id]/_components/list-container';

interface Props {
   params: {
      id: string;
   };
}

const BoardByIdPage = async ({ params }: Props) => {
   const { orgId } = auth();
   const { id } = params;

   if (!orgId) {
      redirect('/select-org');
   }

   const lists = await db.list.findMany({
      where: {
         boardId: params.id,
         board: {
            orgId,
         },
      },
      include: {
         cards: {
            orderBy: {
               order: 'asc',
            },
         },
      },
      orderBy: {
         order: 'asc',
      },
   });


   return (
      <div className={'p-4 h-full overflow-x-auto'}>
         <ListContainer data={lists} boardId={id} />
      </div>
   );
};

export default BoardByIdPage;
