import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const eventData = await request.json();
  //console.log("Received event data:", eventData);

  try {
    const createdPlan = await prisma.userplan.create({
      data: {
        user_id: token.id,
        title: eventData.title,
        description: eventData.description,
        startdate: eventData.startdate,
        enddate: eventData.enddate,
      },
    });

    return NextResponse.json({ success: true, createdPlan });
  } catch (error) {
    //console.log(error);
    return NextResponse.json({ error: 'Failed to add event to userplan' }, { status: 500 });
  }
}
