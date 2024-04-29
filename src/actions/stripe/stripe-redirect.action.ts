'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { absoluteUrl } from '@/lib/utils';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

export const stripeRedirect = async () => {
   const { orgId } = auth();
   const user = await currentUser();

   if (!orgId) {
      return {
         ok: false,
         message: 'No se encontró la organización',
      };
   }

   if (!user) {
      return {
         ok: false,
         message: 'Unauthorized',
      };
   }

   const settingsUrl = absoluteUrl(`/organization/${orgId}`);
   let url = '';

   try {
      const orgSubscription = await db.orgSubscription.findUnique({
         where: {
            orgId,
         },
      });

      if (orgSubscription?.stripeCustomerId) {
         const stripeSession = await stripe.billingPortal.sessions.create({
            customer: orgSubscription.stripeCustomerId,
            return_url: settingsUrl,
         });

         url = stripeSession.url;
      } else {
         const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
               {
                  price_data: {
                     currency: 'USD',
                     product_data: {
                        name: 'Trellis Pro',
                        description: 'Tableros ilimitados para tu organización',
                     },
                     unit_amount: 2000,
                     recurring: {
                        interval: 'month',
                     },
                  },
                  quantity: 1,
               },
            ],
            metadata: {
               orgId,
            },
         });

         url = stripeSession.url ?? '';
      }
   } catch (e) {
      console.log(e);
      return {
         ok: false,
         message: 'No se pudo redirigir a la página de pago',
      };
   }

   revalidatePath(`/organization/${orgId}`);
   return { data: url, ok: true, message: 'Redirecting to Stripe' };
};
