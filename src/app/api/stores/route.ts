import { NextResponse } from 'next/server';
import prisma from '@/db';
import axios from 'axios';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') as string;
  const limit = searchParams.get('limit') as string;
  const q = searchParams.get('q') as string;
  const district = searchParams.get('district') as string;
  const id = searchParams.get('id') as string;

  const session = await getServerSession(authOptions);

  if (page) {
    const count = await prisma.store.count();
    const skipPage = parseInt(page) - 1;
    const stores = await prisma.store.findMany({
      orderBy: { id: 'asc' },
      where: {
        name: q ? { contains: q } : {},
        address: district ? { contains: district } : {},
      },
      take: parseInt(limit),
      skip: skipPage * 10,
    });

    return NextResponse.json(
      {
        page: parseInt(page),
        data: stores,
        totalCount: count,
        totalPage: Math.ceil(count / 10),
      },
      {
        status: 200,
      }
    );
  } else {
    const stores = await prisma.store.findMany({
      orderBy: { id: 'asc' },
      where: {
        id: id ? parseInt(id) : {},
      },
      include: {
        likes: {
          where: session ? { userId: session.user.id } : {},
        },
      },
    });

    return NextResponse.json(id ? stores[0] : stores, {
      status: 200,
    });
  }
}

export async function POST(req: Request) {
  // 데이터 생성을 처리한다
  const formData = await req.json();
  const headers = {
    Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
  };

  try {
    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
        formData.address
      )}`,
      { headers }
    );

    if (!data.documents || data.documents.length === 0) {
      return NextResponse.json(
        { error: '주소에 해당하는 위치 정보를 찾을 수 없습니다.' },
        { status: 400 }
      );
    }

    // lat와 lng를 Float으로 변환
    const lat = parseFloat(data.documents[0].y);
    const lng = parseFloat(data.documents[0].x);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: '유효하지 않은 좌표값입니다.' },
        { status: 400 }
      );
    }

    // Prisma를 통해 데이터 생성
    const result = await prisma.store.create({
      data: { ...formData, lat, lng },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '주소 검색 중 문제가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const formData = await req.json();
  const headers = {
    Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
  };

  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
      formData.address
    )}`,
    { headers }
  );

  const lat = parseFloat(data.documents[0].y);
  const lng = parseFloat(data.documents[0].x);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: '유효하지 않은 좌표값입니다.' },
      { status: 400 }
    );
  }

  const result = await prisma.store.update({
    where: { id: formData.id },
    data: { ...formData, lat, lng },
  });

  return NextResponse.json(result, {
    status: 200,
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  // 데이터 삭제
  if (id) {
    const result = await prisma.store.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(result, {
      status: 200,
    });
  }
  return NextResponse.json(null, {
    status: 500,
  });
}
