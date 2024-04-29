import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
   req: Request,
   { params }: { params: { id: string } }
) {
   try {
      const { userId, orgId } = auth();

      if (!userId || !orgId) {
         return new NextResponse('Unauthorized', { status: 401 });
      }

      const card = await db.card.findUnique({
         where: {
            id: params.id,
            list: {
               board: {
                  orgId,
               },
            },
         },
         include: {
            list: {
               select: {
                  title: true,
               },
            },
         },
      });

      if (!card) {
         return new NextResponse('Not Found', { status: 404 });
      }

      return NextResponse.json(card);
   } catch (e) {
      console.log(e);
      return new NextResponse('Internal Server Error', { status: 500 });
   }
}
