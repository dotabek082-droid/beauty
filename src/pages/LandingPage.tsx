
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
    Sparkles, Crown, Gift, Calendar, Star, Shield,
    CheckCircle, Users, Building2, Smartphone, Heart,
    Clock, MapPin, Phone, Mail, Instagram, Send,
    ChevronDown, Scissors, Car, Stethoscope, Plane,
    Utensils, Dumbbell, Home, Wrench, GraduationCap,
    Camera, Music, Palette, Download, Apple, Play,
    Verified, ArrowRight, Info
} from "lucide-react";

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState<"client" | "business">("client");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "6months" | "yearly">("monthly");
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const stats = [
        { value: "3000+", label: "Xizmatlar", icon: Building2, color: "text-purple-600" },
        { value: "50K+", label: "Yuklab olish", icon: Download, color: "text-blue-600" },
        { value: "100K+", label: "Bronlar", icon: Calendar, color: "text-green-600" },
        { value: "4.9★", label: "Reyting", icon: Star, color: "text-amber-600" }
    ];

    const categories = [
        { icon: Scissors, name: "Go'zallik", color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
        { icon: Stethoscope, name: "Sog'liq", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50" },
        { icon: Car, name: "Avto", color: "from-blue-400 to-cyan-500", bg: "bg-blue-50" },
        { icon: Plane, name: "Sayohat", color: "from-purple-400 to-indigo-500", bg: "bg-purple-50" },
        { icon: Utensils, name: "Restoran", color: "from-orange-400 to-amber-500", bg: "bg-orange-50" },
        { icon: Dumbbell, name: "Sport", color: "from-red-400 to-rose-500", bg: "bg-red-50" },
        { icon: Home, name: "Uy xizmatlari", color: "from-slate-400 to-slate-600", bg: "bg-slate-50" },
        { icon: Wrench, name: "Ta'mirlash", color: "from-amber-400 to-yellow-500", bg: "bg-amber-50" },
        { icon: GraduationCap, name: "Ta'lim", color: "from-indigo-400 to-purple-500", bg: "bg-indigo-50" },
        { icon: Camera, name: "Foto/Video", color: "from-pink-400 to-purple-500", bg: "bg-pink-50" },
        { icon: Music, name: "Ko'ngil ochar", color: "from-violet-400 to-purple-500", bg: "bg-violet-50" },
        { icon: Palette, name: "San'at", color: "from-teal-400 to-cyan-500", bg: "bg-teal-50" },
    ];

    const features = [
        { icon: Gift, title: "Chegirmalar", description: "Har kuni yangi aksiyalar", color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
        { icon: Calendar, title: "Oson Bron", description: "Bir kliklash bilan", color: "from-blue-400 to-cyan-500", bg: "bg-blue-50" },
        { icon: Crown, title: "Premium", description: "Eksklyuziv imkoniyatlar", color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
        { icon: Shield, title: "Ishonchli", description: "Tasdiqlangan xizmatlar", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50" }
    ];

    const appFeatures = [
        "Barcha xizmatlarni bir ilovada",
        "GPS orqali yaqin xizmatlar",
        "Onlayn to'lov va bron",
        "Push-bildirishnomalar",
        "QR kod bilan tasdiqlash",
        "Oflayn sevimlilar"
    ];

    const trustBadges = [
        { text: "500+ Salonlar", color: "bg-pink-100 text-pink-700" },
        { text: "300+ Klinikalar", color: "bg-emerald-100 text-emerald-700" },
        { text: "400+ Avtoservislar", color: "bg-blue-100 text-blue-700" },
        { text: "200+ Agentliklar", color: "bg-purple-100 text-purple-700" },
        { text: "600+ Restoranlar", color: "bg-orange-100 text-orange-700" },
        { text: "250+ Sport zallar", color: "bg-red-100 text-red-700" }
    ];

    const testimonials = [
        { name: "Nodira A.", role: "Doimiy foydalanuvchi", text: "Ilova juda qulay! Bir necha soniyada kerakli xizmatni topdim.", avatar: "N", color: "from-pink-400 to-rose-500" },
        { name: "Sardor K.", role: "Avtoservis egasi", text: "Yangi mijozlar soni 3 barobar oshdi!", avatar: "S", color: "from-blue-400 to-cyan-500" },
        { name: "Dilnoza R.", role: "Gold obunachi", text: "Chegirmalar va keshbek juda foydali.", avatar: "D", color: "from-purple-400 to-indigo-500" }
    ];

    const clientPlans = [
        { name: "Standard", price: 0, period: "", features: ["Barcha kategoriyalar", "Bron qilish", "Sharhlar", "Aksiyalar"], recommended: false, color: "from-slate-100 to-slate-200", desc: "Bepul foydalanish uchun" },
        { name: "Gold", price: 50000, period: "/oy", features: ["5% keshbek", "1000 tanga", "Ustuvor yordam", "Chegirmalar", "Bepul bekor"], recommended: true, color: "from-amber-400 to-orange-500", desc: "Eng mashhur reja" },
        { name: "Platinum", price: 120000, period: "/oy", features: ["10% keshbek", "3000 tanga", "VIP xizmat", "Eksklyuziv", "Shaxsiy menejer"], recommended: false, color: "from-slate-600 to-slate-800", desc: "Maksimal imkoniyatlar" }
    ];

    const businessPlans = [
        { name: "Bepul", price: 0, period: "", features: ["3 aksiya", "Asosiy statistika", "1 filial", "Standart ko'rinish"], recommended: false, color: "from-slate-100 to-slate-200", desc: "Startaplar uchun" },
        { name: "PRO", price: 150000, period: "/oy", features: ["10 aksiya", "Kengaytirilgan statistika", "3 filial", "SMS", "Yuqori ko'rinish"], recommended: true, color: "from-purple-500 to-indigo-600", desc: "O'sib borayotgan biznes" },
        { name: "ELITE", price: 400000, period: "/oy", features: ["30 aksiya", "Cheksiz statistika", "Cheksiz filiallar", "Verified", "24/7 yordam"], recommended: false, color: "from-slate-600 to-slate-800", desc: "Katta tarmoqlar uchun" }
    ];

    const plans = activeTab === "client" ? clientPlans : businessPlans;

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Colorful Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-40"></div>
            </div>

            {/* Floating Navigation */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                            UzService
                        </Link>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                            <a href="#categories" className="hover:text-purple-600 transition-colors">Kategoriyalar</a>
                            <a href="#app" className="hover:text-purple-600 transition-colors">Ilova</a>
                            <a href="#pricing" className="hover:text-purple-600 transition-colors">Narxlar</a>
                        </div>
                        <a href="#download">
                            <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-200">
                                <Download className="w-4 h-4 mr-2" />
                                Yuklab olish
                            </Button>
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            {/* Live Badge */}
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-5 py-2 mb-8">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-purple-700">50,000+ aktiv foydalanuvchi</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-slate-900">
                                Barcha
                                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                                    xizmatlar
                                </span>
                                cho'ntagingizda
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                                Go'zallik, sog'liq, avto, sayohat va boshqa <span className="text-purple-600 font-semibold">12+ kategoriya</span>dagi xizmatlarni mobil ilovamizda toping!
                            </p>

                            {/* App Store Buttons */}
                            <div id="download" className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="group">
                                    <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 hover:-translate-y-1">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                                        </svg>
                                        <div className="text-left">
                                            <div className="text-xs opacity-70 uppercase tracking-wide">Yuklab olish</div>
                                            <div className="text-lg font-bold">Google Play</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="group">
                                    <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 hover:-translate-y-1">
                                        <Apple className="w-8 h-8" />
                                        <div className="text-left">
                                            <div className="text-xs opacity-70 uppercase tracking-wide">Yuklab olish</div>
                                            <div className="text-lg font-bold">App Store</div>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-125 transition-transform`} />
                                            <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                                        </div>
                                        <span className="text-slate-500 text-sm">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Phone Mockup */}
                        <div className="relative hidden lg:flex justify-center" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
                            <div className="relative">
                                {/* Decorative Circles */}
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-xl"></div>

                                {/* Phone */}
                                <div className="relative w-80 h-[640px] bg-slate-900 rounded-[3.5rem] p-3 shadow-2xl shadow-purple-200/50">
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-[3rem] overflow-hidden relative">
                                        {/* Notch */}
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-900 rounded-full"></div>

                                        {/* Screen */}
                                        <div className="pt-14 px-5 h-full">
                                            <div className="text-white text-center mb-4">
                                                <h3 className="text-lg font-bold">UzService</h3>
                                                <p className="text-white/70 text-xs">Barcha xizmatlar</p>
                                            </div>

                                            {/* Category Grid */}
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                {categories.slice(0, 6).map((cat, i) => (
                                                    <div key={i} className="bg-white/20 backdrop-blur rounded-xl p-2.5 text-center">
                                                        <cat.icon className="w-5 h-5 text-white mx-auto mb-1" />
                                                        <span className="text-white text-[10px]">{cat.name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Search */}
                                            <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-3 flex items-center gap-2 mb-4">
                                                <MapPin className="w-4 h-4 text-white/70" />
                                                <span className="text-white/70 text-sm">Xizmat qidirish...</span>
                                            </div>

                                            {/* Card */}
                                            <div className="bg-white rounded-2xl p-4 shadow-lg">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                                                        <Scissors className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-slate-900 text-sm font-semibold">Lola Salon</h4>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            <span className="text-slate-500 text-xs">4.9 • 2.5 km</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge className="bg-green-100 text-green-700 border-0 text-[10px]">-30%</Badge>
                                                    <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px]">Premium</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -right-16 top-24 bg-white rounded-2xl shadow-xl shadow-purple-100 p-4 animate-float border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                            <Star className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-slate-900 font-bold text-lg">4.9</div>
                                            <div className="text-slate-500 text-sm">Reyting</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -left-16 bottom-40 bg-white rounded-2xl shadow-xl shadow-blue-100 p-4 animate-float border border-slate-100" style={{ animationDelay: "1s" }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-slate-900 font-bold text-lg">50K+</div>
                                            <div className="text-slate-500 text-sm">Yuklab olish</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute right-0 bottom-16 bg-white rounded-2xl shadow-xl shadow-pink-100 p-4 animate-float border border-slate-100" style={{ animationDelay: "0.5s" }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                                            <Verified className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-slate-900 font-bold text-lg">3000+</div>
                                            <div className="text-slate-500 text-sm">Xizmatlar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-8 h-12 rounded-full border-2 border-slate-300 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-8 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-y border-purple-100 overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...trustBadges, ...trustBadges].map((badge, i) => (
                        <div key={i} className={`flex items-center gap-2 mx-4 px-4 py-2 rounded-full ${badge.color}`}>
                            <Verified className="w-4 h-4" />
                            <span className="font-medium text-sm">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section id="categories" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            12+ Kategoriya
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                            Barcha <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">xizmat turlari</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Ilovani yuklab oling va 3000+ xizmatni kashf eting
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((category, i) => (
                            <a key={i} href="#download" className="group">
                                <Card className={`${category.bg} border-0 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full`}>
                                    <CardContent className="p-6 text-center">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}>
                                            <category.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="font-bold text-slate-800">{category.name}</h3>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a href="#download">
                            <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-200">
                                <Download className="w-5 h-5 mr-2" />
                                Ilovani yuklab olish
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* App Features */}
            <section id="app" className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">
                                <Smartphone className="w-4 h-4 mr-2" />
                                Mobil Ilova
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                Nega <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ilovani</span> yuklab olish kerak?
                            </h2>
                            <p className="text-xl text-slate-600 mb-10">
                                Mobil ilovamiz orqali barcha xizmatlarni tez va oson toping
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {appFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold shadow-lg shadow-slate-300">
                                        <Play className="w-5 h-5 mr-2 fill-current" />
                                        Google Play
                                    </Button>
                                </a>
                                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="rounded-xl border-slate-300 hover:bg-slate-50 font-semibold">
                                        <Apple className="w-5 h-5 mr-2" />
                                        App Store
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, i) => (
                                <Card key={i} className={`${feature.bg} border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
                                    <CardContent className="p-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="bg-white/20 text-white border-white/30 mb-4">
                            <Clock className="w-4 h-4 mr-2" />
                            3 Qadam
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold">Qanday ishlaydi?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Yuklab oling", desc: "Google Play yoki App Store'dan bepul", icon: Download },
                            { step: "02", title: "Ro'yxatdan o'ting", desc: "Telefon raqamingiz bilan", icon: Smartphone },
                            { step: "03", title: "Bron qiling", desc: "Xizmat tanlang va vaqt belgilang", icon: Calendar }
                        ].map((item, i) => (
                            <div key={i} className="relative group text-center">
                                <div className="text-8xl font-bold text-white/10 absolute -top-4 left-1/2 -translate-x-1/2">{item.step}</div>
                                <div className="relative z-10 bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition-all">
                                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                                        <item.icon className="w-10 h-10 text-purple-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-white/80">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4 px-3 py-1">
                            <Crown className="w-4 h-4 mr-2" />
                            Obuna Rejalari
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">O'zingizga mos reja</h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Yangi obunachilar uchun maxsus taklif: Birinchi to'lovga <span className="font-bold text-green-600">10% Chegirma!</span>
                        </p>

                        {/* User Type Toggle */}
                        <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-md border border-slate-200 mb-8">
                            <button
                                onClick={() => setActiveTab("client")}
                                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "client" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                                <Users className="w-4 h-4" />Foydalanuvchilar
                            </button>
                            <button
                                onClick={() => setActiveTab("business")}
                                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "business" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                                <Building2 className="w-4 h-4" />Biznes
                            </button>
                        </div>

                        {/* Billing Cycle Toggle */}
                        <div className="flex justify-center gap-2 mb-12 flex-wrap">
                            {[
                                { id: 'monthly', label: '1 Oy', discount: null },
                                { id: '6months', label: '6 Oy', discount: '-15%' },
                                { id: 'yearly', label: '1 Yil', discount: '-25%' }
                            ].map((cycle) => (
                                <button
                                    key={cycle.id}
                                    onClick={() => setBillingCycle(cycle.id as any)}
                                    className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${billingCycle === cycle.id
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900 ring-offset-2'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {cycle.label}
                                    {cycle.discount && (
                                        <span className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                                            {cycle.discount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, i) => {
                            const isFree = plan.price === 0;

                            // Pricing Calculation Logic
                            let originalPrice = plan.price;
                            let periodLabel = "/oy";
                            let discountRate = 0; // 0% default for monthly

                            if (billingCycle === '6months') {
                                originalPrice = plan.price * 6;
                                periodLabel = "/6 oy";
                                discountRate = 0.15;
                            } else if (billingCycle === 'yearly') {
                                originalPrice = plan.price * 12;
                                periodLabel = "/yil";
                                discountRate = 0.25;
                            }

                            const discountedPrice = originalPrice * (1 - discountRate);

                            return (
                                <Card key={i} className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 bg-white flex flex-col ${plan.recommended ? "shadow-2xl shadow-purple-200/50 scale-105 border-2 border-purple-500 z-10" : "shadow-lg hover:shadow-xl border border-slate-200"}`}>
                                    {plan.recommended && (
                                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
                                    )}
                                    {plan.recommended && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-white" /> Tavsiya
                                        </div>
                                    )}

                                    <CardContent className="p-8 flex-1 flex flex-col">
                                        <div className="mb-6">
                                            <h3 className={`font-bold text-2xl mb-2 ${plan.recommended ? 'text-purple-700' : 'text-slate-900'}`}>{plan.name}</h3>
                                            <p className="text-sm text-slate-500 h-10">{plan.desc || "Barcha asosiy imkoniyatlar"}</p>
                                        </div>

                                        <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            {isFree ? (
                                                <div className="text-center py-2">
                                                    <span className="text-4xl font-bold text-slate-900">Bepul</span>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    {discountRate > 0 && (
                                                        <div className="text-sm text-slate-400 line-through mb-1">
                                                            {new Intl.NumberFormat('uz-UZ').format(originalPrice)} so'm
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-center gap-1 mb-2">
                                                        <span className="text-3xl font-bold text-slate-900">
                                                            {new Intl.NumberFormat('uz-UZ').format(discountedPrice)}
                                                        </span>
                                                        <span className="text-sm font-medium text-slate-500 self-end mb-1.5">
                                                            so'm{periodLabel}
                                                        </span>
                                                    </div>
                                                    {discountRate > 0 && (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs py-0.5">
                                                            -{discountRate * 100}% Chegirma
                                                        </Badge>
                                                    )}
                                                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                                                        {discountRate > 0
                                                            ? <>Keyingi to'lov: <span className="font-semibold text-slate-700">{new Intl.NumberFormat('uz-UZ').format(originalPrice)} so'm</span> {periodLabel}</>
                                                            : <>Oylik to'lov, istalgan vaqtda bekor qilish mumkin</>
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <ul className="space-y-4 mb-8 flex-1">
                                            {plan.features.map((f, j) => (
                                                <li key={j} className="flex items-start gap-3 text-slate-600 text-sm group">
                                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.recommended ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="group-hover:text-slate-900 transition-colors">{f}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <a href="#download" className="mt-auto">
                                            <Button
                                                className={`w-full rounded-xl py-6 font-bold text-base transition-all ${plan.recommended
                                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5"
                                                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                                    }`}
                                            >
                                                {isFree ? "Boshlash" : "Obuna bo'lish"}
                                                <ArrowRight className="w-5 h-5 ml-2 opacity-90" />
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-12 text-center text-sm text-slate-500 max-w-2xl mx-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <Info className="w-4 h-4 inline mr-2 text-blue-500" />
                        Obuna shartlari: {billingCycle === 'monthly' ? "Oylik to'lov, istalgan vaqtda bekor qilish mumkin." : `Birinchi to'lov uchun ${billingCycle === '6months' ? '15%' : '25%'} chegirma amal qiladi.`} Keyingi davr uchun to'lov to'liq miqdorda ({billingCycle === 'monthly' ? 'oylik' : billingCycle === '6months' ? 'har 6 oyda' : 'yillik'}) yechib olinadi. Istalgan vaqtda bekor qilishingiz mumkin.
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge className="bg-pink-100 text-pink-700 border-pink-200 mb-4">
                            <Heart className="w-4 h-4 mr-2" /> Fikrlar
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Foydalanuvchilar nima deydi?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <Card key={i} className="bg-white border-slate-200 hover:shadow-xl hover:shadow-purple-100 transition-all">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xl`}>{t.avatar}</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.name}</h4>
                                            <p className="text-slate-500 text-sm">{t.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">"{t.text}"</p>
                                    <div className="flex gap-1 mt-4">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl shadow-purple-300">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                        <div className="relative p-12 md:p-16 text-center text-white">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Smartphone className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Hoziroq Boshlang!</h2>
                            <p className="text-xl text-white/90 mb-10 max-w-lg mx-auto">50,000+ foydalanuvchilarga qo'shiling</p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="rounded-xl bg-white text-purple-600 hover:bg-slate-100 font-bold shadow-xl">
                                        <Play className="w-5 h-5 mr-2 fill-current" />Google Play
                                    </Button>
                                </a>
                                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="rounded-xl border-white/50 text-white hover:bg-white/10 font-bold">
                                        <Apple className="w-5 h-5 mr-2" />App Store
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">UzService</h3>
                            <p className="text-slate-500 mb-6 max-w-sm">O'zbekistonning eng katta xizmatlar ilovasi. Barcha turdagi xizmatlarni bir joydan toping.</p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                                    <Send className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Biznes</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link to="/register-business" className="hover:text-white transition-colors">Ro'yxatdan o'tish</Link></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Narxlar</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Aloqa</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +998 71 200 00 00</li>
                                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@uzservice.uz</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm">© 2026 UzService. Barcha huquqlar himoyalangan.</p>
                        <div className="flex gap-6 text-sm">
                            <Link to="/privacy" className="hover:text-white transition-colors">Maxfiylik siyosati</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Foydalanish shartlari</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-marquee { animation: marquee 25s linear infinite; }
            `}</style>
        </div>
    );
};

export default LandingPage;
