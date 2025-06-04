// Mock data generator based on Prisma schema
export interface ReportData {
  users: any[]
  products: any[]
  orders: any[]
  categories: any[]
  affiliates: any[]
  posSessions: any[]
  inventory: any[]
  payments: any[]
  commissions: any[]
}

// Generate realistic mock data based on the Prisma schema
export const generateMockReportData = (): ReportData => {
  // Categories based on restaurant menu structure
  const categories = [
    { id: 1, name: "Main Dishes", createdAt: "2024-01-15T00:00:00Z" },
    { id: 2, name: "Appetizers", createdAt: "2024-01-15T00:00:00Z" },
    { id: 3, name: "Soups", createdAt: "2024-01-15T00:00:00Z" },
    { id: 4, name: "Sides", createdAt: "2024-01-15T00:00:00Z" },
    { id: 5, name: "Desserts", createdAt: "2024-01-15T00:00:00Z" },
    { id: 6, name: "Beverages", createdAt: "2024-01-15T00:00:00Z" },
  ]

  // Products with realistic Nigerian restaurant items
  const products = [
    {
      id: 1,
      name: "Jollof Rice with Chicken",
      price: 3500,
      costPrice: 2000,
      categoryId: 1,
      isActive: true,
      sku: "JRC001",
    },
    { id: 2, name: "Fried Rice with Beef", price: 4000, costPrice: 2300, categoryId: 1, isActive: true, sku: "FRB002" },
    { id: 3, name: "Pepper Soup", price: 2500, costPrice: 1200, categoryId: 3, isActive: true, sku: "PS003" },
    { id: 4, name: "Suya", price: 1500, costPrice: 800, categoryId: 2, isActive: true, sku: "SY004" },
    {
      id: 5,
      name: "Pounded Yam with Egusi",
      price: 4500,
      costPrice: 2500,
      categoryId: 1,
      isActive: true,
      sku: "PYE005",
    },
    { id: 6, name: "Chin Chin", price: 1000, costPrice: 400, categoryId: 5, isActive: true, sku: "CC006" },
    { id: 7, name: "Chapman", price: 1200, costPrice: 500, categoryId: 6, isActive: true, sku: "CH007" },
    { id: 8, name: "Plantain", price: 800, costPrice: 300, categoryId: 4, isActive: true, sku: "PL008" },
  ]

  // Users with different roles
  const users = [
    { id: "usr_001", email: "admin@themana.com", name: "Admin User", role: "ADMIN", createdAt: "2024-01-01T00:00:00Z" },
    {
      id: "usr_002",
      email: "manager@themana.com",
      name: "Restaurant Manager",
      role: "MANAGER",
      createdAt: "2024-01-02T00:00:00Z",
    },
    {
      id: "usr_003",
      email: "cashier@themana.com",
      name: "POS Cashier",
      role: "CASHIER",
      createdAt: "2024-01-03T00:00:00Z",
    },
    {
      id: "usr_004",
      email: "john.doe@email.com",
      name: "John Doe",
      role: "CUSTOMER",
      createdAt: "2024-02-01T00:00:00Z",
    },
    {
      id: "usr_005",
      email: "jane.smith@email.com",
      name: "Jane Smith",
      role: "CUSTOMER",
      createdAt: "2024-02-05T00:00:00Z",
    },
    {
      id: "usr_006",
      email: "affiliate1@email.com",
      name: "Sarah Johnson",
      role: "AFFILIATE",
      createdAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "usr_007",
      email: "mike.wilson@email.com",
      name: "Mike Wilson",
      role: "CUSTOMER",
      createdAt: "2024-03-01T00:00:00Z",
    },
  ]

  // Affiliates with referral data
  const affiliates = [
    {
      userId: "usr_006",
      approved: true,
      referralCode: "SARAH2024",
      totalEarnings: 45000,
      createdAt: "2024-01-20T00:00:00Z",
    },
  ]

  // Orders with realistic data
  const orders = [
    {
      id: "ord_001",
      customerId: "usr_004",
      status: "DELIVERED",
      orderType: "ONLINE",
      paymentStatus: "SUCCESS",
      totalAmount: 7000,
      taxAmount: 350,
      deliveryFee: 500,
      placedAt: "2024-05-20T14:30:00Z",
      affiliateCode: "SARAH2024",
    },
    {
      id: "ord_002",
      customerId: "usr_005",
      status: "DELIVERED",
      orderType: "ONLINE",
      paymentStatus: "SUCCESS",
      totalAmount: 4500,
      taxAmount: 225,
      deliveryFee: 500,
      placedAt: "2024-05-21T18:45:00Z",
    },
    {
      id: "ord_003",
      customerId: "usr_007",
      status: "IN_TRANSIT",
      orderType: "ONLINE",
      paymentStatus: "SUCCESS",
      totalAmount: 6200,
      taxAmount: 310,
      deliveryFee: 500,
      placedAt: "2024-05-22T12:15:00Z",
    },
    {
      id: "ord_004",
      customerId: "usr_004",
      status: "PENDING",
      orderType: "ONLINE",
      paymentStatus: "PENDING",
      totalAmount: 3500,
      taxAmount: 175,
      deliveryFee: 500,
      placedAt: "2024-05-22T19:20:00Z",
    },
  ]

  // Payments linked to orders
  const payments = [
    {
      id: "pay_001",
      orderId: "ord_001",
      method: "PAYSTACK",
      amount: 7000,
      status: "SUCCESS",
      paidAt: "2024-05-20T14:32:00Z",
    },
    {
      id: "pay_002",
      orderId: "ord_002",
      method: "PAYSTACK",
      amount: 4500,
      status: "SUCCESS",
      paidAt: "2024-05-21T18:47:00Z",
    },
    {
      id: "pay_003",
      orderId: "ord_003",
      method: "TRANSFER",
      amount: 6200,
      status: "SUCCESS",
      paidAt: "2024-05-22T12:17:00Z",
    },
    { id: "pay_004", orderId: "ord_004", method: "PAYSTACK", amount: 3500, status: "PENDING", paidAt: null },
  ]

  // POS Sessions
  const posSessions = [
    { id: "pos_001", staffId: "usr_003", openedAt: "2024-05-22T09:00:00Z", closedAt: "2024-05-22T17:00:00Z" },
    { id: "pos_002", staffId: "usr_003", openedAt: "2024-05-21T09:00:00Z", closedAt: "2024-05-21T17:00:00Z" },
    { id: "pos_003", staffId: "usr_002", openedAt: "2024-05-20T10:00:00Z", closedAt: "2024-05-20T18:00:00Z" },
  ]

  // Inventory data
  const inventory = [
    { id: 1, productId: 1, quantity: 25, lowStockAlert: 5, updatedAt: "2024-05-22T00:00:00Z" },
    { id: 2, productId: 2, quantity: 18, lowStockAlert: 5, updatedAt: "2024-05-22T00:00:00Z" },
    { id: 3, productId: 3, quantity: 12, lowStockAlert: 8, updatedAt: "2024-05-22T00:00:00Z" },
    { id: 4, productId: 4, quantity: 3, lowStockAlert: 5, updatedAt: "2024-05-22T00:00:00Z" }, // Low stock
    { id: 5, productId: 5, quantity: 15, lowStockAlert: 5, updatedAt: "2024-05-22T00:00:00Z" },
    { id: 6, productId: 6, quantity: 45, lowStockAlert: 10, updatedAt: "2024-05-22T00:00:00Z" },
    { id: 7, productId: 7, quantity: 28, lowStockAlert: 5, updatedAt: "2024-05-22T00:00:00Z" },
    { id: 8, productId: 8, quantity: 22, lowStockAlert: 5, updatedAt: "2024-05-22T00:00:00Z" },
  ]

  // Commissions for affiliates
  const commissions = [
    {
      id: "com_001",
      affiliateId: "usr_006",
      orderId: "ord_001",
      amount: 350,
      paid: true,
      createdAt: "2024-05-20T14:30:00Z",
    },
  ]

  return {
    users,
    products,
    orders,
    categories,
    affiliates,
    posSessions,
    inventory,
    payments,
    commissions,
  }
}

// Helper functions for data analysis
export const getRevenueData = (orders: any[], payments: any[]) => {
  return orders
    .filter((order) => order.paymentStatus === "SUCCESS")
    .map((order) => {
      const payment = payments.find((p) => p.orderId === order.id)
      return {
        date: new Date(order.placedAt).toISOString().split("T")[0],
        amount: order.totalAmount,
        orderType: order.orderType,
        paymentMethod: payment?.method || "UNKNOWN",
      }
    })
}

export const getProductPerformance = (orders: any[], products: any[]) => {
  // This would normally come from OrderItem relations
  return products.map((product) => ({
    ...product,
    totalSold: Math.floor(Math.random() * 100), // Mock sales data
    revenue: product.price * Math.floor(Math.random() * 100),
  }))
}

export const getCustomerInsights = (users: any[], orders: any[]) => {
  return users
    .filter((user) => user.role === "CUSTOMER")
    .map((customer) => {
      const customerOrders = orders.filter((order) => order.customerId === customer.id)
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      return {
        ...customer,
        totalOrders: customerOrders.length,
        totalSpent,
        averageOrderValue: customerOrders.length > 0 ? totalSpent / customerOrders.length : 0,
        lastOrderDate: customerOrders.length > 0 ? customerOrders[customerOrders.length - 1].placedAt : null,
      }
    })
}

export const getInventoryAlerts = (inventory: any[], products: any[]) => {
  return inventory
    .filter((item) => item.quantity <= item.lowStockAlert)
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        ...item,
        productName: product?.name || "Unknown Product",
        status: item.quantity === 0 ? "OUT_OF_STOCK" : "LOW_STOCK",
      }
    })
}
