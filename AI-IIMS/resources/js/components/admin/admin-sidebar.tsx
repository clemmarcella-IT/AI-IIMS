import {
    Activity,
    BarChart3,
    BookOpen,
    ClipboardList,
    FileText,
    FlaskConical,
    Microscope,
    LayoutDashboard,
    School,
    Users,
} from 'lucide-react';
import type { NavItem } from '@/types';

export const adminSidebarItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Students',
        href: '/admin/students',
        icon: School,
    },
    {
        title: 'Teachers',
        href: '/admin/teachers',
        icon: Users,
    },
    {
        title: 'Lessons',
        href: '/admin/lessons',
        icon: BookOpen,
    },
    {
        title: 'Tests',
        href: '/admin/tests',
        icon: ClipboardList,
    },
    {
        title: 'Surveys',
        href: '/admin/surveys',
        icon: FileText,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: FlaskConical,
    },
    {
        title: 'Instruments',
        href: '/admin/instruments',
        icon: Microscope,
    },
    {
        title: 'Engagement',
        href: '/admin/engagement',
        icon: Activity,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: BarChart3,
    },
];
