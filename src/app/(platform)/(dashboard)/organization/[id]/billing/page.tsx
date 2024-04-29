import React from 'react';
import { checkSubscription } from '@/lib/subscription';
import BoardInfo from '@/app/(platform)/(dashboard)/organization/[id]/_components/board-info';
import {Separator} from "@/components/ui/separator";
import SubscriptionButton from "@/app/(platform)/(dashboard)/organization/[id]/billing/_components/subscription-button";

const BillingPage = async () => {
   const isPro = await checkSubscription();

   return (
      <div className={'w-full'}>
         <BoardInfo isPro={isPro} />
          <Separator className={'my-2'} />
          <SubscriptionButton isPro={isPro}>

          </SubscriptionButton>
      </div>
   );
};

export default BillingPage;
