import React, { useState } from "react";
import { FaDollarSign, FaStar } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import UpdatePlaceModal from "../../components/UpdatePlaceModal";
import { usePlaces } from "../../services/places.service";
import { PriceRange, usePriceRanges } from "../../services/price-range.service";
interface PricePickerProps {
  priceRanges: PriceRange[];
  selectedPriceRanges: Set<string>;
  onPriceRangeToggle: (id: string) => void;
}

function PricePicker({
  priceRanges,
  selectedPriceRanges,
  onPriceRangeToggle,
}: PricePickerProps) {
  const iconBaseStyle = "text-gray-200 text-3xl transition-all duration-200";
  const iconSelectedStyle =
    "text-yellow-300 drop-shadow-md text-4xl transition-all duration-200";

  return (
    <div className="absolute top-2 w-full flex justify-center gap-2 p-2 rounded-md shadow-md bg-gray-900 bg-opacity-75">
      {priceRanges.map((price) => (
        <div className="flex justify-center items-center w-9 h-8">
          <FaDollarSign
            key={price.id}
            className={
              selectedPriceRanges.has(price.id)
                ? iconSelectedStyle
                : iconBaseStyle
            }
            onClick={() => onPriceRangeToggle(price.id)}
          />
        </div>
      ))}
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
    <div className="relative h-full flex flex-col">
      <PricePicker
        priceRanges={priceRanges}
        selectedPriceRanges={selectedPriceRanges}
        onPriceRangeToggle={togglePriceRange}
      />
      <div className="flex flex-col gap-2 flex-1 pt-16 pb-18 overflow-y-scroll">
        {!places || isLoadingPlaces || isErrorPlaces ? (
          <Spinner />
        ) : (
          filteredPlaces?.map((place) => (
            <div
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
            </div>
          ))
        )}
      </div>
      {isEditingPlaceId && (
        <UpdatePlaceModal
          isOpen={!!isEditingPlaceId}
          onClose={() => setIsEditingPlaceId(undefined)}
          place={places.find((place) => place.id === isEditingPlaceId)!}
        />
      )}
    </div>
  );
}
