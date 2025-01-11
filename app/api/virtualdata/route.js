import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const myplan = await prisma.myplan.findMany({
      where: { userid: token.id },
    });

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const virtualData = [];

    myplan.forEach(plan => {
      const days = [plan.mon, plan.tue, plan.wed, plan.thr, plan.fri, plan.sat, plan.sun];
      
      // 과거 1달간의 날짜를 순회
      for (let d = new Date(oneMonthAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay(); // 0(일요일)부터 6(토요일)
        
        // 해당 요일이 1로 설정된 경우에만 데이터 생성
        if (days[dayOfWeek === 0 ? 6 : dayOfWeek - 1] === 1) {
          virtualData.push({
            title: plan.icon,
            date: new Date(d),
            days: days
          });
        }
      }
    });

    const plantitle = await prisma.planlist.findMany({
      where: { id: myplan.planid }
    });

    virtualData.forEach(data => {
      const matchingPlan = myplan.find(plan => plan.icon === data.title);
      if (matchingPlan) {
        const matchingTitle = plantitle.find(title => title.id === matchingPlan.planid);
        data.rtitle = matchingTitle?.title || '';
      }
    });

    return NextResponse.json({ success: true, virtualData });
  } catch (error) {
    //console.log(error);
    return NextResponse.json({ error: 'Failed to fetch virtual data' }, { status: 500 });
  }
}