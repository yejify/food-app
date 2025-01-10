import Map from '@/components/Map';
import Markers from '@/components/Markers';

import StoreBox from '@/components/StoreBox';
import { StoreType } from '@/interface';

import CurrentLocationButton from '@/components/CurrentLocationButton';

export default async function Home() {
  const stores: StoreType[] = await getData();
  return (
    <>
      <Map />
      <Markers stores={stores} isLoading={false} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  );
}

export async function getData(): Promise<StoreType[]> {
  try {
    const res = await fetch(
      `https://food-app-lilac-seven.vercel.app/api/stores`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://food-app-lilac-seven.vercel.app',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // 에러 시 빈 배열 반환
  }
}
