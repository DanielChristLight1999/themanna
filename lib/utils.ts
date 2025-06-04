import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function hashPassword(password: string) {
  const rounds = 10
  const salt  = bcrypt.genSaltSync(rounds)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
  return formatter.format(price)
}

export function stripAppSubdomain(host: string): string {
  // Remove port if present
  const [hostname, port] = host.split(':');

  // If hostname starts with "app.", remove it
  const stripped = hostname.startsWith('app.') ? hostname.slice(4) : hostname;

  // Return the modified host (with port if present)
  return port ? `${stripped}:${port}` : stripped;
}


export function estimatedDeliveryTime( deliveryEnd: Date) {
  const deliveryEndTime = new Date(deliveryEnd)

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

 
  return `${formatTime(deliveryEndTime)}`
}

export function extractorderId (id: string) {
        return id.split("-").at(-1)
    }