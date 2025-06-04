"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"

// Mock data - would be replaced with actual data from API
const users = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "MANAGER",
    status: "ACTIVE",
  },
  {
    id: "USR-003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "CASHIER",
    status: "ACTIVE",
  },
  {
    id: "USR-004",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "CASHIER",
    status: "INACTIVE",
  },
  {
    id: "USR-005",
    name: "David Okafor",
    email: "david.okafor@example.com",
    role: "AFFILIATE",
    status: "ACTIVE",
  },
]

// Mock permissions data
const permissions = {
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

export function UserRolesSettings() {
  const [selectedRole, setSelectedRole] = useState("ADMIN")
  const [rolePermissions, setRolePermissions] = useState(permissions)

  const handlePermissionChange = (role: string, module: string, permission: string, checked: boolean) => {
    setRolePermissions({
      ...rolePermissions,
      [role]: {
        ...rolePermissions[role as keyof typeof rolePermissions],
        [module]: {
          ...rolePermissions[role as keyof typeof rolePermissions][
            module as keyof (typeof rolePermissions)[keyof typeof rolePermissions]
          ],
          [permission]: checked,
        },
      },
    })
  }

  const handleSave = () => {
    // In a real app, this would call an API to save the permissions
    console.log("Saving role permissions:", rolePermissions)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users and their access to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="add">Add User</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="add" className="pt-4">
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="john.doe@example.com" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select>
                      <SelectTrigger id="user-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="CASHIER">Cashier</SelectItem>
                        <SelectItem value="AFFILIATE">Affiliate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input id="user-password" type="password" />
                  </div>
                </div>
                <Button className="w-full">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Configure what each role can access and modify</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="select-role">Select Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="select-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="CASHIER">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Update</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(rolePermissions[selectedRole as keyof typeof rolePermissions]).map(
                    ([module, perms]) => (
                      <TableRow key={module}>
                        <TableCell className="font-medium capitalize">{module}</TableCell>
                        {Object.entries(perms).map(([permission, value]) => (
                          <TableCell key={permission}>
                            <Checkbox
                              checked={value as boolean}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(selectedRole, module, permission, checked as boolean)
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Permissions</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
