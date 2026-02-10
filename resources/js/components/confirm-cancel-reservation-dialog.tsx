import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmCancelReservationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    loading?: boolean
    title?: string
    description?: string
}

export function ConfirmCancelReservationDialog({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
    title = 'Vai atcelt rezervāciju?',
    description = 'Šī darbība ir neatgriezeniska. Rezervācija tiks noņemta.',
}: ConfirmCancelReservationDialogProps) {
    function handleConfirm() {
        onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Atcelt
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Apstiprināšana...' : 'Apstiprināt'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
