import { useQuery } from "react-query";

export interface PriceRange {
  id: number;
  minPrice: number;
  maxPrice: number;
}

const priceRanges: PriceRange[] = [
  {
    id: 0,
    minPrice: 0,
    maxPrice: 40,
  },
  {
    id: 1,
    minPrice: 40,
    maxPrice: 50,
  },
  {
    id: 2,
    minPrice: 50,
    maxPrice: 70,
  },
  {
    id: 3,
    minPrice: 70,
    maxPrice: 90,
  },
  {
    id: 4,
    minPrice: 90,
    maxPrice: 99999,
  },
];

export async function getPriceRanges() {
  return priceRanges;
}

export function usePriceRanges() {
  return useQuery(["priceRanges"], async () => getPriceRanges());
}
