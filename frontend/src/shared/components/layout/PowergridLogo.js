import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import logoUrl from '../../../../assets/logo.png';
export default function PowergridLogo({ className = '' }) {
    return (_jsx(Link, { to: "/", className: `inline-flex items-center ${className}`.trim(), "aria-label": "Go to POWERGRID home", children: _jsx("img", { src: logoUrl, alt: "POWERGRID", className: "h-10 w-auto object-contain" }) }));
}
