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
      <Title className='text-base font-black'>Product Categories</Title>
      <RadioGroup
        value={selectedCategory ?? undefined}
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
    </div>
  )
}

export default CategoryList;
