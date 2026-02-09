import { Link, usePage } from '@inertiajs/react';
import { Bike, ClipboardList, LogIn, Menu, UserPlus } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { home, login, register } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const navLinkClass = (active: boolean) =>
    cn(
        'font-semibold transition-colors hover:text-indigo-600',
        active ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400',
    );

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl } = useCurrentUrl();

    const isHome = isCurrentUrl('/') || isCurrentUrl(home().url);
    const isAdminRentals = isCurrentUrl('/admin/rentals');

    const profileOrLogin = (
        <>
            {auth.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="size-10 rounded-full p-1"
                        >
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-slate-100 px-4 font-medium hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                            Ienākt
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={login()}
                                prefetch
                                className="cursor-pointer"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Ienākt
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={register()}
                                prefetch
                                className="cursor-pointer"
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Reģistrēties
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-slate-200 dark:border-border">
                <div className="container mx-auto flex h-20 items-center justify-between px-4">
                    <Link
                        href={home()}
                        prefetch
                        className="flex items-center gap-2 group"
                    >
                        <div className="flex items-center justify-center rounded-lg bg-indigo-600 p-2 transition-transform group-hover:rotate-12">
                            <Bike className="size-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-foreground">
                            VELO NOMA
                        </span>
                    </Link>

                    {/* Logo left, everything else right */}
                    <div className="flex items-center justify-end gap-4 lg:gap-6">
                        <div className="hidden items-center gap-6 lg:flex">
                            <Link
                                href={home()}
                                className={cn(
                                    'flex items-center gap-2',
                                    navLinkClass(isHome),
                                )}
                            >
                                <Bike className="size-4" />
                                Velosipēdu noma
                            </Link>
                            {auth.user?.is_admin && (
                                <>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-border" />
                                    <Link
                                        href="/admin/rentals"
                                        className={navLinkClass(isAdminRentals)}
                                    >
                                        Admin
                                    </Link>
                                </>
                            )}
                            <div className="h-8 w-px bg-slate-200 dark:bg-border" />
                        </div>
                        <div className="flex items-center gap-2">
                            {profileOrLogin}
                            <div className="lg:hidden">
                                <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="size-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="flex w-64 flex-col gap-4"
                                >
                                    <SheetHeader>
                                        <SheetTitle className="sr-only">
                                            Izvēlne
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <Link
                                            href={home()}
                                            className={cn(
                                                'flex items-center gap-2 rounded-lg px-3 py-2 font-medium',
                                                isHome &&
                                                    'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50',
                                            )}
                                        >
                                            <Bike className="size-4" />
                                            Velosipēdu noma
                                        </Link>
                                        {auth.user?.is_admin && (
                                            <Link
                                                href="/admin/rentals"
                                                className={cn(
                                                    'flex items-center gap-2 rounded-lg px-3 py-2 font-medium',
                                                    isAdminRentals &&
                                                        'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50',
                                                )}
                                            >
                                                <ClipboardList className="size-4" />
                                                Admin
                                            </Link>
                                        )}
                                    </div>
                                </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {breadcrumbs.length > 1 && (
                <div className="border-b border-slate-200 dark:border-border">
                    <div className="container mx-auto flex h-12 items-center px-4 text-slate-500 dark:text-muted-foreground">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
