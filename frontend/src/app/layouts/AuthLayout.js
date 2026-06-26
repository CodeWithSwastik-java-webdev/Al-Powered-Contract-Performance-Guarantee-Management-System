import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PowergridLogo from '../../shared/components/layout/PowergridLogo';
export default function AuthLayout({ children }) {
    return (_jsx("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(115,171,140,0.18),_transparent_50%),linear-gradient(180deg,#F6FBF8_0%,#F4F6F5_100%)] px-4 py-10", children: _jsxs("div", { className: "mx-auto flex min-h-[calc(100vh-80px)] max-w-2xl flex-col justify-center gap-8", children: [_jsx("div", { className: "flex justify-center", children: _jsx(PowergridLogo, { className: "h-12" }) }), _jsx("div", { className: "rounded-[32px] border border-white/70 bg-white/85 p-10 shadow-surface backdrop-blur-xl", children: children })] }) }));
}
