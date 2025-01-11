import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const planlist = await prisma.planlist.findMany();
        return NextResponse.json(planlist);
    } catch (error) {
        //console.error('Error fetching planlist:', error);
        return NextResponse.json({ error: 'Failed to fetch planlist' }, { status: 500 });
    }
}
