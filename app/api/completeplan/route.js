import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';


export async function POST(request) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, rtitle, start } = body;

        const findplanid = await prisma.planlist.findFirst({
            where:{
                title: rtitle
            }
        });

        // completeplan 테이블에 데이터 추가
        const date = new Date(start);
        const completeplan = await prisma.completeplan.create({
            data: {
                planid: findplanid.id,
                date: date,
                userid: token.id
            }
        });

        return NextResponse.json({ response: 'ok',completeplan });
    } catch (error) {
        console.error('Error creating completeplan:', error);
        return NextResponse.json({ error: 'Failed to create completeplan' }, { status: 500 });
    }
}
