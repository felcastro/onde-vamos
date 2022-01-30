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
  { name: "Petiskeira", price: 50 },
  { name: "La Villa Amalfi", price: 70 },
  { name: "El Fuego", price: 80 },
  { name: "Mamma Mia", price: 70 },
  { name: "Rock's", price: 50 },
  { name: "Primo Polastro", price: 50 },
];

export async function getPlaces() {
  return places.sort((a, b) => a.price < b.price ? 1 : -1);
}

export function usePlaces() {
  return useQuery(["places"], async () => getPlaces());
}
