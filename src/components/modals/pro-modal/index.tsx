'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProModal } from '@/stores/use-pro-modal';
import { Button } from '@/components/ui/button';
import { stripeRedirect } from '@/actions/stripe/stripe-redirect.action';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StripeRedirectSchema } from '@/actions/stripe/stripe-redirect.schema';
import { toast } from 'sonner';

const ProModal = () => {
   const { isOpen, onClose } = useProModal();
   const {
      handleSubmit,
      formState: { isSubmitting },
   } = useForm({
      resolver: zodResolver(StripeRedirectSchema),
   });

   const onSubscribe = async () => {
      const { data, ok, message } = await stripeRedirect();

      if (ok && data) {
         window.location.href = data;
      } else {
         toast.error(message);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className={'max-w-md p-0 overflow-hidden'}>
            {/*<div
               className={
                  'aspect-video relative flex items-center justify-center'
               }
            ></div>*/}
            <div className={'text-neutral-700 mx-auto space-y-6 p-6'}>
               <h2 className={'font-semibold text-xl'}>
                  ¡Actualiza a Trallis Pro hoy!
               </h2>
               <p className={'text-xs font-semibold text-neutral-500'}>
                  Explora lo mejor de Trallis
               </p>
               <div className={'pl-3'}>
                  <ul className={'text-sm list-disc'}>
                     <li>Tableros ilimitados</li>
                     <li>Listas de verificación avanzadas</li>
                     <li>Funciones de administración y seguridad</li>
                     <li>Y más!</li>
                  </ul>
               </div>
               <form onSubmit={handleSubmit(onSubscribe)}>
                  <Button
                     className={'w-full'}
                     variant={'primary'}
                     disabled={isSubmitting}
                  >
                     Actualizar a Trallis Pro
                  </Button>
               </form>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ProModal;
