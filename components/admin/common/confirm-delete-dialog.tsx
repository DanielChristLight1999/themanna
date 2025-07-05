"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useUIStore from '@/stores/uistore';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';


interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    setisOpen: (isOpen: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
    message?: string;
}
const ConfirmDeleteDialog = ({ isOpen, setisOpen,onConfirm, onCancel, loading, message }: ConfirmDeleteDialogProps) => {
    
    return (
        <Dialog open={isOpen} onOpenChange={setisOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        {message || "This action cannot be undone."}
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