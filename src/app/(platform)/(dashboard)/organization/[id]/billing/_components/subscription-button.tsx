'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StripeRedirectSchema } from '@/actions/stripe/stripe-redirect.schema';
import { stripeRedirect } from '@/actions/stripe/stripe-redirect.action';
import { toast } from 'sonner';
import { useProModal } from '@/stores/use-pro-modal';

interface SubscriptionButtonProps {
   isPro?: boolean;
}

const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
   const {
      handleSubmit,
      formState: { isSubmitting },
   } = useForm({
      resolver: zodResolver(StripeRedirectSchema),
   });

   const { onOpen } = useProModal();

   const onSubmit = async () => {
      if (isPro) {
         const { ok, message, data } = await stripeRedirect();
         if (ok && data) {
            window.location.href = data;
         } else {
            toast.error(message);
         }
      } else {
         onOpen();
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <Button variant={'primary'} disabled={isSubmitting}>
            {isPro ? 'Administrar suscripción' : 'Actualizar a Pro'}
         </Button>
      </form>
   );
};

export default SubscriptionButton;
