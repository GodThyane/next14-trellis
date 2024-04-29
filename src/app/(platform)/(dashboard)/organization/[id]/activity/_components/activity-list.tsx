import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ActivityItem from '@/components/activity-item';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityList = async () => {
   const { orgId } = auth();

   if (!orgId) {
      redirect('/select-org');
   }

   const auditLogs = await db.auditLog.findMany({
      where: {
         orgId,
      },
      orderBy: {
         createdAt: 'desc',
      },
   });

   return (
      <ol className={'space-y-4 mt-4'}>
         <p
            className={
               'hidden last:block text-xs text-center text-muted-foreground'
            }
         >
            No se encontró actividad dentro de esta organización
         </p>
         {auditLogs.map((auditLog) => (
            <ActivityItem item={auditLog} key={auditLog.id} />
         ))}
      </ol>
   );
};

export default ActivityList;

const ActivityListSkeleton = () => {
   return (
      <ol className={'space-y-4 mt-4'}>
         <Skeleton className={'w-[80%] h-14'} />
         <Skeleton className={'w-[50%] h-14'} />
         <Skeleton className={'w-[70%] h-14'} />
         <Skeleton className={'w-[80%] h-14'} />
         <Skeleton className={'w-[75%] h-14'} />
      </ol>
   );
};

ActivityList.Skeleton = ActivityListSkeleton;
