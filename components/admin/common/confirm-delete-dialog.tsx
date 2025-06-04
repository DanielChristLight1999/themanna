"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useUIStore from '@/stores/uistore';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


interface ConfirmDeleteDialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}
const ConfirmDeleteDialog = ({ onConfirm, onCancel, loading }: ConfirmDeleteDialogProps) => {
    const isOpen = useUIStore((state) => state.isConfirmDeleteDialogOpen);
    const setisOpen = useUIStore((state) => state.setIsConfirmDeleteDialogOpen);
    return (
        <Dialog open={isOpen} onOpenChange={setisOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex justify-end gap-4'>
                    <Button className='cursor-pointer' variant={"ghost"} onClick={onCancel}>Cancel</Button>
                    <Button className='cursor-pointer' variant={"destructive"} onClick={onConfirm}>
                        {loading ? <Loader2 className='animate-spin' /> : 'Delete'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default ConfirmDeleteDialog