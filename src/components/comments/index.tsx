'use client';

import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CommentApiResponse } from '@/interface';
import CommentList from './CommentList';
import Pagination from '../Pagination';
import { useSearchParams } from 'next/navigation'; // 쿼리 파라미터 처리

interface CommentProps {
  storeId: number;
}

export default function Comments({ storeId }: CommentProps) {
  const { status } = useSession();
  const searchParams = useSearchParams(); // 쿼리 파라미터 가져오기
  const page = searchParams?.get('page') || '1'; // 쿼리 파라미터에서 페이지 가져오기

  const fetchComments = async () => {
    const { data } = await axios(
      `/api/comments?storeId=${storeId}&limit=5&page=${page}`
    );

    return data as CommentApiResponse;
  };

  const {
    data: comments,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['comments', storeId, page],
    queryFn: fetchComments,
  });

  return (
    <div className='md:max-w-2xl py-8 px-2 mb-20 mx-auto'>
      {status === 'authenticated' && (
        <CommentForm storeId={storeId} refetch={refetch} />
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <CommentList comments={comments} />
          <Pagination
            total={comments?.totalPage || 1}
            page={page}
            pathname={`/stores/${storeId}`}
          />
        </>
      )}
    </div>
  );
}
