/* eslint-disable @next/next/no-img-element */
import { useSession } from 'next-auth/react';
import CommentForm from './CommentForm';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CommentApiResponse } from '@/interface';
import CommentList from './CommentList';
import Pagination from '../Pagination';
import { useSearchParams } from 'next/navigation';

interface CommentProps {
  storeId: number;
}

export default function Comments({ storeId }: CommentProps) {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const page = searchParams?.get('page') || '1';

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
    enabled: !!storeId && !!page,
    staleTime: 5000,
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
          <CommentList comments={comments} refetch={refetch} />
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
