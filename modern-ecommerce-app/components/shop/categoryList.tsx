import { Category } from '@/types/product';
import React from 'react'
import Title from '../title';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Props {
    categories: Category[];
    selectedCategory?: string | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string | null >>;
}

const CategoryList = ({categories, selectedCategory, setSelectedCategory}: Props) => {
  return (
    <div className="w-full bg-white py-5">
      <Title className='text-base mb-5 font-black'>Product Categories</Title>
      <RadioGroup
        value={selectedCategory || ""}
        onValueChange={setSelectedCategory}
      >
        {categories?.map((category) => (
          <div key={category?._id} className="flex items-center gap-2">
            <RadioGroupItem
              value={category?.slug}
              id={category?.slug}
              className="rounded-sm cursor-pointer"
             />
             <Label htmlFor={category?.slug}
              className={`${selectedCategory === category.slug ? "font-semibold text-shop-dark-green" : "font-normal"}`}
             >{category?.title}</Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-10 underline
          underline-offset-2 decoration-1 text-left hover:text-shop-dark-green hoverEffect"
        >
          Reset selection
        </button>
      )}
    </div>
  )
}

export default CategoryList;
