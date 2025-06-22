"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"
import { Role, User } from "@/lib/generated/prisma"
import { getRolePermissions, saveRolePermissions } from "@/actions/admin/settings-actions"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import AuthButton from "@/components/Apps/common/AuthButton"
import { createUser } from "@/actions/admin/user-actions"
import { useRouter } from "next/navigation"
import { RolePermissionSettings } from "@/lib/permissions/types"


// Mock permissions data
// const permissions = {
//   ADMIN: {
//     orders: { view: true, create: true, update: true, delete: true },
//     products: { view: true, create: true, update: true, delete: true },
//     customers: { view: true, create: true, update: true, delete: true },
//     affiliates: { view: true, create: true, update: true, delete: true },
//     reports: { view: true, create: true, export: true },
//     settings: { view: true, update: true },
//     users: { view: true, create: true, update: true, delete: true },
//   },
//   MANAGER: {
//     orders: { view: true, create: true, update: true, delete: false },
//     products: { view: true, create: true, update: true, delete: false },
//     customers: { view: true, create: true, update: true, delete: false },
//     affiliates: { view: true, create: false, update: false, delete: false },
//     reports: { view: true, create: true, export: true },
//     settings: { view: true, update: false },
//     users: { view: true, create: false, update: false, delete: false },
//   },
//   CASHIER: {
//     orders: { view: true, create: true, update: false, delete: false },
//     products: { view: true, create: false, update: false, delete: false },
//     customers: { view: true, create: true, update: false, delete: false },
//     affiliates: { view: false, create: false, update: false, delete: false },
//     reports: { view: false, create: false, export: false },
//     settings: { view: false, update: false },
//     users: { view: false, create: false, update: false, delete: false },
//   },
// }

export const adminformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MANAGER", "CASHIER", "AFFILIATE"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function UserRolesSettings({ adminusers, currentUserpermissions }: { adminusers: User[], currentUserpermissions: RolePermissionSettings }) {
  const [selectedRole, setSelectedRole] = useState<Role>("ADMIN")
  const [permissions, setPermissions] = useState<Record<string, any>>({})
  const [isPending, startTransition] = useTransition()
  const canCreateUser = currentUserpermissions?.users?.create ?? false
  const canUpdateUser = currentUserpermissions?.users?.update ?? false
  const canUpdateSettings = currentUserpermissions?.settings?.update ?? false

  const router = useRouter()

  const form = useForm<z.infer<typeof adminformSchema>>({
    resolver: zodResolver(adminformSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "ADMIN",
      password: "",
    },
  })




  useEffect(() => {
    startTransition(async () => {
      const perms = await getRolePermissions(selectedRole)
      if (perms) {
        setPermissions(perms)
      } else {
        setPermissions({}) // fallback
      }
    })
  }, [selectedRole])

  const handleChange = (module: string, action: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value
      }
    }))
  }

  const handleSave = async () => {
    const res = await saveRolePermissions(selectedRole, permissions)
    if (res.error) {
      toast.error(res.message)
    } else {
      toast.success(res.message)
    }
  }

  const onSubmit = async (data: z.infer<typeof adminformSchema>) => {
    const response = await createUser(data);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    form.reset();
    router.refresh();
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
              {canCreateUser && (
                <TabsTrigger value="add">Add User</TabsTrigger>
              )}
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
                  {adminusers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                      <TableCell className="text-right">
                        {canUpdateUser && (
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="add" className="pt-4">
              {canCreateUser ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>FullName</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="johndoe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger >
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="CASHIER">Cashier</SelectItem>
                                <SelectItem value="AFFILIATE">Affiliate</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <AuthButton buttonText="Add User" loading={form.formState.isSubmitting} />
                  </form>
                </Form>
              ) : (<p className="text-muted-foreground text-sm">You do not have permission to create users</p>)
              }
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* <Card>
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
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Edit permissions by role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Role</Label>
            <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as Role)}>
              <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {Object.keys(permissions).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Create</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead>Delete</TableHead>
                  {Object.keys(permissions?.[Object.keys(permissions)[0]] || {}).includes("export") && (
                    <TableHead>Export</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(permissions).map(([module, actions]) => (
                  <TableRow key={module}>
                    <TableCell className="capitalize font-medium">{module}</TableCell>
                    {Object.entries(actions).map(([action, allowed]) => (
                      <TableCell key={action}>
                        <Checkbox
                          disabled={!canUpdateSettings}
                          checked={allowed as boolean}
                          onCheckedChange={(val) =>
                            handleChange(module, action, val as boolean)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-sm">No permissions loaded</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isPending || !canUpdateSettings}>
            {isPending ? "Saving..." : "Save Permissions"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
