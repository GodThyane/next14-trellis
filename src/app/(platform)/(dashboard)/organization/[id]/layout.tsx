import React from 'react';
import OrgControl from '@/app/(platform)/(dashboard)/organization/[id]/_components/org-control';

const OrganizationByIdLayout = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   return (
      <>
         <OrgControl />
         {children}
      </>
   );
};

export default OrganizationByIdLayout;
