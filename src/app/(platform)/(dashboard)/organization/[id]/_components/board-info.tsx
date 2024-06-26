'use client';

import React from 'react';
import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import { CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
   isPro: boolean;
}

const BoardInfo = ({ isPro }: Props) => {
   const { organization, isLoaded } = useOrganization();

   if (!isLoaded) return <BoardInfo.Skeleton />;

   return (
      <div className={'flex items-center gap-x-4'}>
         <div className={'w-[60px] h-[60px] relative'}>
            <Image
               fill
               src={organization?.imageUrl!}
               alt={organization?.name!}
               className={'rounded-md object-cover'}
            />
         </div>
         <div className={'space-y-1'}>
            <p className={'font-semibold text-xl'}>{organization?.name}</p>
            <div className={'flex items-center text-xs text-muted-foreground'}>
               <CreditCard className={'h-3 w-3 mr-1'} />
               {isPro ? 'Pro' : 'Gratis'}
            </div>
         </div>
      </div>
   );
};

export default BoardInfo;

const SkeletonInfo = () => {
   return (
      <div className={'flex items-center gap-x-4'}>
         <div className={'w-[60px] h-[60px] relative'}>
            <Skeleton className={'w-full h-full absolute'} />
         </div>
         <div className={'space-y-2'}>
            <Skeleton className={'h-10 2-[200px]'} />
            <div className="flex items-center">
               <Skeleton className="h-4 w-4" />
               <Skeleton className="h-4 w-[100px]" />
            </div>
         </div>
      </div>
   );
};

BoardInfo.Skeleton = SkeletonInfo;
