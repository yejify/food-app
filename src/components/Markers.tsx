'use client';

import { StoreType } from '@/interface';
import {
  useCurrentStore,
  useLocationStore,
  useMapStore,
} from '@/zustand_store/store';
import { useEffect, useCallback } from 'react';

interface MarkerProps {
  stores: StoreType[];
}

export default function Markers({ stores }: MarkerProps) {
  const map = useMapStore((state) => state.map);
  const setCurrentStore = useCurrentStore((state) => state.setCurrentStore);
  const setLocation = useLocationStore((state) => state.setLocation);

  const loadKakaoMarkers = useCallback(() => {
    if (!map) return;

    stores.forEach((store) => {
      // console.log('Store Data:', store); // 스토어 데이터 출력
      // console.log('Coordinates:', store.lat, store.lng); // 좌표값 확인

      const imageSrc = store.category
        ? `/images/markers/${store.category}.png`
        : `/images/markers/default.png`;
      const imageSize = new window.kakao.maps.Size(40, 40);
      const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const markerPosition = new window.kakao.maps.LatLng(
        store.lat ?? 0, // 기본값 설정
        store.lng ?? 0 // 기본값 설정
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      marker.setMap(map);

      const content = `<div class="infowindow">${store.name}</div>`;
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
        xAnchor: 0.6,
        yAnchor: 0.91,
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        customOverlay.setMap(map);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        customOverlay.setMap(null);
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        setCurrentStore(store);

        // lat, lng가 undefined일 수 있으므로 기본값 사용
        const lat = store.lat ?? 37.497625203; // 기본값 설정
        const lng = store.lng ?? 127.03088379; // 기본값 설정
        setLocation(lat, lng);
      });
    });
  }, [map, stores, setCurrentStore, setLocation]);

  useEffect(() => {
    loadKakaoMarkers();
  }, [loadKakaoMarkers]);

  return null;
}
