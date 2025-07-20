import { auth } from '@/auth'
import FoodMenu from '@/components/Apps/MainMenu/FoodMenu'
import GoToCart from '@/components/Apps/MainMenu/GoToCart'
import MenuHeader from '@/components/Apps/MainMenu/MenuHeader'
import { getCategories, getProducts } from '@/lib/getData'
import { checkVerifiedEmail } from '@/lib/validations'
import { redirect } from 'next/navigation'


const page = async () => {
  const session = await auth()
  if (!session?.user?.email) {
    redirect("/auth/login")
  }
  const isVerified = await checkVerifiedEmail(session?.user?.email)
  if (!isVerified) {
    redirect(`/auth/verify-email?email=${session.user.email}`)
  }
  const products = await getProducts()
  const categories = await getCategories()
  return (
    <div className='relative md:px-0 w-full md:max-w-2/3 h-fit'>
      <MenuHeader />
      <FoodMenu products={products} categories={categories} />
      <GoToCart />
    </div>
  )
}

export default page