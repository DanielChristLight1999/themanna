import { MenuItem } from "@/lib/columns/productsTableColumn";
import { CustomerNew, CustomerOrder } from "@/lib/getData";
import { create } from "zustand";

interface UIStore {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    isNewAddressDialogOpen: boolean;
    setIsNewAddressDialogOpen: (isNewAddressDialogOpen: boolean) => void;
    isFoodDialogOpen: boolean;
    setIsFoodDialogOpen: (isFoodDialogOpen: boolean) => void;
    isProductDialogOpen: boolean;
    setIsProductDialogOpen: (isProductDialogOpen: boolean) => void;
    currentFoodItem: FoodItem;
    setCurrentFoodItem: (currentFoodItem: FoodItem) => void;
    isOrderDetailsDialogOpen: boolean;
    setIsOrderDetailsDialogOpen: (isOrderDetailsDialogOpen: boolean) => void;
    setSelectedOrder: (order: CustomerOrder | null) => void;
    selectedOrder: CustomerOrder | null;
    isMenuItemDialogOpen: boolean;
    setIsMenuItemDialogOpen: (isMenuItemDialogOpen: boolean) => void;
    selectedMenuItem: MenuItem | null;
    setSelectedMenuItem: (selectedMenuItem: MenuItem | null) => void;
    isConfirmDeleteDialogOpen: boolean;
    setIsConfirmDeleteDialogOpen: (isConfirmDeleteDialogOpen: boolean) => void;
    isCustomerDialogOpen: boolean;
    setIsCustomerDialogOpen: (isCustomerDialogOpen: boolean) => void;
    selectedCustomer: CustomerNew | null;
    setSelectedCustomer: (selectedCustomer: CustomerNew | null) => void;
    selectedCategory: string | null
    setSelectedCategory: (selectedCategory: string) => void;
}

export interface FoodItem {
    name: string;
    id: string;
    category: {id: string, name: string};
    image: string | null;
    price: number;
    // rating: number;
    description: string | null;
}

const useUIStore = create<UIStore>((set) => ({
    isLoading: false,
    isNewAddressDialogOpen: false,
    setIsNewAddressDialogOpen: (isNewAddressDialogOpen) => set({ isNewAddressDialogOpen }),
    setIsLoading: (isLoading) => set({ isLoading }),
    isFoodDialogOpen: false,
    setIsFoodDialogOpen: (isFoodDialogOpen) => set({ isFoodDialogOpen }),
    isProductDialogOpen: false,
    setIsProductDialogOpen: (isProductDialogOpen) => set({ isProductDialogOpen }),
    currentFoodItem: {
        id: "" ,
        name: "",
        category: {id: "", name: ""},
        image: "",
        price: 0,
        // rating: 0,
        description: "",
    },
    setCurrentFoodItem: (currentFoodItem) => set({ currentFoodItem }),
    isOrderDetailsDialogOpen: false,
    setIsOrderDetailsDialogOpen: (isOrderDetailsDialogOpen) => set({ isOrderDetailsDialogOpen }),
    selectedOrder: null,
    setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
    isMenuItemDialogOpen: false,
    setIsMenuItemDialogOpen: (isMenuItemDialogOpen) => set({ isMenuItemDialogOpen: isMenuItemDialogOpen }),
    selectedMenuItem: null,
    setSelectedMenuItem: (selectedMenuItem) => set({ selectedMenuItem: selectedMenuItem }),
    isConfirmDeleteDialogOpen: false,
    setIsConfirmDeleteDialogOpen: (isConfirmDeleteDialogOpen) => set({ isConfirmDeleteDialogOpen: isConfirmDeleteDialogOpen }),
    isCustomerDialogOpen: false,
    setIsCustomerDialogOpen: (isCustomerDialogOpen) => set({ isCustomerDialogOpen: isCustomerDialogOpen }),
    selectedCustomer: null,
    setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer: selectedCustomer }),
    selectedCategory: "",
    setSelectedCategory: (selectedCategory) => set({ selectedCategory: selectedCategory }),
}))

export default useUIStore