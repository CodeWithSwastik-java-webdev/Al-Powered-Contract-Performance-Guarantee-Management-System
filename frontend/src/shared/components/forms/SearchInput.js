import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
export function SearchInput({ value, onChange, debounceMs = 300, className, ...props }) {
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [localValue, onChange, value, debounceMs]);
    return (_jsxs("div", { className: `relative ${className ?? ''}`, children: [_jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3", children: _jsx(Search, { className: "h-4 w-4 text-neutral-400" }) }), _jsx("input", { type: "text", value: localValue, onChange: (e) => setLocalValue(e.target.value), className: "block w-full rounded-2xl border border-neutral-300 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-50", ...props }), localValue && (_jsx("button", { onClick: () => setLocalValue(''), className: "absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600", children: _jsx(X, { className: "h-4 w-4" }) }))] }));
}
