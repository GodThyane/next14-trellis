interface Props {
   children: React.ReactNode;
}

import React from 'react';

const ListWrapper = ({ children }: Props) => {
   return (
      <li className={'shrink-0 h-full w-[272px] select-none'}>{children}</li>
   );
};

export default ListWrapper;
