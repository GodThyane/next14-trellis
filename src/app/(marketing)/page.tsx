import React from 'react';
import { Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

const textFont = Poppins({
   subsets: ['latin'],
   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const MarketingPage = () => {
   return (
      <div className={'flex items-center justify-center flex-col'}>
         <div
            className={cn(
               'flex items-center justify-center flex-col font-bold',
               textFont.className
            )}
         >
            <div
               className={
                  'mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase'
               }
            >
               <Medal className={'h-6 w-6 mr-2'} />
               Gestión de tareas número 1
            </div>
            <h1
               className={
                  'text-3xl md:text-6xl text-center text-neutral-800 mb-6'
               }
            >
               Trellis ayuda al equipo a moverse
            </h1>
            <div
               className={
                  'text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit'
               }
            >
               trabajar hacia adelante.
            </div>
         </div>
         <p
            className={cn(
               'text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto',
               textFont.className
            )}
         >
            Colabora, gestiona proyectos y alcanza nuevos picos de
            productividad. Desde los rascacielos hasta la oficina en casa, la
            forma en que trabaja su equipo es única: consígalo todo con Trellis.
         </p>
         <Button className={'mt-6'} size={'lg'} asChild>
            <Link href={'/sign-up'}>Consigue Trellis gratis</Link>
         </Button>
      </div>
   );
};

export default MarketingPage;
