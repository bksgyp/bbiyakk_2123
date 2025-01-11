import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, content, hashtag1, hashtag2, count, maxcount } = await request.json();

        const planlist = await prisma.planlist.create({
            data: {
                title,
                content,
                hashtag1,
                hashtag2,
                count,
                maxcount: parseInt(maxcount)
            },
        });

        return NextResponse.json({ success: true, planlist });
    } catch (error) {
        //console.error('Error creating planlist:', error);
        return NextResponse.json({ error: 'Failed to create planlist' }, { status: 500 });
    }
}
