import React from 'react'
import { Brand } from "@/types/product"
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Title from '../title';
import { Label } from '../ui/label';


interface Props {
  brands: Brand[];
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;

}

const BrandsList = ({ brands, selectedBrand, setSelectedBrand }: Props ) => {
  return (
    <>
      <div className="w-full bg-white py-5 ">
        <Title className="text-base font-black ">Brands </Title>
        <RadioGroup
          value={selectedBrand ?? undefined}
          onValueChange={setSelectedBrand}
          className="mt-2 space-y-1"
        >
          {brands?.map((brand) => (
            <div 
              key={brand?._id}
              className="flex items-center gap-2"
            >
              <RadioGroupItem
                value={brand?.slug}
                id={brand?.slug}
                className="rounded-sm"
              />
              <Label
                htmlFor={brand?.slug}
                className={`${selectedBrand === brand?.slug ? "font-semibold text-shop-dark-green" : "font-normal"}`}
              >
                {brand.title}
              </Label>
            </div>
          ))}

          {selectedBrand && (
            <button
              onClick={() => setSelectedBrand(null)}
              className="text-sm font-medium mt-2  underline
              underline-offset-2 decoration-1 text-left hover:text-shop-dark-green hoverEffect"
            >
              Reset selection
            </button>
          )}
        </RadioGroup>
      </div>      
    </>
  )
}

export default BrandsList
