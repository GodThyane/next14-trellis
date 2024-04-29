'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCardModalStore } from '@/stores/use-card-modal';
import { useQuery } from '@tanstack/react-query';
import { CardWithList } from '@/types';
import { fetcher } from '@/lib/fetcher';
import Header from '@/components/modals/card-modal/header';
import Description from './description';
import Actions from '@/components/modals/card-modal/actions';
import { AuditLog } from '@prisma/client';
import ActivityCard from '@/components/modals/card-modal/activity';

const CardModal = () => {
   const id = useCardModalStore((state) => state.id);
   const isOpen = useCardModalStore((state) => state.isOpen);
   const onClose = useCardModalStore((state) => state.onClose);

   const { data: cardData } = useQuery<CardWithList>({
      queryKey: ['card', id],
      queryFn: () => fetcher(`/api/cards/${id}`),
   });

   const { data: auditLogsData } = useQuery<AuditLog[]>({
      queryKey: ['card-logs', id],
      queryFn: () => fetcher(`/api/cards/${id}/logs`),
   });

   if (!cardData) return null;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
            <div className={'grid grid-cols-1 md:grid-cols-4 md:gap-4'}>
               <div className="col-span-3">
                  <div className="w-full space-y-6">
                     {!cardData ? (
                        <Description.Skeleton />
                     ) : (
                        <Description data={cardData} />
                     )}
                     {!auditLogsData ? (
                        <ActivityCard.Skeleton />
                     ) : (
                        <ActivityCard items={auditLogsData} />
                     )}
                  </div>
               </div>
               {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default CardModal;
