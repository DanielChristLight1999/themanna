// import { withAccelerate } from "@prisma/extension-accelerate"
// import { PrismaClient, Role } from "@/lib/generated/prisma"
// import { hashPassword } from "@/lib/utils"

// const prisma = new PrismaClient().$extends(withAccelerate())

// const seedData = [
//   {
//     name: "Foods",
//     items: [
//       {
//         name: "Chicken Tikka",
//         sku: "FOD-CHICK-001",
//         price: 10000,
//         image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
//         description:
//           "Chicken Tikka is a popular Indian dish made with marinated chicken pieces cooked in a tandoor oven.",
//         stock: 100
//       },
//       {
//         name: "Mango Lassi",
//         sku: "FOD-MANGO-001",
//         price: 4250,
//         image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054",
//         description: "Mango Lassi is a refreshing Indian yogurt drink blended with ripe mangoes.",
//         stock: 50
//       },
//       {
//         name: "Margherita Pizza",
//         sku: "FOD-MARG-001",
//         price: 12000,
//         image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
//         description: "Classic Italian pizza with mozzarella cheese and fresh basil.",
//         stock: 60
//       },
//       {
//         name: "French Fries",
//         sku: "FOD-FRIES-001",
//         price: 5000,
//         image: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35",
//         description: "Crispy golden French fries, lightly salted.",
//         stock: 50
//       },
//       {
//         name: "Chocolate Lava Cake",
//         sku: "FOD-CHOC-001",
//         price: 6000,
//         image: "https://images.unsplash.com/photo-1665556387816-cba60197beec",
//         description: "Warm chocolate cake with a molten center.",
//         stock: 60
//       }
//     ]
//   },
//   {
//     name: "Beverages",
//     items: [
//       {
//         name: "Coca Cola",
//         sku: "BEV-COKE-001",
//         price: 200,
//         image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
//         description: "Chilled 500ml Coca Cola bottle",
//         stock: 100
//       },
//       {
//         name: "Pepsi",
//         sku: "BEV-PEPSI-001",
//         price: 190,
//         image: "https://images.unsplash.com/photo-1553456558-aff63285bdd1",
//         description: "Refreshing 500ml Pepsi drink",
//         stock: 90
//       }
//     ]
//   },
//   {
//     name: "Pastries",
//     items: [
//       {
//         name: "Chocolate Croissant",
//         sku: "PAS-CHCRO-001",
//         price: 250,
//         image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd",
//         description: "Flaky pastry filled with chocolate",
//         stock: 50
//       },
//       {
//         name: "Cinnamon Roll",
//         sku: "PAS-CINROLL-001",
//         price: 300,
//         image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd",
//         description: "Soft and sweet cinnamon roll",
//         stock: 60
//       }
//     ]
//   },
//   {
//     name: "Wines",
//     items: [
//       {
//         name: "Red Wine",
//         sku: "WIN-RED-001",
//         price: 15000,
//         image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c",
//         description: "750ml bottle of premium red wine",
//         stock: 30
//       },
//       {
//         name: "White Wine",
//         sku: "WIN-WHITE-001",
//         price: 14500,
//         image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c",
//         description: "750ml bottle of crisp white wine",
//         stock: 25
//       }
//     ]
//   }
// ]

// export async function main() {
//   const adminEmail = process.env.ADMIN_EMAIL
//   const adminPassword = process.env.ADMIN_PASSWORD
//   if (!adminEmail || !adminPassword) {
//     throw new Error("Missing admin email or password")
//   }

//   const adminUser = await prisma.user.findUnique({
//     where: {
//       email: adminEmail
//     }
//   })

//   if (!adminUser) {
//     const passwordHash = hashPassword(adminPassword)
//     await prisma.user.create({
//       data: {
//         email: adminEmail,
//         name: "Super Admin",
//         phone: "1234567890",
//         passwordHash: passwordHash,
//         role: Role.ADMIN
//       }
//     })
//     console.log("✅ Admin user created")
//   }
//   for (const category of seedData) {
//     await prisma.category.create({
//       data: {
//         name: category.name,
//         products: {
//           create: category.items.map((item) => ({
//             name: item.name,
//             sku: item.sku,
//             price: item.price,
//             description: item.description,
//             isActive: true,
//             images: {
//               create: [{ url: item.image }]
//             },
//             inventory: {
//               create: { quantity: item.stock }
//             }
//           }))
//         }
//       }
//     })
//   }
// }

// main()
//   .then(() => {
//     console.log("✅ Seeding completed.")
//     return prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error("❌ Seeding error:", e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })



import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaClient, Role, OrderStatus, OrderType, PaymentStatus, PaymentMethod, DeliveryType } from "@/lib/generated/prisma"
import { hashPassword } from "@/lib/utils"

const prisma = new PrismaClient().$extends(withAccelerate())

const seedData = [
  {
    name: "Foods",
    items: [
      {
        name: "Chicken Tikka",
        sku: "FOD-CHICK-001",
        price: 10000,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        description:
          "Chicken Tikka is a popular Indian dish made with marinated chicken pieces cooked in a tandoor oven.",
        stock: 100
      },
      {
        name: "Mango Lassi",
        sku: "FOD-MANGO-001",
        price: 4250,
        image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054",
        description: "Mango Lassi is a refreshing Indian yogurt drink blended with ripe mangoes.",
        stock: 50
      },
      {
        name: "Margherita Pizza",
        sku: "FOD-MARG-001",
        price: 12000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        description: "Classic Italian pizza with mozzarella cheese and fresh basil.",
        stock: 60
      },
      {
        name: "French Fries",
        sku: "FOD-FRIES-001",
        price: 5000,
        image: "https://images.unsplash.com/photo-1630431341973-02e1b662ec35",
        description: "Crispy golden French fries, lightly salted.",
        stock: 50
      },
      {
        name: "Chocolate Lava Cake",
        sku: "FOD-CHOC-001",
        price: 6000,
        image: "https://images.unsplash.com/photo-1665556387816-cba60197beec",
        description: "Warm chocolate cake with a molten center.",
        stock: 60
      }
    ]
  },
  {
    name: "Beverages",
    items: [
      {
        name: "Coca Cola",
        sku: "BEV-COKE-001",
        price: 200,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
        description: "Chilled 500ml Coca Cola bottle",
        stock: 100
      },
      {
        name: "Pepsi",
        sku: "BEV-PEPSI-001",
        price: 190,
        image: "https://images.unsplash.com/photo-1553456558-aff63285bdd1",
        description: "Refreshing 500ml Pepsi drink",
        stock: 90
      }
    ]
  },
  {
    name: "Pastries",
    items: [
      {
        name: "Chocolate Croissant",
        sku: "PAS-CHCRO-001",
        price: 250,
        image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd",
        description: "Flaky pastry filled with chocolate",
        stock: 50
      },
      {
        name: "Cinnamon Roll",
        sku: "PAS-CINROLL-001",
        price: 300,
        image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd",
        description: "Soft and sweet cinnamon roll",
        stock: 60
      }
    ]
  },
  {
    name: "Wines",
    items: [
      {
        name: "Red Wine",
        sku: "WIN-RED-001",
        price: 15000,
        image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c",
        description: "750ml bottle of premium red wine",
        stock: 30
      },
      {
        name: "White Wine",
        sku: "WIN-WHITE-001",
        price: 14500,
        image: "https://images.unsplash.com/photo-1630369160812-26c7604cbd8c",
        description: "750ml bottle of crisp white wine",
        stock: 25
      }
    ]
  }
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

  for (const category of seedData) {
    await prisma.category.create({
      data: {
        name: category.name,
        products: {
          create: category.items.map((item) => ({
            name: item.name,
            sku: item.sku,
            price: item.price,
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

    const address = await prisma.address.create({
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

    const products = await prisma.product.findMany()
    const orderCount = Math.floor(Math.random() * 7) + 4

    for (let i = 0; i < orderCount; i++) {
      const orderItems = products.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 1).map((product) => {
        const quantity = Math.floor(Math.random() * 3) + 1
        return {
          productId: product.id,
          quantity,
          unitPrice: product.price
        }
      })

      const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

      const order = await prisma.order.create({
        data: {
          customerId: user.id,
          addressId: address.id,
          status: OrderStatus.DELIVERED,
          orderType: OrderType.ONLINE,
          paymentStatus: PaymentStatus.SUCCESS,
          deliveryType: DeliveryType.DELIVERY,
          totalAmount,
          placedAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
          items: {
            create: orderItems,
          },
        }
      })

      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: [PaymentMethod.CASH, PaymentMethod.PAYSTACK, PaymentMethod.TRANSFER][Math.floor(Math.random() * 3)],
          amount: totalAmount,
          status: PaymentStatus.SUCCESS,
          paidAt: new Date(),
        },
      })
    }
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

