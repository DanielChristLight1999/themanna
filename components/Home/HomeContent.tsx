"use client"

import { useState, useEffect } from "react"
import Nav from "./Nav"
import Hero from "./Hero"
import Features from "./Features"
import MenuSection from "./MenuSection"
import AboutSection from "./AboutSection"
import ContactSections from "./ContactSections"
import FooterSection from "./FooterSection"
import { FeaturedFoodsModal, FloatingFoodButton } from "./FeaturedFoodsModal"
import { Featured } from "@/app/admin/(routes)/foods-of-the-day/pageClient"
import { useFeaturedFoodsModal } from "@/hooks/use-featured-modal"
import { FlyerAd } from "@/lib/generated/prisma"
import { FlyerCarousel } from "./FlyerCarousel"

export interface HomeMenuItem {
  id: string,
  name: string,
  description: string | null,
  price: number,
  image: string | null,
  category: {id: string, name: string},
  stock: number

}
export default function ManaLandingPage({ menuitems, featuredFoods, topFlyers, middleFlyers, bottomFlyers }: { menuitems: HomeMenuItem[], featuredFoods: Featured[], topFlyers: FlyerAd[], middleFlyers: FlyerAd[], bottomFlyers: FlyerAd[] }) {
  const [isVisible, setIsVisible] = useState(false)
  const { isModalOpen, showFloatingButton, closeModal, openModal } = useFeaturedFoodsModal()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    openModal()
  }, [])



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Featured Foods Modal */}
      {featuredFoods.length > 0 ? <FeaturedFoodsModal featuredFoods={featuredFoods} isOpen={isModalOpen} onClose={closeModal} /> : ""}

      {/* Floating Food Button */}
      {showFloatingButton && featuredFoods.length > 0 ? <FloatingFoodButton onClick={openModal} /> : ""}
      {/* Navigation */}
      <Nav />
      {/* Render Top Flyers */}
      {topFlyers.length > 0 && (
        <div className="w-full py-2">
          <FlyerCarousel flyers={topFlyers} />
        </div>
      )}
      {/* Hero Section */}
      <Hero isVisible={isVisible} />
      {/* Features Section */}
      <Features />

      {middleFlyers.length > 0 && (
        <div className="w-full py-4">
          <FlyerCarousel flyers={middleFlyers} />
        </div>
      )}

      {/* Menu Section */}
      <MenuSection menuItems={menuitems} isVisible={isVisible} />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSections />

      {/* Render Footer Flyers */}
      {bottomFlyers.length > 0 && (
        <div className="w-full py-4">
          <FlyerCarousel flyers={bottomFlyers} />
        </div>
      )}

      {/* Footer */}
      <FooterSection />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
