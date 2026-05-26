import GoToCart from "@/components/Apps/MainMenu/GoToCart";
import GoToWhatsapp from "@/components/Apps/MainMenu/GoToWhatsapp";
import ManaLandingPage from "@/components/Home/HomeContent";
import { getActiveFlyers, getFoodsOfTheDay, getProductsHome } from "@/lib/getData";

export const dynamic = "force-dynamic"
export default async function Home() {
  // const session = await auth()
  const [featuredFoods, topFlyers, middleFlyers, bottomFlyers] = await Promise.all([
    getFoodsOfTheDay(),
    getActiveFlyers("top"),
    getActiveFlyers("middle"),
    getActiveFlyers("footer")
  ])
  
  const menuItems = await getProductsHome()

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
      <GoToWhatsapp />
    </div>
  );
}
