import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { mode } = await request.json();

        const user = await prisma.user.update({
            where: { 
                id: token.id
            },
            data: {
                mode: mode ? 1 : 0,
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Error updating mode:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
