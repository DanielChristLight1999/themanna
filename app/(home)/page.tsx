import GoToCart from "@/components/Apps/MainMenu/GoToCart";
import ManaLandingPage from "@/components/Home/HomeContent";
import prisma from "@/db";
import { getFoodsOfTheDay } from "@/lib/getData";

export default async function Home() {
  // const session = await auth()
  const featuredFoods = await getFoodsOfTheDay()
  const data = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: {select: {url: true}},
      category: {select: {name: true}},
    }
  });
  const menuItems = data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.images[0].url,
    category: item.category.name,
  }));

  return (
    <div className="">
      <ManaLandingPage featuredFoods={featuredFoods} menuitems={menuItems} />
      <GoToCart fromLanding={true} />
    </div>
  );
}
