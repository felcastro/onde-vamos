import React, { FormEvent, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import {
  Place,
  useDeletePlace,
  useUpdatePlace,
} from "../../services/places.service";
import Modal from "../Modal";
import FormControl from "../FormControl";

interface UpdatePlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place;
}

export default function UpdatePlaceModal({
  isOpen,
  onClose,
  place,
}: UpdatePlaceModalProps) {
  const updatePlaceMutation = useUpdatePlace();
  const deletePlaceMutation = useDeletePlace();
  const queryClient = useQueryClient();

  const [name, setName] = useState(place.name);
  const [price, setPrice] = useState<string>(place.price.toString());
  const [rating, setRating] = useState<string>(place.rating?.toString() || "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    updatePlaceMutation.mutate(
      {
        id: place.id,
        name,
        price: parseInt(price),
        // @ts-ignore
        rating: rating ? parseInt(rating) : undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("places");

          toast.success("Local atualizado!");

          onClose();
        },
        onError: () => {
          toast.error("Erro ao alterar local.");
        },
      }
    );
  }

  function onDelete() {
    deletePlaceMutation.mutate(place.id, {
      onSuccess: () => {
        queryClient.invalidateQueries("places");

        toast.success("Local deletado!");

        onClose();
      },
      onError: () => {
        toast.error("Erro ao deletar local.");
      },
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Atualizar local">
      <form
        id="updatePlaceForm"
        className="flex flex-col gap-2 mt-4"
        onSubmit={onSubmit}
      >
        <FormControl
          id="name"
          label="Nome"
          placeholder="Nome do local"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={updatePlaceMutation.isLoading}
        />
        <FormControl
          id="price"
          label="Preço"
          placeholder="Valor por pessoa no local"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={updatePlaceMutation.isLoading}
        />
        <FormControl
          id="rating"
          label="Nota"
          placeholder="Nota do local"
          helpMessage="Informe uma nota de 1 a 5"
          required
          value={rating}
          onChange={(e) => {
            if (["1", "2", "3", "4", "5"].includes(e.target.value)) {
              setRating(e.target.value);
            } else {
              setRating("");
            }
          }}
          disabled={updatePlaceMutation.isLoading}
        />
      </form>
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-danger"
          onClick={onDelete}
          disabled={updatePlaceMutation.isLoading}
        >
          Deletar
        </button>
        <button
          type="submit"
          form="updatePlaceForm"
          className="btn btn-primary"
          disabled={updatePlaceMutation.isLoading}
        >
          Enviar
        </button>
      </div>
    </Modal>
  );
}
