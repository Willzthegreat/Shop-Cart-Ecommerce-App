import { Category } from '@/types/product';
import React from 'react'
import Title from '../title';

interface Props {
    categories: Category[];
    selectedCategory?: string | null;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string | null >>;
}

const CategoryList = ({categories, selectedCategory, setSelectedCategory}: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className='text-base font-black'>Product Categories</Title>
      
    </div>
  )
}

export default CategoryList;
