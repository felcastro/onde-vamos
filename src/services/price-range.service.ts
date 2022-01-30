import { useQuery } from "react-query";
import { supabase } from "../config/client";

export interface PriceRange {
  id: string;
  min: number;
  max?: number;
}

export async function getPriceRanges() {
  const { data, error } = await supabase
    .from<PriceRange>("price_ranges")
    .select("*");

  if (error) {
    throw new Error("Error loading price ranges");
  }

  return data;
}

export function usePriceRanges() {
  return useQuery(["priceRanges"], async () => getPriceRanges());
}
