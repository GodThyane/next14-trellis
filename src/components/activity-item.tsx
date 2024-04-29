import React from 'react';
import { AuditLog } from '@prisma/client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { generateLogMessage } from '@/lib/generate-log-message';
import { format } from 'date-fns';

interface Props {
   item: AuditLog;
}

import { es } from 'date-fns/locale';

const ActivityItem = ({ item }: Props) => {
   return (
      <li className={'flex items-center gap-x-2'}>
         <Avatar className={'h-8 w-8'}>
            <AvatarImage src={item.userImage} alt={item.userName} />
         </Avatar>
         <div className={'flex flex-col space-y-0.5'}>
            <p className={'text-sm text-muted-foreground'}>
               <span className={'font-semibold lowercase text-neutral-700'}>
                  {item.userName}
               </span>{' '}
               {generateLogMessage(item)}
            </p>
            <p className={'text-xs text-muted-foreground'}>
               {format(new Date(item.createdAt), "MMM d, yyyy 'a las' h:mm a", {
                  locale: es,
               })}
            </p>
         </div>
      </li>
   );
};

export default ActivityItem;
