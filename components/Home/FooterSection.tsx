import { ChefHat } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const FooterSection = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <ChefHat className="h-8 w-8 text-orange-500" />
                        <span className="text-2xl font-bold">Mana</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Mana Restaurant. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default FooterSection