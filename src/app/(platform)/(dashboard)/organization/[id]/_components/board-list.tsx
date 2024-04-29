import React from 'react';
import { HelpCircle, User2 } from 'lucide-react';
import Hint from '@/components/hint';
import FormPopover from '@/components/form/form-popover';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { getAvailableCount } from '@/lib/org-limit';
import { MAX_FREE_BOARDS } from '@/constants/boards';
import { checkSubscription } from '@/lib/subscription';

const BoardList = async () => {
   const { orgId } = auth();

   if (!orgId) redirect('/select-org');

   const boards = await db.board.findMany({
      where: {
         orgId,
      },
      orderBy: {
         createdAt: 'desc',
      },
   });

   const availableCount = await getAvailableCount();
   const isPro = await checkSubscription();

   return (
      <div className={'space-y-4'}>
         <div className="flex items-center font-semibold text-lg text-neutral-700">
            <User2 className={'h-6 w-6 mr-2'} />
            Tus tableros
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => (
               <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className={
                     'group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-400 rounded-sm h-full w-full p-2 overflow-hidden'
                  }
               >
                  <div
                     className={
                        'absolute inset-0 bg-black/10 group-hover:bg-black/20 transition p-2'
                     }
                  >
                     <p className={'relative font-semibold text-white'}>
                        {board.title}
                     </p>
                  </div>
               </Link>
            ))}

            <FormPopover
               text={'Crear nuevo tablero'}
               align={'center'}
               sideOffset={10}
               side={'right'}
            >
               <div
                  className={
                     'aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition'
                  }
               >
                  <p className={'text-sm'}>Crear nuevo tablero</p>
                  <span className={'text-xs'}>
                     {isPro
                        ? 'Ilimitado'
                        : `${MAX_FREE_BOARDS - availableCount} restantes`}
                  </span>
                  <Hint
                     sideOffset={40}
                     description={
                        'Los espacios de trabajo gratuitos pueden tener hasta 5 tableros abiertos. Para tableros ilimitados, actualice este espacio de trabajo.'
                     }
                  >
                     <HelpCircle
                        className={
                           'absolute bottom-2 right-2 h-[14px] w-[14px]'
                        }
                     />
                  </Hint>
               </div>
            </FormPopover>
         </div>
      </div>
   );
};

export default BoardList;

const BoardListSkeleton = () => {
   return (
      <div className={'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'}>
         <Skeleton className={'aspect-video h-full w-full p-2'} />
         <Skeleton className={'aspect-video h-full w-full p-2'} />
         <Skeleton className={'aspect-video h-full w-full p-2'} />
         <Skeleton className={'aspect-video h-full w-full p-2'} />
         <Skeleton className={'aspect-video h-full w-full p-2'} />
         <Skeleton className={'aspect-video h-full w-full p-2'} />
         <Skeleton className={'aspect-video h-full w-full p-2'} />
      </div>
   );
};

BoardList.Skeleton = BoardListSkeleton;
