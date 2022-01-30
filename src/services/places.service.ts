import { useQuery } from "react-query";

export interface Place {
  name: string;
  price: number;
}

const places: Place[] = [
  { name: "Trianon", price: 35 },
  { name: "Applebee's", price: 85 },
  { name: "Santo Antonio", price: 70 },
  { name: "Schneider", price: 100 },
  { name: "Petiskeira", price: 0 },
  { name: "La Villa Amalfi", price: 0 },
  { name: "El Fuego", price: 0 },
  { name: "Mamma Mia", price: 0 },
  { name: "Rock's", price: 0 },
  { name: "Primo Polastro", price: 0 },
];

export async function getPlaces() {
  return places;
}

export function usePlaces() {
  return useQuery(["places"], async () => getPlaces());
}
