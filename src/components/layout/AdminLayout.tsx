import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LayoutDashboard,
    Users,
    Building2,
    Crown,
    Percent,
    BarChart3,
    Activity,
    CreditCard,
    Tag,
    MessageSquare,
    Bell,
    Settings,
    LifeBuoy,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Globe,
    PanelLeftClose,
    PanelLeft,
    MapPin,
    Map,
    Navigation,
    BookOpen,
    ShieldCheck,
    KeyRound,
    History,
    Ban,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
}

interface NavItem {
    label: string;
    path: string;
    icon: any;
    badge?: number;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [flaggedReviewsCount, setFlaggedReviewsCount] = useState<number>(0);

    // Dynamic effect to load and count flagged reviews for admin attention
    useEffect(() => {
        try {
            // Count mock reviews that are flagged (our seed data has 1 flagged review initially)
            const mockFlaggedCount = 1;
            const stored = JSON.parse(localStorage.getItem('user_reviews') || '[]');
            const flaggedInStore = stored.filter((r: any) => r.status === 'flagged').length;
            setFlaggedReviewsCount(mockFlaggedCount + flaggedInStore);
        } catch {
            setFlaggedReviewsCount(1);
        }
    }, []);

    const navSections: NavSection[] = [
        {
            title: "Asosiy",
            items: [
                { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
                { label: "Landing Page", path: "/landing", icon: Globe },
            ],
        },
        {
            title: "Boshqaruv",
            items: [
                { label: "Foydalanuvchilar", path: "/admin/users", icon: Users },
                { label: "Bizneslar", path: "/admin/businesses", icon: Building2 },
                { label: "Bloklangan bizneslar", path: "/admin/blocked-businesses", icon: Ban },
                { label: "Xizmat turlari", path: "/admin/services", icon: Briefcase, badge: 3 },
            ],
        },
        {
            title: "Moliya",
            items: [
                { label: "Obunalar", path: "/admin/subscriptions", icon: Crown },
                { label: "To'lovlar Tarixi", path: "/admin/payments", icon: CreditCard },
                { label: "Tangalar Tarixi", path: "/admin/coins", icon: Activity },
            ],
        },
        {
            title: "Marketing",
            items: [
                { label: "Aksiyalar", path: "/admin/promotions", icon: Percent },
                { label: "Promokodlar", path: "/admin/promocodes", icon: BarChart3 },
                { label: "Promo Foydalanish", path: "/admin/promo-usage", icon: Tag },
            ],
        },
        {
            title: "Boshqa",
            items: [
                { label: "Sharhlar", path: "/admin/reviews", icon: MessageSquare, badge: flaggedReviewsCount },
                { label: "Yangiliklar", path: "/admin/news", icon: Bell },
            ],
        },
        {
            title: "Spravochniklar",
            items: [
                { label: "Viloyatlar", path: "/admin/regions", icon: Map },
                { label: "Tumanlar", path: "/admin/districts", icon: MapPin },
                { label: "Ko'chalar", path: "/admin/streets", icon: Navigation },
                { label: "Kategoriyalar", path: "/admin/categories", icon: BookOpen },
            ],
        },
        {
            title: "Administratsiya",
            items: [
                { label: "Rollar va huquqlar", path: "/admin/permissions", icon: ShieldCheck },
                { label: "Kirish tarixi", path: "/admin/login-history", icon: History },
            ],
        },
    ];

    const bottomItems: NavItem[] = [
        { label: "Sozlamalar", path: "/profile/settings", icon: Settings },
        { label: "Yordam", path: "/profile/help", icon: HelpCircle },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    const isActive = (path: string) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
                    hidden md:flex flex-col
                    ${collapsed ? 'w-[72px]' : 'w-[260px]'}
                    bg-white dark:bg-gray-900
                    border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 ease-in-out
                    shrink-0
                `}
            >
                {/* Logo / Brand */}
                <div className={`
                    h-16 flex items-center border-b border-gray-100 dark:border-gray-800
                    ${collapsed ? 'justify-center px-2' : 'px-5'}
                `}>
                    {!collapsed && (
                        <Link to="/admin" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">BF</span>
                            </div>
                            <div>
                                <span className="text-[15px] font-bold text-foreground">BeautyFind</span>
                                <span className="block text-[10px] text-muted-foreground -mt-0.5 font-medium uppercase tracking-wider">Admin Panel</span>
                            </div>
                        </Link>
                    )}
                    {collapsed && (
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">BF</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            {!collapsed && (
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            title={collapsed ? item.label : undefined}
                                            className={`
                                                group flex items-center gap-3 rounded-lg text-[13px] font-medium
                                                transition-all duration-200
                                                ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'}
                                                ${active
                                                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-foreground'
                                                }
                                            `}
                                        >
                                            <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1">{item.label}</span>
                                                    {item.badge && item.badge > 0 && (
                                                        <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            {collapsed && item.badge && item.badge > 0 && (
                                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 space-y-0.5">
                    {bottomItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={collapsed ? item.label : undefined}
                                className={`
                                    group flex items-center gap-3 rounded-lg text-[13px] font-medium
                                    transition-all duration-200
                                    ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2'}
                                    ${active
                                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-foreground'
                                    }
                                `}
                            >
                                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-violet-600' : 'text-gray-400'}`} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                    
                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center gap-3 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-foreground transition-all duration-200 px-3 py-2"
                        style={collapsed ? { justifyContent: 'center', padding: '10px 8px' } : undefined}
                    >
                        {collapsed ? <PanelLeft className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
                        {!collapsed && <span>Yig'ish</span>}
                    </button>
                </div>

                {/* User Info */}
                <div className={`
                    border-t border-gray-100 dark:border-gray-800 p-3
                    ${collapsed ? 'flex justify-center' : ''}
                `}>
                    {!collapsed ? (
                        <div className="flex items-center gap-3 px-2">
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src="/avatars/01.png" />
                                <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-semibold">
                                    {profile?.full_name?.charAt(0) || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {profile?.full_name || "Admin"}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                    {user?.email || "admin@beautyfind.uz"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0"
                                onClick={handleSignOut}
                                title="Chiqish"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={handleSignOut}
                            title="Chiqish"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
