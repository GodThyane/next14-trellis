import React, { Suspense } from 'react';
import BoardInfo from '@/app/(platform)/(dashboard)/organization/[id]/_components/board-info';
import { Separator } from '@/components/ui/separator';
import BoardList from '@/app/(platform)/(dashboard)/organization/[id]/_components/board-list';
import { checkSubscription } from '@/lib/subscription';

interface Props {
   params: {
      id: string;
   };
}

const OrganizationByIdPage = async ({ params }: Props) => {
   const isPro = await checkSubscription();

   return (
      <div className={'w-full mb-20'}>
         <BoardInfo isPro={isPro} />
         <Separator className={'my-4'} />
         <div className={'px-2 md:px-4'}>
            <Suspense fallback={<BoardList.Skeleton />}>
               <BoardList />
            </Suspense>
         </div>
      </div>
   );
};

export default OrganizationByIdPage;
