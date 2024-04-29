import React from 'react';
import BoardTitleForm from '@/app/(platform)/(dashboard)/board/[id]/_components/board-title-form';
import BoardOptions from '@/app/(platform)/(dashboard)/board/[id]/_components/board-options';

export interface Board {
   id: string;
   orgId: string;
   title: string;
   imageId: string | null;
   imageThumbUrl: string | null;
   imageFullUrl: string | null;
   imageUserName: string | null;
   createdAt: Date;
   updatedAt: Date;
}

interface BoardNavbarProps {
   board: Board;
}

const BoardNavbar = ({ board }: BoardNavbarProps) => {
   return (
      <nav
         className={
            'w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white'
         }
      >
         <BoardTitleForm data={board} />
         <div className="ml-auto">
            <BoardOptions id={board.id} />
         </div>
      </nav>
   );
};

export default BoardNavbar;
