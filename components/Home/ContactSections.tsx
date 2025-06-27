import { contactdata } from '@/lib/home-data/getlandingpage'
import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const ContactSections = () => {
    return (
        <section id="contact" className="py-16 bg-gray-800 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{contactdata.title}</h2>
                    <p className="text-xl text-gray-300">{contactdata.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {contactdata.ctas.map((cta, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <cta.icon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{cta.title}</h3>
                            <p className="text-gray-300">{cta.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ContactSections