'use client';

import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { locationState, mapState } from '@/atom';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
}

export default function Map({ lat, lng, zoom }: MapProps) {
  const setMap = useSetRecoilState(mapState);
  const location = useRecoilValue(locationState);
  //왜 얘가 문제인지 모르겠어어ㅓㅓㅓ
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new window.kakao.maps.LatLng(
              lat ?? location.lat,
              lng ?? location.lng
            ),
            level: zoom ?? location.zoom,
          };
          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(map);
        });
      } else {
        console.error('Kakao Maps API is not loaded.');
      }
    };
    document.head.appendChild(script);
  }, [lat, lng, zoom, location, setMap]);

  return <div id='map' className='w-full h-screen'></div>;
}
