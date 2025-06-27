import { featuredata } from '@/lib/home-data/getlandingpage'
import { Clock, Star, Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {featuredata.map((feature, index) => (
                        <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
                                <feature.icon className="h-8 w-8 text-orange-500 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features