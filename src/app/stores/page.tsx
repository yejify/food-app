'use client';

export const dynamic = 'force-dynamic'; // 페이지를 동적 렌더링하도록 설정

import React, { useRef, useEffect, useCallback } from 'react';
import { StoreType } from '@/interface';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import Loading from '@/components/Loading';
import Loader from '@/components/Loader';
import SearchFilter from '@/components/SearchFilter';
import StoreList from '@/components/StoreList';

import { useSearchStore } from '@/zustand_store/store';

export default function StoreListPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;

  const { q, district } = useSearchStore();

  const searchParams = {
    q,
    district,
  };

  const fetchStores = async ({ pageParam = 1 }) => {
    const { data } = await axios('/api/stores?page=' + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
        ...searchParams,
      },
    });

    return data;
  };

  const {
    data: stores,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['stores', searchParams], // 쿼리 키 정의
    queryFn: ({ pageParam = 1 }) => fetchStores({ pageParam }), // 데이터 fetching 함수
    getNextPageParam: (lastPage) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined, // 다음 페이지 계산
    initialPageParam: 1, // 초기 페이지 설정
  });

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      console.error(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext();
      }, 500);
    }

    return () => clearTimeout(timerId);
  }, [fetchNext, isPageEnd, hasNextPage]);

  if (isError) {
    return (
      <div className='w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold'>
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className='px-4 md:max-w-4xl mx-auto py-8'>
      <SearchFilter />
      <ul role='list' className='divide-y divide-gray-100'>
        {isLoading ? (
          <Loading />
        ) : (
          stores?.pages?.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((store: StoreType, i: number) => (
                <StoreList store={store} i={i} key={i} />
              ))}
            </React.Fragment>
          ))
        )}
      </ul>
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className='w-full touch-none h-10 mb-10' ref={ref} />
    </div>
  );
}
