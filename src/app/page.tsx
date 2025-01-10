import Map from '@/components/Map';
import Markers from '@/components/Markers';
import StoreBox from '@/components/StoreBox';
import { StoreType } from '@/interface';
import CurrentLocationButton from '@/components/CurrentLocationButton';

export default async function Home() {
  const stores: StoreType[] = await getData(); // 서버에서 데이터 가져오기

  return (
    <>
      <Map />
      <Markers stores={stores} isLoading={false} />
      <StoreBox />
      <CurrentLocationButton />
    </>
  );
}

async function getData(): Promise<StoreType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // 에러 시 빈 배열 반환
  }
}
