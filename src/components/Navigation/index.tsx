import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreatePlaceModal from "../CreatePlaceModal";

export default function Navigation() {
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);

  return (
    <div className="absolute bottom-0 flex justify-center items-center h-16 w-full bg-gray-900 bg-opacity-75 text-gray-50 shadow-md">
      <div>Onde Vamos?</div>
      <button
        className="btn btn-outline btn-rounded absolute right-2"
        onClick={() => setIsCreatePlaceModalOpen(true)}
      >
        <FaPlus />
      </button>
      <CreatePlaceModal
        isOpen={isCreatePlaceModalOpen}
        onClose={() => setIsCreatePlaceModalOpen(false)}
      />
    </div>
  );
}
