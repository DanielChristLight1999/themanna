import { auth, signIn } from '@/auth'
import FoodMenu from '@/components/Apps/MainMenu/FoodMenu'
import GoToCart from '@/components/Apps/MainMenu/GoToCart'
import MenuHeader from '@/components/Apps/MainMenu/MenuHeader'
import { getCategories, getProducts } from '@/lib/getData'


const page = async () => {
  const session = await auth()
  if (!session) {
    await signIn()
  }
  const products = await getProducts()
  const categories = await getCategories()
  return (
    <div className='relative max-w-2/3 h-fit'>
      {/* {JSON.stringify(session)} */}
      <MenuHeader />
      <FoodMenu products={products} categories={categories} />
      <GoToCart />
    </div>
  )
}

export default page