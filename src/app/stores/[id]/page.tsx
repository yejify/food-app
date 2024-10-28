'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { StoreType } from '@/interface';
import Loader from '@/components/Loader';
import Map from '@/components/Map';
import Marker from '@/components/Marker';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Like from '@/components/Like';
import Comments from '@/components/comments';

export default function StorePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { status } = useSession();

  const fetchStore = async () => {
    const { data } = await axios(`/api/stores?id=${id}`);
    return data as StoreType;
  };

  const {
    data: store,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['store', id],
    queryFn: fetchStore,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const handleDelete = async () => {
    const confirm = window.confirm('해당 가게를 삭제하시겠습니까?');
    if (confirm && store) {
      try {
        const result = await axios.delete(`/api/stores?id=${store.id}`);
        if (result.status === 200) {
          toast.success('가게를 삭제했습니다.');
          router.replace('/');
        } else {
          toast.error('다시 시도해주세요.');
        }
      } catch (e) {
        console.error(e);
        toast.error('다시 시도해주세요.');
      }
    }
  };

  if (isError) {
    return (
      <div className='w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold'>
        다시 시도해주세요
      </div>
    );
  }

  if (isFetching) {
    return <Loader className='mt-[20%]' />;
  }

  return (
    <>
      <div className='max-w-5xl mx-auto px-4 py-8'>
        <div className='md:flex justify-between items-center py-4 md:py-0'>
          <div className='px-4 sm:px-0'>
            <h3 className='text-base font-semibold leading-7 text-gray-900'>
              {store?.name}
            </h3>
            <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500'>
              {store?.address}
            </p>
          </div>
          {status === 'authenticated' && store && (
            <div className='flex items-center gap-4 px-4 py-3'>
              <Like storeId={store.id} />
              <Link
                href={`/stores/${store.id}/edit`}
                className='underline hover:text-gray-400 text-sm'
              >
                수정
              </Link>
              <button
                type='button'
                onClick={handleDelete}
                className='underline hover:text-gray-400 text-sm'
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className='mt-6 border-t border-gray-100'>
          <dl className='divide-y divide-gray-100'>
            {[
              { label: '카테고리', value: store?.category },
              { label: '주소', value: store?.address },
              { label: '위도', value: store?.lat },
              { label: '경도', value: store?.lng },
              { label: '연락처', value: store?.phone },
              { label: '식품인증구분', value: store?.foodCertifyName },
              { label: '업종명', value: store?.storeType },
            ].map(({ label, value }) => (
              <div
                key={label}
                className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'
              >
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  {label}
                </dt>
                <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'>
                  {value || '정보 없음'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {isSuccess && (
        <>
          <div className='overflow-hidden w-full mb-20 max-w-5xl mx-auto max-h-[600px]'>
            <Map
              lat={store?.lat ?? 37.497625203}
              lng={store?.lng ?? 127.03088379}
              zoom={1}
            />
            <Marker store={store} />
          </div>
          <Comments storeId={store.id} />
        </>
      )}
    </>
  );
}
