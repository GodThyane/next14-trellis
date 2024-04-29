import React, { Suspense } from 'react';
import { Separator } from '@/components/ui/separator';
import ActivityList from '@/app/(platform)/(dashboard)/organization/[id]/activity/_components/activity-list';
import BoardInfo from '@/app/(platform)/(dashboard)/organization/[id]/_components/board-info';
import { checkSubscription } from '@/lib/subscription';

const ActivityPage = async () => {
   const isPro = await checkSubscription();

   return (
      <div className={'w-full'}>
         <BoardInfo isPro={isPro} />
         <Separator className={'my-2'} />
         <Suspense fallback={<ActivityList.Skeleton />}>
            <ActivityList />
         </Suspense>
      </div>
   );
};

export default ActivityPage;
