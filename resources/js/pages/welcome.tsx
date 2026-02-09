import { Head, router } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { home } from '@/routes'
import type { BreadcrumbItem } from '@/types'

type Bicycle = {
    id: number
    brand: string
    model?: string | null
    color: string
    frame_size?: string | null
}

type PageProps = {
    bicycles: Bicycle[]
    filters: { start?: string | null; end?: string | null }
    auth: { user?: any | null }
    errors?: Record<string, string>
}

export default function Welcome({ bicycles, filters, auth, errors = {} }: PageProps) {
    const [start, setStart] = useState(filters.start ?? '')
    const [end, setEnd] = useState(filters.end ?? '')
    const [clientError, setClientError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    const canSearch = useMemo(() => start.length > 0 && end.length > 0, [start, end])

    function search() {
        setClientError(null)
        router.get(
            '/',
            { start, end },
            { preserveState: true, preserveScroll: true }
        )
    }

    function clear() {
        setClientError(null)
        setStart('')
        setEnd('')
        router.get('/', {}, { preserveState: true, preserveScroll: true })
    }

    function reserve(bicycleId: number) {
        setClientError(null)

        if (!start || !end) {
            setClientError('Izvēlies sākuma un beigu datumu/laiku.')
            return
        }

        setProcessing(true)
        router.post(
            '/rentals',
            { bicycle_id: bicycleId, start, end },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onError: () => setProcessing(false),
            }
        )
    }

    // Ja RentalController abort(422, '...') netiek ielikts form errors,
    // redzēsi vismaz validācijas errors.start/end u.c. Šeit rādām arī “clientError”.
    const reservationError =
        errors.reservation || errors.bicycle_id || (errors as any).message || null

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Velo noma', href: home().url },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Velo noma" />
            <div className="mx-auto max-w-5xl p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">🚲 Velo noma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="start">No</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                            {errors.start && <p className="text-sm text-red-600">{errors.start}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end">Līdz</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            />
                            {errors.end && <p className="text-sm text-red-600">{errors.end}</p>}
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={search} disabled={!canSearch}>
                                Meklēt brīvos
                            </Button>
                            <Button variant="secondary" onClick={clear}>
                                Notīrīt
                            </Button>
                        </div>
                    </div>

                    {!auth.user && (
                        <Alert>
                            <AlertTitle>Nepieciešama autorizācija</AlertTitle>
                            <AlertDescription>
                                Lai rezervētu velosipēdu, ielogojies. Brīvos velosipēdus vari skatīt arī bez login.
                            </AlertDescription>
                        </Alert>
                    )}

                    {clientError && (
                        <Alert variant="destructive">
                            <AlertTitle>Kļūda</AlertTitle>
                            <AlertDescription>{clientError}</AlertDescription>
                        </Alert>
                    )}

                    {reservationError && (
                        <Alert variant="destructive">
                            <AlertTitle>Rezervācija neizdevās</AlertTitle>
                            <AlertDescription>{reservationError}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {bicycles.map((b) => (
                    <Card key={b.id} className="rounded-2xl">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-lg">
                                {b.brand} {b.model ?? ''}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Krāsa: {b.color}
                                {b.frame_size ? ` • Rāmis: ${b.frame_size}` : ''}
                            </p>
                        </CardHeader>

                        <CardContent className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                {start && end ? 'Pieejams izvēlētajā periodā' : 'Izvēlies periodu, lai filtrētu'}
                            </div>

                            {auth.user ? (
                                <Button onClick={() => reserve(b.id)} disabled={!canSearch || processing}>
                                    Rezervēt
                                </Button>
                            ) : (
                                <Button variant="secondary" disabled>
                                    Ielogojies, lai rezervētu
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {bicycles.length === 0 && (
                <Alert>
                    <AlertTitle>Nav pieejamu velosipēdu</AlertTitle>
                    <AlertDescription>
                        Izvēlētajā periodā visi velosipēdi ir aizņemti. Pamēģini citu laika intervālu.
                    </AlertDescription>
                </Alert>
            )}
            </div>
        </AppLayout>
    )
}
