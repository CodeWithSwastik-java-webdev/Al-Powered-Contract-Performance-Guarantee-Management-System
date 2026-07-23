export const HOME_BY_ROLE = {
    ADMIN: '/admin/dashboard',
    PROJECT_ENGINEER: '/engineer/dashboard',
    FINANCE_OFFICER: '/finance/dashboard',
    CONTRACT_MANAGER: '/contracts/dashboard',
    AUDITOR: '/audit/dashboard',
    CONTRACTOR: '/contractor/dashboard',
    VIEWER: '/viewer/dashboard',
};
export const NAV_BY_ROLE = {
    ADMIN: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
        { label: 'Registration Requests', path: '/admin/registrations', icon: 'UserPlus' },
        { label: 'User Management', path: '/admin/users', icon: 'Users' },
        { label: 'Contracts', path: '/contracts', icon: 'FileText' },
        { label: 'Contractors', path: '/contractors', icon: 'Building2' },
        { label: 'CPG Management', path: '/cpgs', icon: 'Shield' },
        { label: 'Documents', path: '/documents', icon: 'Folder' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
        { label: 'Audit Logs', path: '/audit/logs', icon: 'ClipboardList' },
        { label: 'Settings', path: '/settings', icon: 'Settings' },
    ],
    PROJECT_ENGINEER: [
        { label: 'Dashboard', path: '/engineer/dashboard', icon: 'LayoutDashboard' },
        { label: 'Projects', path: '/projects', icon: 'Briefcase' },
        { label: 'Contracts', path: '/contracts', icon: 'FileText' },
        { label: 'CPG', path: '/cpgs', icon: 'Shield' },
        { label: 'Documents', path: '/documents', icon: 'Folder' },
        { label: 'Notifications', path: '/notifications', icon: 'Bell' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ],
    FINANCE_OFFICER: [
        { label: 'Dashboard', path: '/finance/dashboard', icon: 'LayoutDashboard' },
        { label: 'Finance', path: '/finance', icon: 'DollarSign' },
        { label: 'CPG', path: '/cpgs', icon: 'Shield' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
        { label: 'Documents', path: '/documents', icon: 'Folder' },
        { label: 'Notifications', path: '/notifications', icon: 'Bell' },
    ],
    CONTRACT_MANAGER: [
        { label: 'Dashboard', path: '/contracts/dashboard', icon: 'LayoutDashboard' },
        { label: 'Contracts', path: '/contracts', icon: 'FileText' },
        { label: 'Contractors', path: '/contractors', icon: 'Building2' },
        { label: 'CPG', path: '/cpgs', icon: 'Shield' },
        { label: 'Documents', path: '/documents', icon: 'Folder' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
    ],
    AUDITOR: [
        { label: 'Dashboard', path: '/audit/dashboard', icon: 'LayoutDashboard' },
        { label: 'Audit Logs', path: '/audit/logs', icon: 'ClipboardList' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
        { label: 'Documents', path: '/documents', icon: 'Folder' },
    ],
    CONTRACTOR: [
        { label: 'Dashboard', path: '/contractor/dashboard', icon: 'LayoutDashboard' },
        { label: 'My Contracts', path: '/contractor/contracts', icon: 'FileText' },
        { label: 'My CPG', path: '/contractor/cpgs', icon: 'Shield' },
        { label: 'My Documents', path: '/contractor/documents', icon: 'Folder' },
        { label: 'Notifications', path: '/notifications', icon: 'Bell' },
        { label: 'Profile', path: '/profile', icon: 'User' },
        { label: 'Support', path: '/support', icon: 'HelpCircle' },
    ],
    VIEWER: [
        { label: 'Dashboard', path: '/viewer/dashboard', icon: 'LayoutDashboard' },
        { label: 'Reports', path: '/reports', icon: 'BarChart3' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ],
};
export const ROLE_ROUTE_PREFIXES = {
    '/admin': ['ADMIN'],
    '/engineer': ['PROJECT_ENGINEER'],
    '/finance': ['FINANCE_OFFICER'],
    '/contracts/dashboard': ['CONTRACT_MANAGER'],
    '/audit': ['AUDITOR'],
    '/contractor': ['CONTRACTOR'],
    '/viewer': ['VIEWER'],
};
export function canAccessRoute(role, path) {
    // Check role-specific prefixes
    for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTE_PREFIXES)) {
        if (path.startsWith(prefix)) {
            return allowedRoles.includes(role);
        }
    }
    // Shared routes - check if role has this in their nav
    const navItems = NAV_BY_ROLE[role] || [];
    const basePath = '/' + path.split('/').filter(Boolean)[0];
    return navItems.some(item => item.path === basePath || item.path === path);
}
export function getHomeForRole(role) {
    return HOME_BY_ROLE[role];
}
