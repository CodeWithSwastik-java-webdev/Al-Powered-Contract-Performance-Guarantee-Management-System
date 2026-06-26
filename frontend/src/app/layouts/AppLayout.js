import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Sidebar from '../../shared/components/layout/Sidebar';
import TopNav from '../../shared/components/layout/TopNav';
export default function AppLayout() {
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAF9] text-neutral-900", children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex min-h-screen flex-1 flex-col", children: [_jsx(TopNav, {}), _jsx("main", { className: "flex-1 px-6 py-6 xl:px-10 xl:py-8", children: _jsx(Outlet, {}) })] })] }) }));
}
