import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 4L37 12L20 20L3 12L20 4ZM8 15.2L18 19.8V28.3L20 29.2L22 28.3V19.8L32 15.2V23.5L20 29L8 23.5V15.2Z"
            />
        </svg>
    );
}
