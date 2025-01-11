import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { commitment, days, emoji, planid } = await request.json();

        const myplan = await prisma.myplan.create({
            data: {
                user: { connect: { id: token.id } },
                planlist: { connect: { id: parseInt(planid) } },
                icon: emoji,
                mon: days.includes('월') ? 1 : 0,
                tue: days.includes('화') ? 1 : 0,
                wed: days.includes('수') ? 1 : 0,
                thr: days.includes('목') ? 1 : 0,
                fri: days.includes('금') ? 1 : 0,
                sat: days.includes('토') ? 1 : 0,
                sun: days.includes('일') ? 1 : 0,
                commitment: commitment
            },
        });

        await prisma.planlist.update({
            where: {
                id: parseInt(planid)
            },
            data: {
                count: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ success: true, myplan });
    } catch (error) {
        //console.error('Error creating myplan:', error);
        return NextResponse.json({ error: 'Failed to create myplan' }, { status: 500 });
    }
}
