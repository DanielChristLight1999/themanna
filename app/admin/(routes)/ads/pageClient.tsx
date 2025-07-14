"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus, Search, Edit, Power, Trash2, ExternalLink, ImageIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddFlyerModal } from "@/components/admin/ads/add-flyer-modal"
import { EditFlyerModal } from "@/components/admin/ads/edit-flyer-modal"
import { toast } from "sonner"
import { FlyerAd } from "@/lib/generated/prisma"
import { deleteFlyer, toggleFlyerActive } from "@/actions/admin/ads-actions"

// Mock data schema
// interface FlyerAd {
//   id: number
//   title: string
//   imageUrl: string
//   linkUrl?: string
//   isActive: boolean
//   position: "top" | "middle" | "footer"
//   createdAt: Date
//   expiresAt?: Date
// }

// Mock data
// const mockFlyers: FlyerAd[] = [
//   {
//     id: 1,
//     title: "Summer Special Menu",
//     imageUrl: "/placeholder.svg?height=100&width=200",
//     linkUrl: "https://example.com/summer-menu",
//     isActive: true,
//     position: "top",
//     createdAt: new Date("2024-01-15"),
//     expiresAt: new Date("2024-08-31"),
//   },
//   {
//     id: 2,
//     title: "Weekend Brunch Offer",
//     imageUrl: "/placeholder.svg?height=100&width=200",
//     linkUrl: "https://example.com/brunch",
//     isActive: true,
//     position: "middle",
//     createdAt: new Date("2024-01-10"),
//     expiresAt: new Date("2024-06-30"),
//   },
//   {
//     id: 3,
//     title: "Happy Hour Drinks",
//     imageUrl: "/placeholder.svg?height=100&width=200",
//     isActive: false,
//     position: "footer",
//     createdAt: new Date("2024-01-05"),
//     expiresAt: new Date("2024-05-15"),
//   },
//   {
//     id: 4,
//     title: "New Year Celebration",
//     imageUrl: "/placeholder.svg?height=100&width=200",
//     linkUrl: "https://example.com/new-year",
//     isActive: false,
//     position: "top",
//     createdAt: new Date("2023-12-20"),
//     expiresAt: new Date("2024-01-02"),
//   },
//   {
//     id: 5,
//     title: "Valentine's Day Special",
//     imageUrl: "/placeholder.svg?height=100&width=200",
//     linkUrl: "https://example.com/valentines",
//     isActive: true,
//     position: "middle",
//     createdAt: new Date("2024-01-20"),
//     expiresAt: new Date("2024-02-15"),
//   },
// ]

export default function AdsPage({ initialFlyers }: { initialFlyers: FlyerAd[] }) {
    const [flyers, setFlyers] = useState<FlyerAd[]>(initialFlyers)
    const [filteredFlyers, setFilteredFlyers] = useState<FlyerAd[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [positionFilter, setPositionFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingFlyer, setEditingFlyer] = useState<FlyerAd | null>(null)
    const [deletingFlyer, setDeletingFlyer] = useState<FlyerAd | null>(null)
    const [isLoading, setIsLoading] = useState(false)


    // Filter flyers based on search and filters
    useEffect(() => {
        let filtered = flyers

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (flyer) =>
                    flyer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (flyer.linkUrl && flyer.linkUrl.toLowerCase().includes(searchQuery.toLowerCase())),
            )
        }

        // Position filter
        if (positionFilter !== "all") {
            filtered = filtered.filter((flyer) => flyer.position === positionFilter)
        }

        // Status filter
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active"
            filtered = filtered.filter((flyer) => flyer.isActive === isActive)
        }

        setFilteredFlyers(filtered)
    }, [flyers, searchQuery, positionFilter, statusFilter])

    const handleAddFlyer = async (newFlyer: FlyerAd) => {
        setFlyers((prev) => [...prev, newFlyer])
        toast.success("Flyer ad has been created successfully.")
    }

    const handleEditFlyer = (updatedFlyer: FlyerAd) => {
        setFlyers((prev) => prev.map((f) => (f.id === updatedFlyer.id ? updatedFlyer : f)))
        toast.success("Flyer ad has been updated successfully.")
    }

    const handleToggleActive = async (flyerId: number) => {
        const flyer = flyers.find((f) => f.id === flyerId)
        if (!flyer) return

        try {
            // Simulate API call
            const response = await toggleFlyerActive(flyerId, !flyer.isActive)
            if (response.error || !response.data) {
                toast.error(response.message)
                return
            }
            setFlyers((prev) => prev.map((f) => (f.id === flyerId ? response.data : f)))
            toast.success(`Flyer ad has been ${flyer.isActive ? "deactivated" : "activated"}.`)

        } catch (error) {
            toast.error("Failed to update flyer status.")
        }
    }

    const handleDeleteFlyer = async () => {
        if (!deletingFlyer) return

        try {
            // Simulate API call
            const response = await deleteFlyer(deletingFlyer.id)
            if (response.error || !response.data) {
                toast.error(response.message)
                return
            }
            setFlyers((prev) => prev.filter((f) => f.id !== deletingFlyer.id))
            setDeletingFlyer(null)

            toast.success("Flyer ad has been deleted successfully.")
        } catch (error) {
            toast.error("Failed to delete flyer ad.")
        }
    }

    const getPositionBadgeColor = (position: string) => {
        switch (position) {
            case "top":
                return "bg-blue-100 text-blue-800"
            case "middle":
                return "bg-green-100 text-green-800"
            case "footer":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const isExpired = (expiresAt?: Date | null) => {
        return expiresAt && expiresAt < new Date()
    }

    return (
        <div>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Advertisement Management</h1>
                            <p className="text-muted-foreground">Manage flyer-based advertisements and their placements.</p>
                        </div>
                        <Button onClick={() => setIsAddModalOpen(true)} className="sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Flyer
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                            <CardDescription>Filter and search through your flyer advertisements.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search flyers..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={positionFilter} onValueChange={setPositionFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Positions</SelectItem>
                                        <SelectItem value="top">Top</SelectItem>
                                        <SelectItem value="middle">Middle</SelectItem>
                                        <SelectItem value="footer">Footer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flyers Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Flyer Advertisements</span>
                                <Badge variant="secondary">{filteredFlyers.length} flyers</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <div className="h-16 w-24 bg-gray-200 rounded animate-pulse" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredFlyers.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <div className="mb-2">No flyer ads found</div>
                                    <div className="text-sm">Create your first flyer advertisement to get started.</div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Mobile Card View */}
                                    <div className="block lg:hidden space-y-4">
                                        {filteredFlyers.map((flyer) => (
                                            <Card key={flyer.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="relative">
                                                            <Image
                                                                src={flyer.imageUrl || "/placeholder.svg"}
                                                                alt={flyer.title}
                                                                width={80}
                                                                height={60}
                                                                className="rounded-lg object-cover"
                                                            />
                                                            {isExpired(flyer.expiresAt) && (
                                                                <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                                    <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                                                                        EXPIRED
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium truncate">{flyer.title}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge className={getPositionBadgeColor(flyer.position)}>{flyer.position}</Badge>
                                                                <Badge variant={flyer.isActive ? "default" : "secondary"}>
                                                                    {flyer.isActive ? "Active" : "Inactive"}
                                                                </Badge>
                                                            </div>
                                                            {flyer.linkUrl && (
                                                                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    <span className="truncate">{flyer.linkUrl}</span>
                                                                </div>
                                                            )}
                                                            {flyer.expiresAt && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Expires: {format(flyer.expiresAt, "MMM d, yyyy")}
                                                                </p>
                                                            )}
                                                            <div className="flex gap-2 mt-3">
                                                                <Button variant="outline" size="sm" onClick={() => setEditingFlyer(flyer)}>
                                                                    <Edit className="h-3 w-3 mr-1" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleToggleActive(flyer.id)}
                                                                    className={flyer.isActive ? "text-orange-600" : "text-green-600"}
                                                                >
                                                                    <Power className="h-3 w-3 mr-1" />
                                                                    {flyer.isActive ? "Deactivate" : "Activate"}
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setDeletingFlyer(flyer)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden lg:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Preview</TableHead>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Position</TableHead>
                                                    <TableHead>Link URL</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Expiration</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredFlyers.map((flyer) => (
                                                    <TableRow key={flyer.id}>
                                                        <TableCell>
                                                            <div className="relative">
                                                                <Image
                                                                    src={flyer.imageUrl || "/placeholder.svg"}
                                                                    alt={flyer.title}
                                                                    width={80}
                                                                    height={60}
                                                                    className="rounded-lg object-cover"
                                                                />
                                                                {isExpired(flyer.expiresAt) && (
                                                                    <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                                        <span className="text-xs font-medium text-red-700 bg-red-100 px-1 py-0.5 rounded">
                                                                            EXPIRED
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{flyer.title}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Created {format(flyer.createdAt, "MMM d, yyyy")}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getPositionBadgeColor(flyer.position)}>{flyer.position}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {flyer.linkUrl ? (
                                                                <div className="flex items-center gap-1 max-w-[200px]">
                                                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                                    <span className="truncate text-sm">{flyer.linkUrl}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={flyer.isActive ? "default" : "secondary"}>
                                                                {flyer.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {flyer.expiresAt ? (
                                                                <div
                                                                    className={`text-sm ${isExpired(flyer.expiresAt) ? "text-red-600 font-medium" : ""}`}
                                                                >
                                                                    {format(flyer.expiresAt, "MMM d, yyyy")}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">No expiration</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => setEditingFlyer(flyer)}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    title={flyer.isActive ? "Deactivate Flyer" : "Activate Flyer"}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleToggleActive(flyer.id)}
                                                                    className={flyer.isActive ? "text-orange-600" : "text-green-600"}
                                                                >
                                                                    <Power className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setDeletingFlyer(flyer)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Modals */}
            <AddFlyerModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddFlyer} />

            {editingFlyer && (
                <EditFlyerModal
                    open={!!editingFlyer}
                    onOpenChange={(open) => !open && setEditingFlyer(null)}
                    flyer={editingFlyer}
                    onSubmit={handleEditFlyer}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingFlyer} onOpenChange={(open) => !open && setDeletingFlyer(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Flyer Ad</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {deletingFlyer?.title}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteFlyer} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
