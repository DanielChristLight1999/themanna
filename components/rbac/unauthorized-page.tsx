"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ShieldX, ArrowLeft, Home, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UnauthorizedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get URL parameters for context
//   const attemptedRoute = searchParams.get("route") || "this page"
//   const requiredModule = searchParams.get("module")
//   const requiredAction = searchParams.get("action")
  const reason = searchParams.get("reason") || "insufficient permissions"

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "ADMIN":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "MANAGER":
//         return "bg-blue-100 text-blue-800 border-blue-200"
//       case "CASHIER":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "CUSTOMER":
//         return "bg-gray-100 text-gray-800 border-gray-200"
//       case "AFFILIATE":
//         return "bg-purple-100 text-purple-800 border-purple-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getAccessibleRoutes = () => {
//     if (!permissions) return []

//     const routes = []

//     // if (permissions.dashboard?.view) routes.push({ name: "Dashboard", path: "/admin" })
//     if (permissions.orders?.view) routes.push({ name: "Orders", path: "/admin/orders" })
//     if (permissions.products?.view) routes.push({ name: "Menu & Inventory", path: "/admin/menu" })
//     if (permissions.customers?.view) routes.push({ name: "Customers", path: "/admin/customers" })
//     // if (permissions.reports?.view) routes.push({ name: "Reports", path: "/admin/reports" })
//     // if (permissions.pos?.view) routes.push({ name: "Point of Sale", path: "/admin/pos" })
//     if (permissions.affiliates?.view) routes.push({ name: "Affiliates", path: "/admin/affiliates" })
//     if (permissions.settings?.view) routes.push({ name: "Settings", path: "/admin/settings" })

//     return routes
//   }

//   const accessibleRoutes = getAccessibleRoutes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Error Card */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              You don&#39;t have permission to access this page
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Reason:</strong> {reason.charAt(0).toUpperCase() + reason.slice(1)}
              </AlertDescription>
            </Alert>

            {/* User Information */}
            {/* {user && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-800">Current User</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{user.email}</span>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
              </div>
            )} */}

            {/* Required Permission */}
            {/* {requiredModule && requiredAction && (
              <div className="bg-orange-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Required Permission</span>
                </div>
                <div className="font-mono text-sm bg-white rounded px-3 py-2 border">
                  {requiredModule}.{requiredAction}
                </div>
              </div>
            )} */}

            {/* <Separator /> */}

            {/* Available Routes */}
            {/* {accessibleRoutes.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Pages you can access:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accessibleRoutes.map((route) => (
                    <Button
                      key={route.path}
                      variant="outline"
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => router.push(route.path)}
                    >
                      <div>
                        <div className="font-medium">{route.name}</div>
                        <div className="text-xs text-gray-500">{route.path}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )} */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              Need access to this page? Contact your administrator to request the necessary permissions.
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-blue-900">About Access Control</h4>
                <p className="text-sm text-blue-800">
                  The Mana Restaurant uses role-based access control to ensure data security and proper workflow
                  management. Each user role has specific permissions designed for their responsibilities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
