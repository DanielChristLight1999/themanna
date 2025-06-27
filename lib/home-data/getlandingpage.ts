import { Clock, Mail, MapPin, Phone, Star, Truck } from "lucide-react"

export const herodata = {
    title: "Fast Food Delivery",
    description: "Order food from our selection of fast food options and enjoy a delicious meal at your doorstep.",
    cta1: "Order Now",
    cta2: "View Menu",
    deliverytime: {
        title: "Delivery Time",
        value: "15min"
    },
    customerRating: {
        title: "Customer Rating",
        value: "4.9"
    },
    menuitems: {
        title: "Menu Items",
        value: "20+"
    }

}

export const featuredata = [
    {
        title: "Fast Delivery",
        description: "Get your food delivered in 15 minutes or less",
        icon: Clock
    },
    {
        title: "Quality Food",
        description: "Fresh ingredients and authentic flavors in every bite",
        icon: Star
    },
    {
        title: "Free Delivery",
        description: "No delivery charges on orders above $25",
        icon: Truck
    },
]

export const menusectiondata = {
    title: "Our Delicious Menu",
    description: "Discover our mouth-watering selection of fast food favorites, made fresh daily with premium ingredients.",
    cta: "View Full Menu"
}

export const aboutdata = {
    title: "About Mana Restaurant",
    description: `
    Eat Healthy, Live Healthy. At The Mana Restaurant, we believe that food is more than just fuel — it's nourishment for the body, joy for the soul, and a foundation for a healthier life. Our mission is simple yet powerful: to serve delicious meals that are as wholesome as they are satisfying.
We're passionate about creating food that not only excites your taste buds but also supports your well-being. Every dish is crafted with fresh ingredients, mindful cooking, and a commitment to balance — because healthy eating shouldn't mean compromising on flavor.

Whether you're stopping by for a quick bite, a hearty meal, or a refreshing drink, we’re here to help you eat better, feel better, and live healthier — one plate at a time.
    `,
    cta: "View Our Menu"
}

export const contactdata = {
    title: "Get In Touch",
    description: "Have questions? We'd love to hear from you!",
    ctas: [
        {
            title: "Call Us",
            description: "08088594960",
            icon: Phone
        },
        {
            title: "Visit Us",
            description: "Texaco Junction, Agbani, Enugu State, Nigeria",
            icon: MapPin
        },
        {
            title: "Email Us",
            description: "themanalightconcept@gmail.com",
            icon: Mail
        }
    ]
}

