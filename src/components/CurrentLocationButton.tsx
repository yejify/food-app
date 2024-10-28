'use client';

import { useState } from 'react';
import { MdOutlineMyLocation } from 'react-icons/md';
import FullPageLoader from './FullPageLoader';
import { useMapStore } from '@/zustand_store/store';
import { toast } from 'react-toastify';

export default function CurrentLocationButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const map = useMapStore((state) => state.map);

  const handleCurrentPosition = () => {
    setLoading(true);

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: Infinity,
    };

    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          if (currentPosition) {
            map.panTo(currentPosition);
            toast.success('현재 위치로 이동되었습니다.');
          } else {
            toast.error('위치 정보를 불러오지 못했습니다.');
          }

          setLoading(false);
        },
        () => {
          toast.error('현재 위치를 가져올 수 없습니다.');
          setLoading(false);
        },
        options
      );
    } else {
      toast.error('지도 정보가 없습니다.');
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <button
        type='button'
        onClick={handleCurrentPosition}
        className='fixed z-10 p-2 shadow right-10 bottom-20 bg-white rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-200'
      >
        <MdOutlineMyLocation className='w-5 h-5' />
      </button>
    </>
  );
}
