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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    createPlaceMutation.mutate(
      { name, price: parseInt(price) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("places");

          setName("");
          setPrice("");

          toast({
            title: "Local adicionado!",
            description: `Novo local adicionado com sucesso.`,
            status: "success",
            isClosable: true,
          });

          onClose();
        },
        onError: () => {
          toast({
            title: "Erro ao adicionar local.",
            description:
              "Um erro ocorreu ao adicionar o novo local. Tente novamente.",
            status: "error",
            isClosable: true,
          });
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
