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
    if (!map) return; // 지도 객체가 초기화되지 않으면 종료

    stores.forEach((store) => {
      if (store.lat == null || store.lng == null) {
        console.warn(`Invalid coordinates for store: ${store.name}`);
        return; // 유효하지 않은 좌표를 가진 스토어는 무시
      }

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

      const markerPosition = new window.kakao.maps.LatLng(store.lat, store.lng);
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
        setLocation(store.lat ?? 37.497625203, store.lng ?? 127.03088379);
      });
    });
  }, [map, stores, setCurrentStore, setLocation]);

  useEffect(() => {
    loadKakaoMarkers(); // 마커 로드
  }, [loadKakaoMarkers]);

  return null;
}
