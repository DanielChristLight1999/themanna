import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaClient, Role } from "@/lib/generated/prisma"
import { hashPassword } from "@/lib/utils"

const prisma = new PrismaClient().$extends(withAccelerate())
const defaultPermissions = {
  ADMIN: {
    orders: { view: true, create: true, update: true, delete: true },
    products: { view: true, create: true, update: true, delete: true },
    customers: { view: true, create: true, update: true, delete: true },
    affiliates: { view: true, create: true, update: true, delete: true },
    reports: { view: true, create: true, export: true },
    settings: { view: true, update: true },
    users: { view: true, create: true, update: true, delete: true },
  },
  MANAGER: {
    orders: { view: true, create: true, update: true, delete: false },
    products: { view: true, create: true, update: true, delete: false },
    customers: { view: true, create: true, update: true, delete: false },
    affiliates: { view: true, create: false, update: false, delete: false },
    reports: { view: true, create: true, export: true },
    settings: { view: true, update: false },
    users: { view: true, create: false, update: false, delete: false },
  },
  CASHIER: {
    orders: { view: true, create: true, update: false, delete: false },
    products: { view: true, create: false, update: false, delete: false },
    customers: { view: true, create: true, update: false, delete: false },
    affiliates: { view: false, create: false, update: false, delete: false },
    reports: { view: false, create: false, export: false },
    settings: { view: false, update: false },
    users: { view: false, create: false, update: false, delete: false },
  },
}

const seedData: { name: string, items: { name: string, sku: string, price: number, image: string, description: string, stock: number, costPrice: number }[] }[] = [
  // {
  //   name: "Foods",
  //   items: [
  //     {
  //       name: "Chicken Tikka",
  //       sku: "FOD-CHICK-001",
  //       price: 10000,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/anh-nguyen-kcA-c3f_3FE-unsplash-5oH5KPttfZ64BaP2ShPUX4uPNaYLy8.jpg",
  //       description:
  //         "Chicken Tikka is a popular Indian dish made with marinated chicken pieces cooked in a tandoor oven.",
  //       stock: 100,
  //       costPrice: 5000,
  //     },
  //     {
  //       name: "Mango Lassi",
  //       sku: "FOD-MANGO-001",
  //       price: 4250,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/julia-zyablova-KlVIYmGVRQ8-unsplash-LNb8DmEJHUUa2IJNSvOgo43nGsbcal.jpg",
  //       description: "Mango Lassi is a refreshing Indian yogurt drink blended with ripe mangoes.",
  //       stock: 50,
  //       costPrice: 2000,
  //     },
  //     {
  //       name: "Margherita Pizza",
  //       sku: "FOD-MARG-001",
  //       price: 12000,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/chad-montano-MqT0asuoIcU-unsplash-nQ8eLWyLcGhqK1UAVXODP9OqlyHkvd.jpg",
  //       description: "Classic Italian pizza with mozzarella cheese and fresh basil.",
  //       stock: 60,
  //       costPrice: 6000,
  //     },
  //     {
  //       name: "French Fries",
  //       sku: "FOD-FRIES-001",
  //       price: 5000,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/fernanda-martinez-H2RzlOijhlQ-unsplash-ZikyFvVI7lNx6Ms8bpDimq5ZeV7qwP.jpg",
  //       description: "Crispy golden French fries, lightly salted.",
  //       stock: 50,
  //       costPrice: 4000,
  //     },
  //     {
  //       name: "Chocolate Lava Cake",
  //       sku: "FOD-CHOC-001",
  //       price: 6000,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/jacob-thomas-6jHpcBPw7i8-unsplash-PsjMK0fALiVgVhUFImhPn8hDkJebn8.jpg",
  //       description: "Warm chocolate cake with a molten center.",
  //       stock: 60,
  //       costPrice: 5000,
  //     }
  //   ]
  // },
  // {
  //   name: "Beverages",
  //   items: [
  //     {
  //       name: "Coca Cola",
  //       sku: "BEV-COKE-001",
  //       price: 200,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/alessandro-d-antonio-qy4vrr2qi3M-unsplash-bUFKjQeBWMGm8uS309EwHKpDicsboH.jpg",
  //       description: "Chilled 500ml Coca Cola bottle",
  //       stock: 100,
  //       costPrice: 1000,
  //     },
  //     {
  //       name: "Pepsi",
  //       sku: "BEV-PEPSI-001",
  //       price: 190,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/andrew-valdivia-rEVX0kkBAV4-unsplash-Dkpw2c7uD1whJBfL0iPbgKb4XImuSp.jpg",
  //       description: "Refreshing 500ml Pepsi drink",
  //       stock: 90,
  //       costPrice: 500,
  //     }
  //   ]
  // },
  // {
  //   name: "Pastries",
  //   items: [
  //     {
  //       name: "Chocolate Croissant",
  //       sku: "PAS-CHCRO-001",
  //       price: 250,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/personalgraphic-com-VzUE5RtCuBA-unsplash-esDxvTV6jX5w4Rr2DKnaIdJgLIN9BW.jpg",
  //       description: "Flaky pastry filled with chocolate",
  //       stock: 50,
  //       costPrice: 150,
  //     },
  //     {
  //       name: "Cinnamon Roll",
  //       sku: "PAS-CINROLL-001",
  //       price: 300,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/anisa-cakesandbakes-c07YNJmNfaE-unsplash-jv8EdmE2nrzbd3EbDsljfDJSDMtBDk.jpg",
  //       description: "Soft and sweet cinnamon roll",
  //       stock: 60,
  //       costPrice: 200,
  //     }
  //   ]
  // },
  // {
  //   name: "Wines",
  //   items: [
  //     {
  //       name: "Red Wine",
  //       sku: "WIN-RED-001",
  //       price: 15000,
  //       image: "https://af7rxiuwmjmjjw3k.public.blob.vercel-storage.com/images/products/brenda-godinez-CrK843Pl9a4-unsplash-Vli902jMLnbuydFGpzYvZsRtpfKG0S.jpg",
  //       description: "750ml bottle of premium red wine",
  //       stock: 30,
  //       costPrice: 1000,
  //     },
  //     {
  //       name: "White Wine",
  //       sku: "WIN-WHITE-001",
  //       price: 14500,
  //       image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c",
  //       description: "750ml bottle of crisp white wine",
  //       stock: 25,
  //       costPrice: 500,
  //     }
  //   ]
  // }
]

export async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    throw new Error("Missing admin email or password")
  }

  const adminUser = await prisma.user.findUnique({
    where: {
      email: adminEmail
    }
  })

  if (!adminUser) {
    const passwordHash = hashPassword(adminPassword)
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Super Admin",
        phone: "1234567890",
        passwordHash: passwordHash,
        role: Role.ADMIN
      }
    })
    console.log("✅ Admin user created")
  }

 for (const [role, settings] of Object.entries(defaultPermissions)) {
    const roleEnum = role as Role

    const existing = await prisma.permission.findUnique({ where: { role: roleEnum } })
    if (!existing) {
      await prisma.permission.create({
        data: {
          role: roleEnum,
          settings: settings as any,
        },
      })
      console.log(`✅ Created permissions for role: ${roleEnum}`)
    } else {
      console.log(`⚠️ Permissions already exist for role: ${roleEnum}`)
    }
  }


  await prisma.deliverySetting.create({
    data: {
      enableDelivery: true,
      enablePickup: true,
      defaultDeliveryFee: 350,
      minimumOrderAmount: 1000,
      estimatedDeliveryTime: 45,
      deliveryRadius: 10,
      zones: {
        create: [
          { name: "Ikeja", fee: 350 },
          { name: "Lekki", fee: 500 },
          { name: "Victoria Island", fee: 500 },
          { name: "Yaba", fee: 400 },
        ],
      },
    },
  })

  await prisma.restaurantInfo.create({
    data: {
      name: "The Mana Restaurant",
      description: "Authentic Nigerian cuisine with a modern twist.",
      address: "123 Lagos Street, Ikeja, Lagos",
      phone: "+234 812 345 6789",
      email: "info@themanarestaurant.com",
      website: "https://themanarestaurant.com",
      logo: "/images/themanalogo.svg",
    },
  })


  for (const category of seedData) {
    await prisma.category.create({
      data: {
        name: category.name,
        products: {
          create: category.items.map((item) => ({
            name: item.name,
            sku: item.sku,
            price: item.price,
            costPrice: item.costPrice,
            description: item.description,
            isActive: true,
            images: {
              create: [{ url: item.image }]
            },
            inventory: {
              create: { quantity: item.stock }
            }
          }))
        }
      }
    })
  }

  const users = [
    { email: "user1@example.com", name: "John Doe" },
    { email: "user2@example.com", name: "Jane Smith" },
    { email: "user3@example.com", name: "Mike Johnson" },
  ]

  const passwordHash = hashPassword("password123")

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: Role.CUSTOMER,
      },
    })

    await prisma.address.create({
      data: {
        userId: user.id,
        label: "Home",
        street: "123 Street Name",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        isDefault: true,
      },
    })
  }
}

main()
  .then(() => {
    console.log("✅ Seeding completed.")
    return prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e)
    await prisma.$disconnect()
    process.exit(1)
  })

