import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. completeplan에서 userid가 일치하는 데이터 찾기
    const myplan = await prisma.completeplan.findMany({
      where: { userid: token.id },
    });

    // 2. myplan에서 userid와 planid가 일치하는 데이터 찾기 
    const myplanlist = await prisma.myplan.findMany({
      where: {
        userid: token.id,
        planid: {
          in: myplan.map(plan => plan.planid)
        }
      }
    });

    // 3. planlist에서 id가 일치하는 데이터 찾기
    const planlist = await prisma.planlist.findMany({
      where: {
        id: {
          in: myplanlist.map(plan => plan.planid)
        }
      }
    });

    const processedPlan = myplan.map(plan => {
      // planid로 매칭되는 myplan과 planlist 데이터 찾기
      const matchingMyPlan = myplanlist.find(p => p.planid === plan.planid);
      const matchingPlanlist = planlist.find(p => p.id === plan.planid);

      return {
        ...plan,
        startdate: plan.date.toISOString().split('T')[0],
        enddate: plan.date.toISOString().split('T')[0],
        title: matchingMyPlan ? matchingMyPlan.icon : '', // myplan의 icon을 title로
        rtitle: matchingPlanlist ? matchingPlanlist.title : '', // planlist의 title을 rtitle로
        days: matchingMyPlan ? [
          matchingMyPlan.mon,
          matchingMyPlan.tue, 
          matchingMyPlan.wed,
          matchingMyPlan.thr,
          matchingMyPlan.fri,
          matchingMyPlan.sat,
          matchingMyPlan.sun
        ] : []
      };
    });

    console.log("processedPlan", processedPlan);
    return NextResponse.json({ success: true, processedPlan });
  } catch (error) {
    console.log(error);
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
