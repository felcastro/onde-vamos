import React, { FormEvent, useState } from "react";
import { useQueryClient } from "react-query";
import Modal from "react-modal";
import { toast } from "react-toastify";
import {
  Place,
  useDeletePlace,
  useUpdatePlace,
} from "../../services/places.service";
import { FaTimes } from "react-icons/fa";

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

          toast({
            title: "Local atualizado!",
            description: `Dados do local alterados com sucesso.`,
            status: "success",
            isClosable: true,
          });

          onClose();
        },
        onError: () => {
          toast({
            title: "Erro ao alterar local.",
            description:
              "Um erro ocorreu ao alterar os dados do local. Tente novamente.",
            status: "error",
            isClosable: true,
          });
        },
      }
    );
  }

  function onDelete() {
    deletePlaceMutation.mutate(place.id, {
      onSuccess: () => {
        queryClient.invalidateQueries("places");

        toast({
          title: "Local deletado!",
          description: `Local deletado com sucesso.`,
          status: "success",
          isClosable: true,
        });

        onClose();
      },
      onError: () => {
        toast({
          title: "Erro ao deletar local.",
          description: "Um erro ocorreu ao deletar o local. Tente novamente.",
          status: "error",
          isClosable: true,
        });
      },
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute left-4 right-4 top-16 border border-gray-200 overflow-auto rounded-md outline-none p-2 bg-white"
      overlayClassName="fixed inset-0 bg-gray-700 bg-opacity-75"
      contentLabel="Atualizar local"
    >
      <div className="relative">
        <h2 className="text-xl font-semibold text-center">Atualizar local</h2>
        <FaTimes
          className="absolute right-0 text-2xl top-0"
          onClick={onClose}
        />
      </div>
      <form className="flex flex-col gap-2 mt-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="name" className="font-semibold">
            Nome
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Nome do local"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={updatePlaceMutation.isLoading}
          />
        </div>
        <div>
          <label htmlFor="price" className="font-semibold">
            Preço
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            placeholder="Valor por pessoa no local"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={updatePlaceMutation.isLoading}
          />
        </div>
        <div>
          <label htmlFor="rating" className="font-semibold">
            Nota
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            required
            placeholder="Nota do local"
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
          <span className="text-sm text-gray-400">
            Informe uma nota de 1 a 5
          </span>
        </div>
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
            className="btn btn-primary"
            disabled={updatePlaceMutation.isLoading}
          >
            Enviar
          </button>
        </div>
      </form>
    </Modal>
  );
}
