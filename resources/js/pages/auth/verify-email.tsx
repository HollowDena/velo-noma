// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Apstipriniet e-pastu"
            description="Lūdzu, apstipriniet e-pasta adresi, noklikšķinot uz saites, ko tikko nosūtījām."
        >
            <Head title="E-pasta apstiprinājums" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Jauna apstiprinājuma saite ir nosūtīta uz reģistrācijas laikā norādīto e-pasta adresi.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Nosūtīt apstiprinājuma e-pastu vēlreiz
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Iziet
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
