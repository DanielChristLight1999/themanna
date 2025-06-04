
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getTopProducts } from "@/lib/getDashboardData"

interface TopProductsProps {
  filterType?: "online" | "pos" | "pickup"
}

// Mock data - would be replaced with actual data from API
// const getTopProducts = (filterType?: string) => {
//   // This would be an API call in a real application
//   const allProducts = [
//     {
//       name: "Jollof Rice Special",
//       quantity: filterType === "pos" ? 42 : filterType === "pickup" ? 18 : filterType === "online" ? 76 : 136,
//       percentage: 25,
//       revenue:
//         filterType === "pos" ? 42000 : filterType === "pickup" ? 18000 : filterType === "online" ? 76000 : 136000,
//     },
//     {
//       name: "Suya Platter",
//       quantity: filterType === "pos" ? 38 : filterType === "pickup" ? 15 : filterType === "online" ? 62 : 115,
//       percentage: 21,
//       revenue:
//         filterType === "pos" ? 38000 : filterType === "pickup" ? 15000 : filterType === "online" ? 62000 : 115000,
//     },
//     {
//       name: "Egusi Soup & Pounded Yam",
//       quantity: filterType === "pos" ? 30 : filterType === "pickup" ? 12 : filterType === "online" ? 48 : 90,
//       percentage: 16,
//       revenue:
//         filterType === "pos" ? 45000 : filterType === "pickup" ? 18000 : filterType === "online" ? 72000 : 135000,
//     },
//     {
//       name: "Pepper Soup",
//       quantity: filterType === "pos" ? 25 : filterType === "pickup" ? 10 : filterType === "online" ? 40 : 75,
//       percentage: 14,
//       revenue: filterType === "pos" ? 25000 : filterType === "pickup" ? 10000 : filterType === "online" ? 40000 : 75000,
//     },
//     {
//       name: "Moin Moin Deluxe",
//       quantity: filterType === "pos" ? 20 : filterType === "pickup" ? 8 : filterType === "online" ? 32 : 60,
//       percentage: 11,
//       revenue: filterType === "pos" ? 16000 : filterType === "pickup" ? 6400 : filterType === "online" ? 25600 : 48000,
//     },
//   ]

//   return allProducts
// }

export async function TopProducts({ filterType }: TopProductsProps) {
  const products = await getTopProducts(filterType)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Your best-selling menu items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product) => (
          <div key={product.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.quantity} orders · ₦{product.revenue.toLocaleString()}
                </p>
              </div>
              <p className="text-sm font-medium">{product.percentage}%</p>
            </div>
            <Progress value={product.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
