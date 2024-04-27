import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
   return (
      <Link href={'/'}>
         <div
            className={
               'hover:opacity-75 transition items-center hidden md:flex'
            }
         >
            <Image src={'/logo.png'} alt={'Logo'} height={120} width={120} />
         </div>
      </Link>
   );
};

export default Logo;
