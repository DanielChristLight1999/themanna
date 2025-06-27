"use client"

import { useState, useEffect } from "react"
import Nav from "./Nav"
import Hero from "./Hero"
import Features from "./Features"
import MenuSection from "./MenuSection"
import AboutSection from "./AboutSection"
import ContactSections from "./ContactSections"
import FooterSection from "./FooterSection"

export interface HomeMenuItem {
        id: number,
        name: string,
        description: string | null,
        price: number,
        image: string,
        category: string,
    
}
export default function ManaLandingPage({menuitems}: { menuitems: HomeMenuItem[] }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])



    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            {/* Navigation */}
            <Nav />

            {/* Hero Section */}
            <Hero isVisible={isVisible} />
            {/* Features Section */}
            <Features />

            {/* Menu Section */}
            <MenuSection menuItems={menuitems} isVisible={isVisible} />

            {/* About Section */}
            <AboutSection />

            {/* Contact Section */}
            <ContactSections />

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
