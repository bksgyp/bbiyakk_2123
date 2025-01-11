import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 먼저 myplan에서 해당 유저의 planid들을 찾음
        const myPlans = await prisma.myplan.findMany({
            where: {
                userid: token.id
            },
            select: {
                planid: true
            }
        });

        // 찾은 planid들로 completeplan 테이블에서 데이터 조회
        const fullplan = await prisma.completeplan.findMany({
            where: {
                planid: {
                    in: myPlans.map(plan => plan.planid)
                }
            }
        });

        return NextResponse.json({ fullplan });
    } catch (error) {
        //console.error('Error fetching fullplan:', error);
        return NextResponse.json({ error: 'Failed to fetch fullplan' }, { status: 500 });
    }
}
