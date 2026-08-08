import React from 'react';
import Title from '../title';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

const priceRanges = [
  { title: "Under $100", value: "0-100" },
  { title: "$100 - $200", value: "100-200" },
  { title: "$200 - $300", value: "200-300" },
  { title: "$300 - $500", value: "300-500" },
  { title: "Over $500", value: "500+" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}


const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <>
      <div className="w-full bg-white py-5 ">
        <Title className="text-base mb-5 font-black ">Price </Title>
        <RadioGroup
          value={selectedPrice || ""}
          onValueChange={setSelectedPrice}
          className="mt-2 space-y-1"
        >
          {priceRanges.map((priceRange) => (
            <div 
              key={priceRange.value}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                value={priceRange.value}
                id={`price-${priceRange.value}`}
                className="rounded-sm"
              />
              <Label
                htmlFor={`price-${priceRange.value}`}
                className={`${selectedPrice === priceRange.value ? "font-semibold text-shop-dark-green" : "font-normal"}`}
              >
                {priceRange.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
          {selectedPrice && (
            <button
              type="button"
              onClick={() => setSelectedPrice(null)}
              className="text-sm font-medium mt-10  underline
              underline-offset-2 decoration-1 text-left hover:text-shop-dark-green hoverEffect"
            >
              Reset selection
            </button>
          )}
      </div>    
    </>
  )
}

export default PriceList;
