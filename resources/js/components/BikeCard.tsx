import { Bike } from 'lucide-react'
import { colorToLatvian } from '@/lib/colors-lv'
import { Button } from './ui/button'


type Bicycle = {
    id: number
    brand: string
    model?: string | null
    color: string
    frame_size?: string | null
    available?: boolean | null
}

interface BikeCardProps {
    bike: Bicycle
    onReserve: () => void
    isLoggedIn: boolean
    hasPeriodSelected: boolean
    isProcessing: boolean
}

export function BikeCard({
    bike,
    onReserve,
    isLoggedIn,
    hasPeriodSelected,
    isProcessing,
}: BikeCardProps) {
    const name = [bike.brand, bike.model].filter(Boolean).join(' ')

    const buttonContent = () => {
        if (!hasPeriodSelected) return 'Izvēlies periodu'
        if (!isLoggedIn) return 'Ielogojies, lai rezervētu'
        if (bike.available === false) return 'Rezervēts'
        return 'Rezervēt'
    }

    const isButtonDisabled =
        !hasPeriodSelected || !isLoggedIn || bike.available === false || isProcessing

    return (
        <div className="group bg-white dark:bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-100 dark:border-border">
            <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-muted">
                <img
                    src="/bike.jpg"
                    alt={name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.nextElementSibling
                        if (fallback instanceof HTMLElement) {
                            fallback.classList.remove('hidden')
                        }
                    }}
                />
                <div className="absolute inset-0 hidden flex items-center justify-center bg-slate-100 dark:bg-muted">
                    <Bike className="size-24 text-slate-300 dark:text-muted-foreground/50" />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                    {bike.brand}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-foreground">
                        {name}
                    </h3>
                </div>

                <p className="text-slate-500 dark:text-muted-foreground text-sm mb-6 line-clamp-2">
                    Krāsa: {colorToLatvian(bike.color)}
                    {bike.frame_size ? ` • Rāmis: ${bike.frame_size}` : ''}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6 border-t border-slate-50 dark:border-border pt-4">
                    <div className="text-center">
                        <span className="block text-[10px] uppercase text-slate-400 dark:text-muted-foreground font-bold">
                            Krāsa
                        </span>
                        <span className="text-xs font-semibold">{colorToLatvian(bike.color)}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] uppercase text-slate-400 dark:text-muted-foreground font-bold">
                            Rāmis
                        </span>
                        <span className="text-xs font-semibold">
                            {bike.frame_size ?? '—'}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={onReserve}
                    disabled={isButtonDisabled}
                    variant={bike.available === false ? 'destructive' : 'default'}
                    className="mt-auto w-full py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-indigo-200 dark:hover:shadow-primary/20"
                >
                    {buttonContent()}
                </Button>
            </div>
        </div>
    )
}
