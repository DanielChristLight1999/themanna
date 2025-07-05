import { updateCategory } from '@/actions/admin/menu-actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
    id: z.number(),
    name: z.string().min(3),
})
interface EditCategoryDialogProps {
    id: number;
    name: string;
    isOpen: boolean;
    onClose: () => void;
    // setisOpen: (isOpen: boolean) => void;

}
const EditCategoryDialog = ({ id, name, isOpen, onClose }: EditCategoryDialogProps) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            id: id,
            name: name,
        },
    })
    const handleSubmit = async (data: z.infer<typeof schema>) => {
        const { name, id } = data
        const response = await updateCategory(id, name);
        if (response.error) {
            toast.error(response.message);
            return;
        }
        toast.success(response.message);
        router.refresh();
        onClose();
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Edit the details of this category.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Category name" className="input input-bordered w-full max-w-xs" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex justify-end gap-4">
                            <Button type="submit" className="btn btn-primary">
                                {form.formState.isSubmitting ? (
                                    <div className='flex items-center gap-2'>
                                        <Loader2 className="animate-spin" />
                                        Saving
                                    </div>
                                ) : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditCategoryDialog