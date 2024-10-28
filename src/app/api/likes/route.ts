import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/db';

// POST 요청: 댓글 생성
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { storeId, body }: { storeId: number; body: string } = await req.json();

  try {
    const comment = await prisma.comment.create({
      data: {
        storeId,
        body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// DELETE 요청: 댓글 삭제
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!session?.user || !id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

// GET 요청: 댓글 목록 조회
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const storeId = searchParams.get('storeId');
  const user = searchParams.get('user') === 'true';

  const skipPage = parseInt(page) - 1;
  const session = await getServerSession(authOptions);

  try {
    const count = await prisma.comment.count({
      where: {
        storeId: storeId ? parseInt(storeId) : undefined,
        userId: user ? session?.user?.id : undefined,
      },
    });

    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        storeId: storeId ? parseInt(storeId) : undefined,
        userId: user ? session?.user?.id : undefined,
      },
      skip: skipPage * parseInt(limit),
      take: parseInt(limit),
      include: { user: true, store: true },
    });

    return NextResponse.json({
      data: comments,
      page: parseInt(page),
      totalPage: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
