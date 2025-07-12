import React from 'react'
import FoodsOfTheDayPage from './pageClient'
import { getAllProducts, getFoodsOfTheDay } from '@/lib/getData'

const page = async () => {
  const products = await getAllProducts()
  const initialFeaturedProducts = await getFoodsOfTheDay()
  return (
        <FoodsOfTheDayPage products={products} initialFeaturedProducts={initialFeaturedProducts} />
  )
}

export default page