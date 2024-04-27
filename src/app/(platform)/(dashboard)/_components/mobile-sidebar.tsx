'use client';

import React, { useEffect, useState } from 'react';
import { useMobileSidebarStore } from '@/stores/mobile-sidebar-store';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Sidebar from '@/app/(platform)/(dashboard)/_components/sidebar';

const MobileSidebar = () => {
   const pathName = usePathname();
   const [isMounted, setIsMounted] = useState(false);

   const onOpen = useMobileSidebarStore((state) => state.onOpen);
   const onClose = useMobileSidebarStore((state) => state.onClose);
   const isOpen = useMobileSidebarStore((state) => state.isOpen);

   useEffect(() => {
      setIsMounted(true);
   }, []);

   useEffect(() => {
      onClose();
   }, [pathName, onClose]);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth >= 768) {
            onClose();
         }
      };

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [onClose]);

   if (!isMounted) {
      return null;
   }

   return (
      <>
         <Button
            onClick={onOpen}
            className={'block md:hidden mr-2'}
            variant={'ghost'}
            size={'sm'}
         >
            <Menu className={'h-4 w-4'} />
         </Button>
         <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side={'left'} className={'p-2 pt-10'}>
               <Sidebar />
            </SheetContent>
         </Sheet>
      </>
   );
};

export default MobileSidebar;
