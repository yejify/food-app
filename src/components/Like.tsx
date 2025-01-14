import { StoreType } from '@/interface';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface LikeProps {
  storeId: number;
  className?: string;
}

export default function Like({ storeId, className }: LikeProps) {
  const { data: session, status } = useSession();

  const config = {
    url: `/api/stores?id=${storeId}`,
  };

  const { data: store, refetch } = useQuery<StoreType>({
    queryKey: [`like-store-${storeId}`],
    queryFn: async () => {
      const { data } = await axios(config);
      return data as StoreType;
    },
    refetchOnWindowFocus: false,
    enabled: !!storeId,
  });

  const toggleLike = async () => {
    if (session?.user && store) {
      try {
        const like = await axios.post('/api/likes', {
          storeId: store?.id,
        });

        if (like.status === 201) {
          toast.success('가게를 찜했습니다.');
        } else if (like.status === 204) {
          toast.warn('찜을 취소했습니다.');
        }

        refetch();
      } catch (e) {
        console.log(e);
      }
    } else if (status === 'unauthenticated') {
      toast.warn('로그인 후 이용해주세요.');
    }
  };

  return (
    <button type='button' onClick={toggleLike} className={className}>
      {status === 'authenticated' && store?.likes?.length ? (
        <AiFillHeart className='hover:text-red-600 focus:text-red-600 text-red-500' />
      ) : (
        <AiOutlineHeart className='hover:text-red-600 focus:text-red-600' />
      )}
    </button>
  );
}
