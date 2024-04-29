import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ENTITY_TYPE } from '@prisma/client';

export async function GET(
   req: Request,
   { params }: { params: { id: string } }
) {
   try {
      const { userId, orgId } = auth();

      if (!userId || !orgId) {
         return new NextResponse('Unauthorized', { status: 401 });
      }

      const auditLogs = await db.auditLog.findMany({
         where: {
            orgId,
            entityId: params.id,
            entityType: ENTITY_TYPE.CARD,
         },
         orderBy: {
            createdAt: 'desc',
         },
         take: 3,
      });
      return NextResponse.json(auditLogs);
   } catch (e) {
      console.log(e);
      return new NextResponse('Internal Server Error', { status: 500 });
   }
}
