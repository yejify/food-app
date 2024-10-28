import { create } from 'zustand';
import { SearchType, StoreType } from '@/interface';

const DEFAULT_LAT = 37.497625203;
const DEFAULT_LNG = 127.03088379;
const DEFAULT_ZOOM = 3;

// Map 상태 정의
interface MapState {
  map: any | null;
  setMap: (map: any) => void;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));

interface CurrentStoreState {
  currentStore: StoreType | null;
  setCurrentStore: (store: StoreType | null) => void;
}

export const useCurrentStore = create<CurrentStoreState>((set) => ({
  currentStore: null,
  setCurrentStore: (store) => set({ currentStore: store }),
}));

// Location 상태 정의
interface LocationState {
  lat: number;
  lng: number;
  zoom: number;
  setLocation: (lat: number, lng: number, zoom?: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: 37.497625203,
  lng: 127.03088379,
  zoom: 3,
  setLocation: (lat, lng, zoom = 3) => set({ lat, lng, zoom }),
}));

// Search 상태 정의
interface SearchState {
  q: string;
  district: string;
  setSearch: (search: Partial<SearchState>) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  q: '',
  district: '',
  setSearch: (newSearch) => set((state) => ({ ...state, ...newSearch })),
}));
