import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

const ContactSections = () => {
    return (
        <section id="contact" className="py-16 bg-gray-800 text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-xl text-gray-300">Have questions? We'd love to hear from you!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Phone className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Call Us</h3>
                        <p className="text-gray-300">(555) 123-4567</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                        <p className="text-gray-300">123 Food Street, City, State 12345</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email Us</h3>
                        <p className="text-gray-300">hello@manarestaurant.com</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactSections