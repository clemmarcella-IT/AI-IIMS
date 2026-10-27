import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    ClipboardCheck,
    FileText,
    LayoutGrid,
    Lightbulb,
    ListChecks,
    Users,
} from 'lucide-react';
import { adminSidebarItems } from '@/components/admin/admin-sidebar';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { dashboard as studentDashboard } from '@/routes/student';
import { index as studentLessons } from '@/routes/student/lessons';
import { dashboard as teacherDashboard } from '@/routes/teacher';
import type { NavItem } from '@/types';

const defaultMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const teacherMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: teacherDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: '/teacher/students',
        icon: Users,
    },
    {
        title: 'Lessons',
        href: '/teacher/lessons',
        icon: BookOpen,
    },
    {
        title: 'Scores',
        href: '/teacher/results',
        icon: BarChart3,
    },
    {
        title: 'Tests',
        href: '/teacher/tests',
        icon: ListChecks,
    },
    {
        title: 'Grades',
        href: '/teacher/quarterly-grades',
        icon: FileText,
    },
    {
        title: 'Submissions',
        href: '/teacher/activities',
        icon: ClipboardCheck,
    },
];

const studentLearningNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: studentDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Lessons',
        href: studentLessons(),
        icon: BookOpen,
    },
    {
        title: 'Activities',
        href: '/student/activities',
        icon: ClipboardCheck,
    },
];

const studentInsightNavItems: NavItem[] = [
    {
        title: 'Progress',
        href: '/student/progress',
        icon: BarChart3,
    },
    {
        title: 'Recommendations',
        href: '/student/recommendations',
        icon: Lightbulb,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { url } = usePage();
    const isStudent = url.startsWith('/student');
    const mainNavItems = url.startsWith('/admin')
        ? adminSidebarItems
        : url.startsWith('/teacher')
          ? teacherMainNavItems
          : isStudent
            ? studentLearningNavItems
            : defaultMainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={mainNavItems}
                    label={isStudent ? 'Learn' : 'Platform'}
                />
                {isStudent && (
                    <NavMain items={studentInsightNavItems} label="Insights" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
