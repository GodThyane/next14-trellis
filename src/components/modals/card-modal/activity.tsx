'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AuditLog } from '@prisma/client';
import { Activity } from 'lucide-react';
import ActivityItem from '@/components/activity-item';

interface ActivityCardProps {
   items: AuditLog[];
}

const ActivityCard = ({ items }: ActivityCardProps) => {
   return (
      <div className={'flex items-start gap-x-3 w-full'}>
         <Activity size={20} className={'mt-0.5 text-neutral-700'} />
         <div className={'w-full'}>
            <p>Actividad</p>
            <ol className="mt-2 space-y-4">
               {items.map((item) => (
                  <ActivityItem key={item.id} item={item} />
               ))}
            </ol>
         </div>
      </div>
   );
};

export default ActivityCard;

const ActivitySkeleton = () => {
   return (
      <div className="flex items-start gap-x-3 w-full">
         <Skeleton className="w-6 h-6 bg-neutral-200" />
         <div className="w-full">
            <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
            <Skeleton className="w-full h-10 bg-neutral-200" />
         </div>
      </div>
   );
};

ActivityCard.Skeleton = ActivitySkeleton;
