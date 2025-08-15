import { Poppins, Concert_One, Playwrite_AU_QLD } from "next/font/google";


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

export const playWrite = Playwrite_AU_QLD({
    weight: ["100", "200", "300","400"],
    style: ["normal"],
    variable: "--font-playwrite",
})