import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { usePlaces } from "../../services/places.service";
import { PriceRange, usePriceRanges } from "../../services/price-range.service";

interface PricePickerProps {
  priceRanges: PriceRange[];
  selectedPriceRanges: Set<number>;
  onPriceRangeToggle: (id: number) => void;
}

function PricePicker({
  priceRanges,
  selectedPriceRanges,
  onPriceRangeToggle,
}: PricePickerProps) {
  const { data: prices } = usePriceRanges();

  const iconBaseStyle = "text-gray-200 text-3xl transition-all duration-200";
  const iconSelectedStyle =
    "text-yellow-300 drop-shadow-md text-4xl transition-all duration-200";

  return (
    <div className="flex justify-center gap-2 p-2 rounded-md shadow-md bg-gray-700 border border-gray-75">
      {!prices
        ? "Carregando..."
        : priceRanges.map((price) => (
            <div className="flex justify-center items-center w-9 h-9">
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
  const { data: places } = usePlaces();
  const { data: priceRanges } = usePriceRanges();
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(
    new Set<number>()
  );

  const ranges = priceRanges?.filter((range) =>
    selectedPriceRanges.has(range.id)
  );

  function togglePriceRange(id: number) {
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
      (range) => range.minPrice <= price && range.maxPrice > price
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
      {priceRanges && (
        <PricePicker
          priceRanges={priceRanges}
          selectedPriceRanges={selectedPriceRanges}
          onPriceRangeToggle={togglePriceRange}
        />
      )}
      <div className="flex flex-col gap-2 flex-1 py-2 overflow-y-scroll">
        {filteredPlaces?.map((place, i) => (
          <div
            key={i}
            className="p-2 rounded-md shadow-md bg-white border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{place.name}</h2>
              <div className="flex">
                {Array.apply(
                  null,
                  Array(
                    priceRanges?.filter(
                      (range) => place.price >= range.minPrice
                    ).length
                  )
                ).map((elem, i) => (
                  <FaDollarSign key={i} className="text-yellow-400" />
                ))}
              </div>
            </div>
            <span className="text-gray-400">
              ~ {priceFormatter.format(place.price)} / pessoa
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
