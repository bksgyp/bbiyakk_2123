import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const myplan = await prisma.userplan.findMany({
      where: { user_id: token.id },
    });
    return NextResponse.json({ success: true, myplan });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch myplan' }, { status: 500 });
  }
}

export async function POST(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notice = await request.json();
  console.log("123", notice);

  try {
    const createdPlan = await prisma.userplan.create({
      data: {
        user_id: token.id,
        category: notice.category,
        detail: notice.detail,
        major: notice.major,
        title: notice.title,
        description: notice.description,
        startdate: notice.startdate,
        enddate: notice.enddate,
        link: notice.link,
      },
    });

    return NextResponse.json({ success: true, createdPlan });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to update myplan' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notice = await request.json();
  console.log("123", notice);

  try {
    const deletedPlan = await prisma.userplan.deleteMany({
      where: {
        user_id: token.id,
        title: notice.title,
      },
    });

    return NextResponse.json({ success: true, deletedPlan });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to delete myplan' }, { status: 500 });
  }
}
