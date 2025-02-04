'use client';

import { Suspense } from 'react';
import Loading from '@/components/Loading';
import StoreList from '@/components/StoreList';
import { LikeApiResponse, LikeInterface } from '@/interface';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/components/Pagination';

function LikesContent() {
  const searchParams = useSearchParams();
  const page = searchParams?.get('page') || '1';

  const fetchLikes = async () => {
    const { data } = await axios(`/api/likes?limit=10&page=${page}`);
    return data as LikeApiResponse;
  };

  const {
    data: likes,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['likes', page],
    queryFn: fetchLikes,
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
  });

  if (isError) {
    return (
      <div className='w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold'>
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className='px-4 md:max-w-4xl mx-auto py-8'>
      <h3 className='text-lg font-semibold'>찜한 맛집</h3>
      <div className='mt-1 text-gray-500 text-sm'>찜한 가게 리스트입니다.</div>
      <ul role='list' className='divide-y divide-gray-100 mt-10'>
        {isLoading ? (
          <Loading />
        ) : (
          likes?.data?.map((like: LikeInterface) => (
            <StoreList i={like.id} store={like.store} key={like.id} />
          ))
        )}
      </ul>
      <Pagination
        total={likes?.totalPage}
        page={page}
        pathname='/users/likes'
      />
    </div>
  );
}

export default function LikesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LikesContent />
    </Suspense>
  );
}
