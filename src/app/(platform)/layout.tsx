import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import { Toaster } from 'sonner';
import ModalProvider from '@/components/providers/modal-provider';
import QueryProvider from '@/components/providers/query-provider';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <ClerkProvider localization={esES}>
         <QueryProvider>
            <Toaster />
            <ModalProvider />
            {children}
         </QueryProvider>
      </ClerkProvider>
   );
};

export default PlatformLayout;
