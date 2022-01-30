import { useQuery, useMutation } from "react-query";
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

type CreatePlaceRequest = Pick<Place, "name" | "price">;

export async function createPlace(place: CreatePlaceRequest) {
  const { error } = await supabase.from("places").insert(place);

  if (error) {
    throw new Error("Error inserting place");
  }
}

export function useCreatePlace() {
  return useMutation((place: CreatePlaceRequest) => {
    return createPlace(place);
  });
}

export async function updatePlace(place: Place) {
  const { id, ...rest } = place;

  const { error } = await supabase
    .from("places")
    .update({ ...rest })
    .eq("id", id);

  if (error) {
    throw new Error("Error updating place");
  }
}

export function useUpdatePlace() {
  return useMutation((place: Place) => {
    return updatePlace(place);
  });
}

export async function deletePlace(id: string) {
  const { error } = await supabase.from("places").delete().eq("id", id);

  if (error) {
    throw new Error("Error deleting place");
  }
}

export function useDeletePlace() {
  return useMutation((id: string) => {
    return deletePlace(id);
  });
}
