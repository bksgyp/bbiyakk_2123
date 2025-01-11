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
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const virtualfullplan = [];

        myplan.forEach(plan => {
            const days = [plan.mon, plan.tue, plan.wed, plan.thr, plan.fri, plan.sat, plan.sun];
            
            for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay(); // 0(일요일)부터 6(토요일)
                
                if (days[dayOfWeek === 0 ? 6 : dayOfWeek - 1] === 1) {
                    virtualfullplan.push({
                        title: plan.icon,
                        date: new Date(d),
                        days: days,
                        planid: plan.planid
                    });
                }
            }
        });

        const plantitle = await prisma.planlist.findMany({
            where: { id: myplan.planid }
        });

        virtualfullplan.forEach(data => {
            const matchingPlan = myplan.find(plan => plan.icon === data.title);
            if (matchingPlan) {
                const matchingTitle = plantitle.find(title => title.id === matchingPlan.planid);
                data.rtitle = matchingTitle?.title || '';
            }
        });

        return NextResponse.json({ virtualfullplan });
    } catch (error) {
        //console.error('Error fetching virtualfullplan:', error);
        return NextResponse.json({ error: 'Failed to fetch virtualfullplan' }, { status: 500 });
    }
}
