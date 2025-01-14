import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/db';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { storeId }: { storeId: number } = await req.json();

  try {
    let like = await prisma.like.findFirst({
      where: {
        storeId,
        userId: session.user.id,
      },
    });

    if (like) {
      await prisma.like.delete({ where: { id: like.id } });
      // 상태 코드 204로 응답
      return new NextResponse(null, { status: 204 }); // 빈 본문과 함께 204 반환
    } else {
      like = await prisma.like.create({
        data: { storeId, userId: session.user.id },
      });
      return NextResponse.json(like, { status: 201 }); // 201 상태 코드로 응답
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to handle like' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const skipPage = (parseInt(page) - 1) * parseInt(limit);
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const count = await prisma.like.count({
      where: {
        userId: session.user.id,
      },
    });

    // 해당 유저가 좋아요를 누른 가게들을 가져옴
    const likes = await prisma.like.findMany({
      where: {
        userId: session.user.id,
      },
      skip: skipPage,
      take: parseInt(limit),
      include: { store: true },
    });

    return NextResponse.json({
      data: likes,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}
