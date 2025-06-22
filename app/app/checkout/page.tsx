import { auth } from "@/auth";
import CheckoutProcess from "@/components/Apps/Checkout/checkout-process";
import AddressFormDrawer from "@/components/Apps/Checkout/new-address-dialog";
import StepIndicator from "@/components/Apps/Checkout/step-indicator";
import { loadCart } from "@/lib/getData";
import { getRestaurantSettingsNoAdmin } from "@/lib/getsettingsData";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await auth()
    if (!session) {
        redirect("/auth/login")
    }
    const settingsData = await getRestaurantSettingsNoAdmin()
    const cartItems = await loadCart()
    return (
        <main className="container h-full mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-8">Complete Your Order</h1>
            <StepIndicator />
            <CheckoutProcess settingsData={settingsData} cartItems={cartItems} />
            <AddressFormDrawer />
        </main>
    )
}
