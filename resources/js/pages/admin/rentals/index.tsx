import { Head, router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import { ClipboardList, Search, Trash2 } from 'lucide-react'
import { ConfirmCancelReservationDialog } from '@/components/confirm-cancel-reservation-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { home } from '@/routes'
import type { BreadcrumbItem } from '@/types'

const DEBOUNCE_MS = 400

type Rental = {
    id: number
    bicycle: { id: number; brand: string; model?: string | null }
    user: { id: number; name: string; email: string }
    starts_at: string
    ends_at: string
}

type PageProps = {
    rentals: Rental[]
    filters: { search?: string | null }
}

export default function AdminRentalsIndex({ rentals, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '')
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search ?? '')
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
    const [rentalIdToCancel, setRentalIdToCancel] = useState<number | null>(null)
    const [cancellingRentalId, setCancellingRentalId] = useState<number | null>(null)
    const isFirstRun = useRef(true)

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS)
        return () => clearTimeout(t)
    }, [search])

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false
            return
        }
        router.get('/admin/rentals', debouncedSearch ? { search: debouncedSearch } : {}, { preserveState: true, preserveScroll: true })
    }, [debouncedSearch])

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Velo noma', href: home().url },
        { title: 'Rezervācijas', href: '/admin/rentals' },
    ]

    function requestCancel(rentalId: number) {
        setRentalIdToCancel(rentalId)
        setConfirmCancelOpen(true)
    }

    function confirmCancel() {
        if (rentalIdToCancel === null) return
        setCancellingRentalId(rentalIdToCancel)
        router.delete(`/admin/rentals/${rentalIdToCancel}`, {
            preserveScroll: true,
            onFinish: () => {
                setCancellingRentalId(null)
                setRentalIdToCancel(null)
            },
            onError: () => setCancellingRentalId(null),
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rezervācijas — Admin" />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <ClipboardList className="size-6" />
                            Visas rezervācijas
                        </CardTitle>
                        <div className="mt-4 max-w-sm space-y-2">
                            <Label htmlFor="admin-rentals-search">Meklēt</Label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="admin-rentals-search"
                                    type="search"
                                    placeholder="Velosipēds, lietotājs, e-pasts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {rentals.length === 0 ? (
                            <p className="text-muted-foreground">
                                Nav nevienas rezervācijas.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {rentals.map((r) => (
                                    <li
                                        key={r.id}
                                        className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {r.bicycle.brand} {r.bicycle.model ?? ''}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {r.user.name} ({r.user.email})
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(r.starts_at).toLocaleDateString('lv-LV')} –{' '}
                                                {new Date(r.ends_at).toLocaleDateString('lv-LV')}
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => requestCancel(r.id)}
                                            disabled={cancellingRentalId === r.id}
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            {cancellingRentalId === r.id ? 'Atceļ...' : 'Atcelt'}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                <ConfirmCancelReservationDialog
                    open={confirmCancelOpen}
                    onOpenChange={(open) => {
                        setConfirmCancelOpen(open)
                        if (!open) setRentalIdToCancel(null)
                    }}
                    onConfirm={confirmCancel}
                    loading={cancellingRentalId !== null}
                />
            </div>
        </AppLayout>
    )
}
