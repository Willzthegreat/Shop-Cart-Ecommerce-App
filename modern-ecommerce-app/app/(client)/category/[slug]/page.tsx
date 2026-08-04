import CategoryProducts from '@/components/categoryProducts';
import Container from '@/components/container';
import Title from '@/components/title';
import { getCategories } from '@/queries';
import React from 'react'

const CategoryPage = async (
  {
    params, 
  } : { 
    params: Promise<{ slug: string }>
   }) => {
  const categories = await getCategories();
  const { slug } = await params;

  return (
    <>
      <div className="py-10 ">
        <Container>
          <Title>
            Products by Category: {" "}
            <span className=" font-bold text-green-600 captalize tracking-wide">
             {slug && slug}
            </span>
          </Title>
          <CategoryProducts categories={categories} slug={slug} />
        </Container> 
      </div>
    </>
  )
}

export default CategoryPage;

