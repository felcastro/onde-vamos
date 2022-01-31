import React, { FormEvent, useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useCreatePlace } from "../../services/places.service";
import Modal from "../Modal";
import FormControl from "../FormControl";

interface CreatePlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePlaceModal({
  isOpen,
  onClose,
}: CreatePlaceModalProps) {
  const createPlaceMutation = useCreatePlace();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [rating, setRating] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    createPlaceMutation.mutate(
      {
        name,
        price: parseInt(price),
        // @ts-ignore
        rating: rating ? parseInt(rating) : undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("places");

          setName("");
          setPrice("");

          toast.success("Local adicionado!");

          onClose();
        },
        onError: () => {
          toast.error("Erro ao adicionar local.");
        },
      }
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar local">
      <form className="flex flex-col gap-2 mt-4" onSubmit={onSubmit}>
        <FormControl
          id="name"
          label="Nome"
          placeholder="Nome do local"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={createPlaceMutation.isLoading}
        />
        <FormControl
          id="price"
          label="Preço"
          placeholder="Valor por pessoa no local"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={createPlaceMutation.isLoading}
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
          disabled={createPlaceMutation.isLoading}
        />
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createPlaceMutation.isLoading}
          >
            Enviar
          </button>
        </div>
      </form>
    </Modal>
  );
}
