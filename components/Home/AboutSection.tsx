import { aboutdata } from '@/lib/home-data/getlandingpage'
import Image from 'next/image'
import React from 'react'

const AboutSection = () => {
    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">About Mana Restaurant</h2>
                        <p className="text-lg text-gray-600 mb-6">
                           {aboutdata.description.slice(0, 190)}
                        </p>
                        <p className="text-lg text-gray-600 mb-8">
                            {aboutdata.description.slice(190, 406)}
                        </p>
                        <p className="text-lg text-gray-600 mb-8">
                            {aboutdata.description.slice(406, aboutdata.description.length)}
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">10K+</div>
                                <div className="text-gray-600">Happy Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">8</div>
                                <div className="text-gray-600">Years Experience</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <Image
                            width={500}
                            height={500}
                            src="/images/aboutus.jpg"
                            alt="Restaurant interior"
                            className="rounded-lg shadow-xl"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-6 rounded-lg">
                            <div className="text-2xl font-bold">4.9/5</div>
                            <div className="text-sm">Customer Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutSection