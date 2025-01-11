import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { category, detail } = await request.json();

  // 영어와 한글이 1대1대칭되어 있는 배열
  const collegeMapping = {
    "컴퓨터공학과": "CSE",
    "조선해양공학과": "NAOE",
    "화학공학과": "CHEM",
    "아태물류학과": "APSL",
    "문화콘텐츠문화경영학과":"CCM"
    // 필요한 다른 매핑 추가
  };

  if (category === "동아리") {
    try {
      const notices = await prisma.notice.findMany({
        where: { category: category },
      });
      return NextResponse.json({ success: true, notices });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
    }
  }

  if (category === "학과") {
    try {
      // 한글을 영어로 변환
      console.log(token);
      const englishCollege = collegeMapping[token.college] || token.college;
      const notices = await prisma.notice.findMany({
        where: { major: englishCollege, detail: detail },
      });
      return NextResponse.json({ success: true, notices });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
    }
  }

  try {
    const notices = await prisma.notice.findMany({
      where: { detail: detail },
    });

    if (!notices) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 });
  }
}
