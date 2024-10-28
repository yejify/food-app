/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useLocationStore, useMapStore } from '@/zustand_store/store';
import { useEffect } from 'react';

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
  const { lat: storeLat, lng: storeLng, zoom: storeZoom } = useLocationStore();
  const setMap = useMapStore((state) => state.setMap);

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
              lat ?? storeLat,
              lng ?? storeLng
            ),
            level: zoom ?? storeZoom,
          };
          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(map);
        });
      } else {
        console.error('Kakao Maps API failed to load');
      }
    };

    document.head.appendChild(script);
  }, [lat, lng, zoom, storeLat, storeLng, storeZoom, setMap]);

  return <div id='map' className='w-full h-screen'></div>;
}
