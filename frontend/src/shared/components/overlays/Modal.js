import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/classnames';
export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
    const modalRef = useRef(null);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6", children: [_jsx("div", { className: "fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { ref: modalRef, className: cn('relative flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:max-h-[calc(100vh-4rem)]', sizeClasses[size]), children: [_jsxs("div", { className: "flex items-center justify-between border-b border-neutral-100 px-6 py-4", children: [_jsx("h2", { className: "text-lg font-semibold text-neutral-900", children: title }), _jsx("button", { onClick: onClose, className: "inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: children }), footer && (_jsx("div", { className: "border-t border-neutral-100 bg-neutral-50/50 px-6 py-4", children: footer }))] })] }));
}
