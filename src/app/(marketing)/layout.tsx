import React from 'react';
import Navbar from '@/app/(marketing)/_components/navbar';
import Footer from '@/app/(marketing)/_components/footer';

const MarketLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className={'h-full bg-slate-100'}>
         {/*Navbar*/}
         <Navbar />
         <main className={'pt-40 pb-20 bg-slate-100'}>{children}</main>
         {/*Footer*/}
         <Footer />
      </div>
   );
};

export default MarketLayout;
