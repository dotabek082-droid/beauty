import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Building2, Percent, MessageSquare, LogOut, User, Settings, LayoutDashboard, BarChart3, Activity, LifeBuoy, HelpCircle, Crown, Globe, Bell, CreditCard, Tag } from "lucide-react";

const DesktopNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile, isRole, signOut } = useAuth();
    const isAdmin = isRole("admin");

    const adminLinks = [
        { label: "Landing Page", path: "/landing", icon: Globe },
        { label: "Admin Dashboard", path: "/admin", icon: LayoutDashboard },
        { label: "Foydalanuvchilar", path: "/admin/users", icon: Users },
        { label: "Bizneslar", path: "/admin/businesses", icon: Building2 },
        { label: "Obunalar", path: "/admin/subscriptions", icon: Crown },
        { label: "Aksiyalar", path: "/admin/promotions", icon: Percent },
        { label: "Promokodlar", path: "/admin/promocodes", icon: BarChart3 },
        { label: "Tangalar Tarixi", path: "/admin/coins", icon: Activity },
        { label: "To'lovlar Tarixi", path: "/admin/payments", icon: CreditCard },
        { label: "Promokod Foydalanish", path: "/admin/promo-usage", icon: Tag },
        { label: "Sharhlar", path: "/admin/reviews", icon: MessageSquare },
        { label: "Yangiliklar", path: "/admin/news", icon: Bell },
        { label: "Sozlamalar", path: "/profile/settings", icon: Settings },
        { label: "Qo'llab-quvvatlash", path: "/profile/support", icon: LifeBuoy },
        { label: "Yordam", path: "/profile/help", icon: HelpCircle },
    ];

    const userLinks = [
        { label: "Bosh sahifa", path: "/", icon: Home },
        { label: "Qidirish", path: "/search", icon: null },
        { label: "Aksiyalarim", path: "/my-registrations", icon: null },
        { label: "Sevimlilar", path: "/favorites", icon: null },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    if (!user || !isAdmin) return null;

    return (
        <header className="hidden md:flex h-16 items-center justify-between border-b bg-white px-6 sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <Link to="/" className="text-xl font-bold text-primary">
                    BeautyFind
                </Link>

                <nav className="flex items-center gap-4">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path
                                ? "text-primary"
                                : "text-muted-foreground"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {profile?.full_name || user.email}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                    <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate("/profile")}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/profile/settings")}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Sozlamalar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:bg-red-50 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Chiqish</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default DesktopNav;
