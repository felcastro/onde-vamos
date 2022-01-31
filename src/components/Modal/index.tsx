import React, { Fragment, HTMLAttributes } from "react";
import { FaTimes } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  children,
  title,
  isOpen,
  onClose,
}: ModalProps) {
  return (
    <Transition appear show={isOpen}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="relative text-lg font-medium leading-6"
              >
                {title}
                <FaTimes
                  className="absolute right-0 text-2xl top-0"
                  onClick={onClose}
                />
              </Dialog.Title>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
