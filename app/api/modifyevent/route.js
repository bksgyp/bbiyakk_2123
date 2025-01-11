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
    const updatedPlan = await prisma.userplan.updateMany({
      where: {
        user_id: token.id,
        title: eventData.title,
      },
      data: {
        startdate: eventData.startdate,
        enddate: eventData.enddate,
      },
    });

    if (updatedPlan.count === 0) {
      return NextResponse.json({ error: 'No event found with the given title' }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedPlan });
  } catch (error) {
    //console.log(error);
    return NextResponse.json({ error: 'Failed to update event in userplan' }, { status: 500 });
  }
}
