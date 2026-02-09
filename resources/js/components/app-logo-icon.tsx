import type { SVGAttributes } from 'react';
import { Bike } from 'lucide-react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <Bike {...(props as React.ComponentProps<typeof Bike>)} />;
}
