import { Poppins, Concert_One } from "next/font/google";


export const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    variable: "--font-poppins",
})

export const concertOne = Concert_One({
    weight: ["400"],
    subsets: ["latin"],
    variable: "--font-concert-one",
})