import GoToCart from "@/components/Apps/MainMenu/GoToCart";
import ManaLandingPage from "@/components/Home/HomeContent";
import prisma from "@/db";
import { getActiveFlyers, getFoodsOfTheDay } from "@/lib/getData";

export default async function Home() {
  // const session = await auth()
  const [featuredFoods, topFlyers, middleFlyers, bottomFlyers] = await Promise.all([
    getFoodsOfTheDay(),
    getActiveFlyers("top"),
    getActiveFlyers("middle"),
    getActiveFlyers("footer")
  ])
  const data = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: { select: { url: true } },
      category: { select: { name: true } },
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
    <div>
      <ManaLandingPage
        topFlyers={topFlyers}
        middleFlyers={middleFlyers}
        bottomFlyers={bottomFlyers}
        featuredFoods={featuredFoods} 
        menuitems={menuItems} 
        />
      <GoToCart fromLanding={true} />
    </div>
  );
}
