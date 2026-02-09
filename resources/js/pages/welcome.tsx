import { Head, router } from '@inertiajs/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { BikeCard } from '@/components/BikeCard'
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
    /** true = free, false = reserved in selected period, null = no period selected */
    available?: boolean | null
}

type PageProps = {
    bicycles: Bicycle[]
    filters: { start?: string | null; end?: string | null; search?: string | null }
    auth: { user?: any | null }
    errors?: Record<string, string>
}

const DEBOUNCE_MS = 400

export default function Welcome({ bicycles, filters, auth, errors = {} }: PageProps) {
    const [start, setStart] = useState(filters.start ?? '')
    const [end, setEnd] = useState(filters.end ?? '')
    const [search, setSearch] = useState(filters.search ?? '')
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search ?? '')
    const [clientError, setClientError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    const canSearch = useMemo(() => start.length > 0 && end.length > 0, [start, end])
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isInitialMount = useRef(true)

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS)
        return () => clearTimeout(t)
    }, [search])

    useEffect(() => {
        const params: Record<string, string> = {}
        if (start) params.start = start
        if (end) params.end = end
        if (debouncedSearch) params.search = debouncedSearch

        const doRequest = () => {
            setClientError(null)
            const query = start && end ? params : debouncedSearch ? { search: debouncedSearch } : {}
            router.get('/', query, { preserveState: true, preserveScroll: true })
        }

        if (start && end) {
            if (isInitialMount.current) {
                isInitialMount.current = false
                doRequest()
            } else {
                searchTimeoutRef.current = setTimeout(doRequest, DEBOUNCE_MS)
            }
            return () => {
                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current)
                    searchTimeoutRef.current = null
                }
            }
        }

        isInitialMount.current = false
        const id = setTimeout(doRequest, DEBOUNCE_MS)
        return () => clearTimeout(id)
    }, [start, end, debouncedSearch])

    function clear() {
        setClientError(null)
        setStart('')
        setEnd('')
        setSearch('')
        setDebouncedSearch('')
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

    const scrollToBikes = () => {
        document.getElementById('bikes')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Velo noma" />
            <div className="flex min-h-full flex-col">
                <div className="container mx-auto flex-1 px-4 py-8 space-y-8">
                    <section className="text-center py-8 md:py-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:3rem_3rem] opacity-[0.07]" />
                        <h1 className="relative text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
                            VELO NOMA
                        </h1>
                        <p className="relative text-base md:text-lg font-light max-w-xl mx-auto opacity-90 px-4">
                            Īre velosipēdu vienkārši un ātri. Izvēlies periodu un rezervē.
                        </p>
                        <Button
                            onClick={scrollToBikes}
                            variant="secondary"
                            className="relative mt-5 md:mt-6 bg-white text-indigo-700 hover:bg-white/90 px-6 py-2.5 rounded-full font-bold shadow-lg text-sm"
                        >
                            Skatīt velosipēdus
                        </Button>
                    </section>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Rezervācijas meklētājs</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Izvēlies periodu un meklē brīvos velosipēdus
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="search">Meklēt</Label>
                            <Input
                                id="search"
                                type="search"
                                placeholder="Zīmols, modelis, krāsa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start">No</Label>
                            <Input
                                id="start"
                                type="date"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                            {errors.start && <p className="text-sm text-red-600">{errors.start}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end">Līdz</Label>
                            <Input
                                id="end"
                                type="date"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            />
                            {errors.end && <p className="text-sm text-red-600">{errors.end}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={clear}>
                                Notīrīt
                            </Button>
                        </div>
                    </div>

                    <Alert className="border-primary/50 bg-primary/5">
                        <AlertTitle className="text-base">
                            {start && end
                                ? 'Zemāk redzami visi velosipēdi — pieejamie ar pogu „Rezervēt”, aizņemtie ar atzīmi „Aizņemts”.'
                                : 'Izvēlēties laiku, lai varētu rezervēt'}
                        </AlertTitle>
                        {!start && !end && (
                            <AlertDescription>
                                Izvēlies sākuma un beigu datumu/laiku augstāk un nospied „Meklēt brīvos”, lai redzētu, kuri velosipēdi ir pieejami.
                            </AlertDescription>
                        )}
                    </Alert>

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

                    <section id="bikes" className="space-y-8">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-3xl font-bold">Mūsu velosipēdi</h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {bicycles.map((b) => (
                                <BikeCard
                                    key={b.id}
                                    bike={b}
                                    onReserve={() => reserve(b.id)}
                                    isLoggedIn={!!auth.user}
                                    hasPeriodSelected={!!start && !!end}
                                    isProcessing={processing}
                                />
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
                    </section>
                </div>

                <footer className="bg-slate-900 text-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-xl font-bold tracking-tight">VELO NOMA</p>
                        <p className="mt-4 text-slate-400 text-sm">
                            © {new Date().getFullYear()} Velo noma. Visas tiesības aizsargātas.
                        </p>
                    </div>
                </footer>
            </div>
        </AppLayout>
    )
}
