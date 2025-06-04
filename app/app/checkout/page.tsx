import CheckoutProcess from "@/components/Apps/Checkout/checkout-process";
import AddressFormDrawer from "@/components/Apps/Checkout/new-address-dialog";
import StepIndicator from "@/components/Apps/Checkout/step-indicator";

export default function page() {
    return (
        <main className="container h-full mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-8">Complete Your Order</h1>
            <StepIndicator />
            <CheckoutProcess />
            <AddressFormDrawer />
        </main>
    )
}
