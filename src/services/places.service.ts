import { useQuery } from "react-query";
import { supabase } from "../config/client";

export interface Place {
  id: string;
  name: string;
  price: number;
}

export async function getPlaces() {
  const { data, error } = await supabase
    .from<Place>("places")
    .select("*")
    .order("price", { ascending: false });

  if (error) {
    throw new Error("Error loading places");
  }

  return data;
}

export function usePlaces() {
  return useQuery(["places"], async () => getPlaces());
}
