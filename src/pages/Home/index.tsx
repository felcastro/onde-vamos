import React, { HTMLAttributes, useState } from "react";
import { FaDollarSign, FaStar, FaPlus, FaChevronDown } from "react-icons/fa";
import {
  GiSteak,
  GiChickenOven,
  GiFriedFish,
  GiFullPizza,
  GiSushis,
  GiHamburger,
} from "react-icons/gi";
import { Transition } from "@headlessui/react";

import Spinner from "../../components/Spinner";
import UpdatePlaceModal from "../../components/UpdatePlaceModal";
import { usePlaces } from "../../services/places.service";
import { PriceRange, usePriceRanges } from "../../services/price-range.service";
import CreatePlaceModal from "../../components/CreatePlaceModal";

function FloatingButton(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <div className="fixed bottom-18 right-2 flex justify-center items-center h-16 w-16">
      <button className="flex justify-center items-center rounded-full h-16 w-16 active:scale-90 shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-gray-50 text-2xl transition-all duration-100" {...props}>
        <FaPlus />
      </button>
    </div>
  );
}

interface FilterItemProps extends HTMLAttributes<HTMLInputElement> {
  icon: JSX.Element;
}

function FilterItem({ icon, ...props }: FilterItemProps) {
  const [isSelected, setSelected] = useState<boolean>(false);

  return (
    <div
      className={`justify-self-center flex justify-center items-center h-16 w-16 bg-white rounded-md shadow-sm text-4xl transition-all duration-100 ${
        isSelected
          ? "shadow-md bg-blue-100 shadow-blue-300 border border-blue-500 text-inherit"
          : "text-gray-400"
      }`}
      onClick={() => setSelected(!isSelected)}
      {...props}
    >
      {icon}
    </div>
  );
}

interface ControlPanelProps {
  priceRanges: PriceRange[];
  selectedPriceRanges: Set<string>;
  onPriceRangeToggle: (id: string) => void;
}

function ControlPanel({
  priceRanges,
  selectedPriceRanges,
  onPriceRangeToggle,
}: ControlPanelProps) {
  const [isDisplayAll, setDisplayAll] = useState(false);

  const iconBaseStyle = "text-gray-200 text-2xl transition-all duration-200";
  const iconSelectedStyle =
    "text-yellow-300 drop-shadow-md text-3xl transition-all duration-200";

  return (
    <div className="absolute top-2 left-2 right-2 flex flex-col p-2 rounded-md shadow-md bg-gray-900 bg-opacity-75 overflow-hidden">
      <div
        className="flex justify-between"
        onClick={() => setDisplayAll(!isDisplayAll)}
      >
        <div className="flex gap-1">
          {priceRanges.map((price) => (
            <div className="flex justify-center items-center w-8 h-8">
              <FaDollarSign
                key={price.id}
                className={
                  selectedPriceRanges.has(price.id)
                    ? iconSelectedStyle
                    : iconBaseStyle
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onPriceRangeToggle(price.id);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center w-8 h-8">
          <FaChevronDown
            className={`text-gray-200 text-3xl transition-all duration-200 ${
              isDisplayAll ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>
      <Transition
        show={isDisplayAll}
        enter="transition-all ease-in-out duration-200"
        enterFrom="h-0 opacity-0"
        enterTo="h-36 opacity-100"
        leave="transition-all ease-in-out"
        leaveFrom="h-36 opacity-100"
        leaveTo="h-0 opacity-0"
        className="mt-2"
      >
        <div className="grid grid-cols-4 justify-center items-center gap-2 h-36">
          <FilterItem icon={<GiSteak />}></FilterItem>
          <FilterItem icon={<GiChickenOven />}>
            <GiChickenOven />
          </FilterItem>
          <FilterItem icon={<GiFriedFish />}>
            <GiFriedFish />
          </FilterItem>
          <FilterItem icon={<GiFullPizza />}>
            <GiFullPizza />
          </FilterItem>
          <FilterItem icon={<GiSushis />}>
            <GiSushis />
          </FilterItem>
          <FilterItem icon={<GiHamburger />}>
            <GiHamburger />
          </FilterItem>
        </div>
      </Transition>
    </div>
  );
}

export default function Home() {
  const {
    data: places,
    isLoading: isLoadingPlaces,
    isError: isErrorPlaces,
  } = usePlaces();
  const {
    data: priceRanges,
    isLoading: isLoadingPriceRanges,
    isError: isErrorPriceRanges,
  } = usePriceRanges();
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(
    new Set<string>()
  );
  const [isEditingPlaceId, setIsEditingPlaceId] = useState<string>();
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);

  const isLoading = isLoadingPlaces || isLoadingPriceRanges;

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const isError = isErrorPlaces || isErrorPriceRanges;

  if (isError) {
    return (
      <div className="h-full flex justify-center items-center">
        Erro ao carregar dados
      </div>
    );
  }

  if (!places || !priceRanges) {
    return (
      <div className="h-full flex justify-center items-center">
        {"Nenhum dado para apresentar :("}
      </div>
    );
  }

  const ranges = priceRanges?.filter((range) =>
    selectedPriceRanges.has(range.id)
  );

  function togglePriceRange(id: string) {
    if (selectedPriceRanges.has(id)) {
      setSelectedPriceRanges((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setSelectedPriceRanges((prev) => new Set(prev).add(id));
    }
  }

  function isInSelectedPriceRange(price: number) {
    return ranges?.some(
      (range) => range.min <= price && (!range.max || range.max > price)
    );
  }

  const priceFormatter = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const filteredPlaces =
    selectedPriceRanges.size === 0
      ? places
      : places?.filter((place) => isInSelectedPriceRange(place.price));

  return (
    <div className="h-full flex flex-col">
      <ControlPanel
        priceRanges={priceRanges}
        selectedPriceRanges={selectedPriceRanges}
        onPriceRangeToggle={togglePriceRange}
      />
      <div className="flex flex-1 pt-16 pb-36">
        {!places || isLoadingPlaces || isErrorPlaces ? (
          <Spinner />
        ) : (
          <ul className="flex flex-col gap-2 flex-1">
            {filteredPlaces?.map((place) => (
              <li
                key={place.id}
                className="p-2 rounded-md shadow-md bg-white border border-gray-200"
                onClick={() => setIsEditingPlaceId(place.id)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{place.name}</h2>
                  <div className="flex">
                    {[
                      ...Array(
                        priceRanges?.filter((range) => place.price >= range.min)
                          .length
                      ),
                    ].map((elem, i) => (
                      <FaDollarSign key={i} className="text-green-500" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    ~ {priceFormatter.format(place.price)} / pessoa
                  </span>
                  <div className="flex">
                    {[...Array(place.rating || 0)].map((elem, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <FloatingButton onClick={() => setIsCreatePlaceModalOpen(true)} />
      {isEditingPlaceId && (
        <UpdatePlaceModal
          isOpen={!!isEditingPlaceId}
          onClose={() => setIsEditingPlaceId(undefined)}
          place={places.find((place) => place.id === isEditingPlaceId)!}
        />
      )}
      <CreatePlaceModal
        isOpen={isCreatePlaceModalOpen}
        onClose={() => setIsCreatePlaceModalOpen(false)}
      />
    </div>
  );
}
