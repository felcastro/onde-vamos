import React, { FormEvent, useState } from "react";
import { useQueryClient } from "react-query";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useCreatePlace } from "../../services/places.service";
import { FaTimes } from "react-icons/fa";

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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute left-4 right-4 top-16 border border-gray-200 overflow-auto rounded-md outline-none p-2 bg-white"
      overlayClassName="fixed inset-0 bg-gray-700 bg-opacity-75"
      contentLabel="Adicionar local"
    >
      <div className="relative">
        <h2 className="text-xl font-semibold text-center">Adicionar local</h2>
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
            disabled={createPlaceMutation.isLoading}
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
            disabled={createPlaceMutation.isLoading}
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
            disabled={createPlaceMutation.isLoading}
          />
          <span className="text-sm text-gray-400">
            Informe uma nota de 1 a 5
          </span>
        </div>
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
