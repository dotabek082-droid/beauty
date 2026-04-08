
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Lock, Eye, EyeOff, User,
  ChevronRight, ChevronLeft, Shield,
  Sparkles, UserPlus, LogIn, Building2, FileText, X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/business/LocationPicker";
import { BUSINESS_CATEGORIES } from "@/data/businessCategories";
import { REGIONS, getDistrictsByRegion, getStreetsByDistrict } from "@/data/locations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RegisterRequest } from "@/services/authService";
import { cn } from "@/lib/utils";

// ============ Main AuthPage ============
const AuthPage = () => {
  const [mode, setMode] = useState<"choice" | "login" | "register" | "forgot">("choice");
  const [role, setRole] = useState<"client" | "owner">("client");
  const [step, setStep] = useState<1 | 2>(1); // 1 = form, 2 = OTP

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState(""); // only 9 digits after +998
  const [password, setPassword] = useState("");

  // Business specific formulation state
  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [streetId, setStreetId] = useState("");
  const [homeNumber, setHomeNumber] = useState("");
  const [location, setLocation] = useState({ lat: 41.2995, lng: 69.2401 });

  // Format phone digits for display: XX XXX XX XX
  const formatPhoneDisplay = (digits: string) => {
    const d = digits.replace(/\D/g, "").slice(0, 9);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
    if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`;
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setPhoneDigits(digits);
  };

  const fullPhone = `+998${phoneDigits}`;

  // OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpTimer, setOtpTimer] = useState(120);

  // UI state
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, verifyOtp, user } = useAuth();

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [step, otpTimer]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === 2) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  // Redirect if already logged in (but not during OTP verification)
  useEffect(() => {
    if (user && step !== 2) navigate("/");
  }, [user, navigate, step]);

  // Reset errors when mode changes
  useEffect(() => {
    setErrors({});
    setStep(1);
  }, [mode]);

  // ===== OTP handlers =====
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // ===== Validations =====
  const validateRegistration = () => {
    const newErrors: Record<string, string> = {};
    if (role === "client") {
      if (!firstName.trim() || firstName.trim().length < 2) newErrors.firstName = "Ismingizni kiriting (kamida 2 harf)";
      if (!password.trim() || password.length < 6) newErrors.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
    } else {
      if (!businessName.trim() || businessName.trim().length < 2) newErrors.businessName = "Biznes nomini kiriting";
      if (!categoryId) newErrors.category = "Kategoriyani tanlang";
      if (!regionId) newErrors.region = "Viloyatni tanlang";
      if (!districtId) newErrors.district = "Tumanni tanlang";
      if (!password.trim() || password.length < 6) newErrors.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
    }

    if (phoneDigits.length !== 9) newErrors.phone = "Telefon raqam 9 ta raqamdan iborat bo'lishi kerak";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (phoneDigits.length !== 9) newErrors.phone = "Telefon raqam 9 ta raqamdan iborat bo'lishi kerak";
    if (!password.trim() || password.length < 6) newErrors.password = "Parolni to'g'ri kiriting";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Submit handlers =====
  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    
    const result = await signIn(fullPhone, password);
    setLoading(false);

    if (result.success) {
      toast({ title: "Tabriklaymiz! 🎉", description: "Tizimga kirdingiz" });
      navigate("/");
    } else {
      toast({ title: "Xatolik", description: result.error || "Login yoki parol noto'g'ri", variant: "destructive" });
      setErrors({ phone: " ", password: result.error || "Xato" });
    }
  };

  const handleForgotPassword = async () => {
    if (phoneDigits.length !== 9) {
      setErrors({ phone: "Telefon raqamni kiriting" });
      return;
    }
    setLoading(true);
    // Simulate API request for forgotten password
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Muvaffaqiyatli", description: "Yangi parol telefoningizga SMS orqali yuborildi" });
      setMode("login");
    }, 1000);
  };

  const handleRegisterSubmit = async () => {
    if (!validateRegistration()) return;
    setLoading(true);

    const data: RegisterRequest = role === "owner" ? {
      first_name: businessName.trim(), // mapping business name to first_name
      last_name: "",
      phone: fullPhone,
      password: password,
      role: "owner",
      category: categoryId,
      subcategory: subcategoryId,
      business_name: businessName.trim(),
      region_id: parseInt(regionId) || 1,
      district_id: parseInt(districtId) || 1,
      street_id: streetId ? parseInt(streetId) : undefined,
      home: homeNumber.trim(),
      latitude: location.lat,
      longitude: location.lng,
    } : {
      first_name: firstName.trim(),
      last_name: "",
      phone: fullPhone,
      password: password,
      role: "client"
    };

    const result = await signUp(data);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setOtpTimer(120);
      toast({ title: "SMS yuborildi", description: `${fullPhone} raqamiga tasdiqlash kodi yuborildi` });
    } else {
      toast({ title: "Xatolik", description: result.error, variant: "destructive" });
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    
    setOtp(["", "", "", "", "", ""]);
    setErrors({});
    setOtpTimer(120);
    toast({ title: "SMS", description: "Yangi tasdiqlash kodi yuborildi" });
    
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 50);
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setErrors({ otp: "6 xonali kodni kiriting" });
      return;
    }
    setLoading(true);
    
    let result = await verifyOtp(fullPhone, code);

    setLoading(false);
    if (result.success) {
      if (mode === "register" && role === "owner") {
        toast({ title: "Tabriklaymiz! 🎉", description: "Ro'yxatdan o'tdingiz. Batafsil ma'lumotlarni profilingizda to'ldiring" });
      } else {
        toast({ title: "Tabriklaymiz! 🎉", description: mode === "login" ? "Tizimga kirdingiz" : "Ro'yxatdan muvaffaqiyatli o'tdingiz" });
      }
      navigate("/");
    } else {
      toast({ title: "Xatolik", description: result.error || "Kod noto'g'ri", variant: "destructive" });
      setErrors({ otp: result.error || "Kod noto'g'ri" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") return handleForgotPassword();
    if (mode === "login") return handleLogin();
    if (step === 2) return handleVerifyOtp();
    if (mode === "register" && step === 1) return handleRegisterSubmit();
  };

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ===== RENDER =====
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-violet-50/30 to-rose-50/20">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {/* =================== CHOICE SCREEN =================== */}
          {mode === "choice" && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="w-full p-8 border-none shadow-2xl shadow-violet-500/10 bg-white/80 backdrop-blur-xl">
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 bg-clip-text text-transparent mb-2">
                    Yaqin
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Sevimli xizmatlarni toping
                  </p>
                </div>

                {/* Test Users for Development */}
                <div className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 mb-2.5 text-center uppercase tracking-widest">🧪 Test foydalanuvchilar</p>
                  <div className="space-y-2">
                    {[
                      { role: "Admin", phone: "+998900000001", pass: "admin123", icon: "🛡️", color: "from-red-500 to-rose-600" },
                      { role: "Biznes Egasi", phone: "+998900000002", pass: "owner123", icon: "🏢", color: "from-amber-500 to-orange-500" },
                      { role: "Mijoz", phone: "+998900000003", pass: "client123", icon: "👤", color: "from-emerald-500 to-green-600" },
                    ].map((u) => (
                      <button
                        key={u.role}
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setPhoneDigits(u.phone.replace("+998", ""));
                          setPassword(u.pass);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-violet-50 border border-gray-100 hover:border-violet-200 transition-all group text-left"
                      >
                        <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg shadow-violet-500/20", u.color)}>
                          <span className="text-lg">{u.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-700 group-hover:text-violet-700 transition-colors">{u.role}</p>
                          <p className="text-[11px] font-mono text-gray-500">{u.phone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode("login")}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <LogIn className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-base">Kirish</p>
                      <p className="text-violet-200 text-xs">Akkauntga kirish</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setMode("register"); setRole("client"); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-violet-100 text-gray-800 shadow-sm hover:border-violet-300 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-base">Mijoz sifatida ro'yxatdan o'tish</p>
                      <p className="text-gray-400 text-xs">Yangi akkaunt yaratish</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-gray-300" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setMode("register"); setRole("owner"); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-amber-100 text-gray-800 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-base">Biznes egasi sifatida</p>
                      <p className="text-gray-400 text-xs">Yangi akkaunt yaratish</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-gray-300" />
                  </motion.button>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="text-sm text-gray-400 hover:text-violet-500 transition-colors"
                  >
                    Bosh sahifaga qaytish
                  </button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* =================== LOGIN SCREEN =================== */}
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="w-full p-7 border-none shadow-2xl shadow-violet-500/10 bg-white/80 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setMode("choice")}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-violet-500 mb-5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Orqaga
                </button>

                <div className="text-center mb-7">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <LogIn className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Kirish
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-phone" className="text-sm font-medium text-gray-600">Telefon raqam</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="absolute left-9 top-1/2 -translate-y-1/2 flex items-center">
                          <span className="text-sm font-semibold text-gray-700 select-none">+998</span>
                          <div className="w-px h-4 bg-gray-200 ml-2" />
                        </div>
                        <Input
                          id="login-phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="90 123 45 67"
                          value={formatPhoneDisplay(phoneDigits)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            handlePhoneChange(raw);
                          }}
                          maxLength={12}
                          className={cn("pl-[5.5rem] h-12 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-400/20 font-mono tracking-wide", errors.phone && "border-red-400")}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{errors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-gray-600">Parol</Label>
                        <button type="button" onClick={() => setMode("forgot")} className="text-xs font-semibold text-violet-500 hover:text-violet-600">Parolni unutdingizmi?</button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Parolni kiriting"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={cn("pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-violet-400", errors.password && "border-red-400")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500">⚠ {errors.password}</p>}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/30 transition-all mt-4"
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      "Kirish"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Akkaunt mavjud emasmi ?{" "}
                    <button onClick={() => { setMode("register"); setRole("client"); }} className="text-violet-500 font-semibold hover:text-violet-600 transition-colors">
                      Ro'yxatdan o'ting
                    </button>
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* =================== FORGOT APP PASSWORD SCREEN =================== */}
          {mode === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="w-full p-7 border-none shadow-2xl shadow-violet-500/10 bg-white/80 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-violet-500 mb-5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Orqaga
                </button>

                <div className="text-center mb-7">
                   <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                     <Shield className="w-7 h-7 text-white" />
                   </div>
                   <h2 className="text-2xl font-bold text-gray-800">
                     Parolni tiklash
                   </h2>
                   <p className="text-gray-400 text-sm mt-2">
                     Telefon raqamingizni kiriting. Biz sizga yangi parolni SMS orqali yuboramiz.
                   </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-600">Telefon raqam</Label>
                    <div className="relative">
                       <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-violet-400" />
                       </div>
                       <div className="absolute left-9 top-1/2 -translate-y-1/2 flex items-center">
                          <span className="text-sm font-semibold text-gray-700 select-none">+998</span>
                          <div className="w-px h-4 bg-gray-200 ml-2" />
                       </div>
                       <Input
                         type="tel"
                         inputMode="numeric"
                         placeholder="90 123 45 67"
                         value={formatPhoneDisplay(phoneDigits)}
                         onChange={(e) => {
                           const raw = e.target.value.replace(/\D/g, "");
                           handlePhoneChange(raw);
                         }}
                         maxLength={12}
                         className={cn("pl-[5.5rem] h-12 rounded-xl border-gray-200 focus:border-violet-400 font-mono tracking-wide", errors.phone && "border-red-400")}
                       />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{errors.phone}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold shadow-lg shadow-rose-500/30 transition-all mt-4"
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      "Yangi parol olish"
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* =================== REGISTRATION SCREEN =================== */}
          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="w-full p-7 border-none shadow-2xl shadow-violet-500/10 bg-white/80 backdrop-blur-xl">
                {/* Back button */}
                <button
                  onClick={() => {
                    if (step === 2) {
                      setStep(1);
                      setOtp(["", "", "", "", "", ""]);
                    } else {
                      setMode("choice");
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-violet-500 mb-4 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Orqaga
                </button>

                {/* Header */}
                <div className="text-center mb-5">
                  <div className={cn(
                    "w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg",
                    role === "client"
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30"
                      : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30"
                  )}>
                    {step === 2 ? <Shield className="w-7 h-7 text-white" /> : <UserPlus className="w-7 h-7 text-white" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {step === 2 ? "SMS Tasdiqlash" : (role === "client" ? "Mijoz ro'yxatdan o'tish" : "Biznes egasi ro'yxatdan o'tish")}
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    {step === 1 && "Shaxsiy ma'lumotlarni kiriting"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <AnimatePresence mode="wait">
                    {/* ===== STEP 1: Registration Form ===== */}
                    {step === 1 && (
                      <motion.div
                        key="reg-step1"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 max-h-[60vh] overflow-y-auto px-1 pb-2"
                      >
                        {role === "client" ? (
                          <>
                            {/* First Name */}
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium text-gray-600">Ism *</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                                <Input
                                  placeholder="Ismingiz"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className={cn("pl-10 h-11 rounded-xl border-gray-200 focus:border-violet-400", errors.firstName && "border-red-400")}
                                />
                              </div>
                              {errors.firstName && <p className="text-xs text-red-500">⚠ {errors.firstName}</p>}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-4">

                              <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-600">Biznes nomi *</Label>
                                <div className="relative">
                                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                                  <Input
                                    placeholder="Elite Beauty Salon"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className={cn("pl-10 h-11 rounded-xl border-gray-200 focus:border-amber-400", errors.businessName && "border-red-400")}
                                  />
                                </div>
                                {errors.businessName && <p className="text-xs text-red-500">⚠ {errors.businessName}</p>}
                              </div>
                            </div>

                            <div className="space-y-4 pt-2">
                              <h3 className="text-sm font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-amber-500" />
                                Kategoriya
                              </h3>

                              <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-600">Asosiy Kategoriya *</Label>
                                <Select onValueChange={(val) => { setCategoryId(val); setSubcategoryId(""); }} value={categoryId}>
                                  <SelectTrigger className={cn("h-11 rounded-xl border-gray-200", errors.category && "border-red-400")}>
                                    <SelectValue placeholder="Kategoriyani tanlang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BUSINESS_CATEGORIES.map(cat => (
                                      <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {errors.category && <p className="text-xs text-red-500">⚠ {errors.category}</p>}
                              </div>

                              {categoryId && (
                                 <div className="space-y-1.5">
                                   <Label className="text-sm font-medium text-gray-600">Yo'nalish (Sub-kategoriya) *</Label>
                                   <Select onValueChange={setSubcategoryId} value={subcategoryId}>
                                     <SelectTrigger className="h-11 rounded-xl border-gray-200">
                                       <SelectValue placeholder="Yo'nalishni tanlang" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {BUSINESS_CATEGORIES.find(c => c.id === categoryId)?.subcategories.map(sub => (
                                         <SelectItem key={sub.id} value={sub.id}>{sub.label}</SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 </div>
                               )}
                            </div>

                            <div className="space-y-4 pt-2">
                              <h3 className="text-sm font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-amber-500" />
                                Manzil
                              </h3>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium text-gray-600">Viloyat *</Label>
                                  <Select onValueChange={(val) => { setRegionId(val); setDistrictId(""); setStreetId(""); }} value={regionId}>
                                    <SelectTrigger className={cn("h-11 rounded-xl border-gray-200", errors.region && "border-red-400")}>
                                      <SelectValue placeholder="Tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {REGIONS.map(r => (
                                        <SelectItem key={r.id} value={r.id.toString()}>{r.name_uz}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors.region && <p className="text-xs text-red-500">⚠ {errors.region}</p>}
                                </div>

                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium text-gray-600">Tuman/Shahar *</Label>
                                  <Select onValueChange={(val) => { setDistrictId(val); setStreetId(""); }} value={districtId} disabled={!regionId}>
                                    <SelectTrigger className={cn("h-11 rounded-xl border-gray-200", errors.district && "border-red-400")}>
                                      <SelectValue placeholder="Tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {regionId && getDistrictsByRegion(Number(regionId)).map((d: any) => (
                                        <SelectItem key={d.id} value={d.id.toString()}>{d.name_uz}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {errors.district && <p className="text-xs text-red-500">⚠ {errors.district}</p>}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                   <Label className="text-sm font-medium text-gray-600">Ko'cha (Ixtiyoriy)</Label>
                                   <Select onValueChange={setStreetId} value={streetId} disabled={!districtId}>
                                      <SelectTrigger className="h-11 rounded-xl border-gray-200">
                                        <SelectValue placeholder="Tanlang" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {districtId && getStreetsByDistrict(Number(districtId)).map((s: any) => (
                                          <SelectItem key={s.id} value={s.id.toString()}>{s.name_uz}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                   <Label className="text-sm font-medium text-gray-600">Uy raqami (Ixtiyoriy)</Label>
                                   <Input
                                      placeholder="Masalan: 12"
                                      value={homeNumber}
                                      onChange={(e) => setHomeNumber(e.target.value)}
                                      className="h-11 rounded-xl border-gray-200"
                                   />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Phone (Shared) */}
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-600">Telefon raqam *</Label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                              <Phone className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="absolute left-9 top-1/2 -translate-y-1/2 flex items-center">
                              <span className="text-sm font-semibold text-gray-700 select-none">+998</span>
                              <div className="w-px h-4 bg-gray-200 ml-2" />
                            </div>
                            <Input
                              type="tel"
                              inputMode="numeric"
                              placeholder="90 123 45 67"
                              value={formatPhoneDisplay(phoneDigits)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                handlePhoneChange(raw);
                              }}
                              maxLength={12}
                              className={cn("pl-[5.5rem] h-11 rounded-xl border-gray-200 focus:border-violet-400 font-mono tracking-wide", errors.phone && "border-red-400")}
                            />
                          </div>
                          {errors.phone && <p className="text-xs text-red-500">⚠ {errors.phone}</p>}
                        </div>

                        {/* Password (Shared) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-gray-600">Parol *</Label>
                            <label className="flex items-center gap-1.5 text-xs text-violet-600 cursor-pointer font-medium hover:text-violet-700">
                              <input type="checkbox" checked={!showPassword} onChange={(e) => setShowPassword(!e.target.checked)} className="rounded border-violet-300 text-violet-600 focus:ring-violet-500 w-3.5 h-3.5 transition-colors" />
                              Parolni yashirish
                            </label>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Parol yarating"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={cn("pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-violet-400", errors.password && "border-red-400")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-xs text-red-500">⚠ {errors.password}</p>}
                        </div>
                      </motion.div>
                    )}

                    {/* ===== STEP 2: OTP Verification ===== */}
                    {step === 2 && (
                      <motion.div
                        key="reg-step2-otp"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">
                            SMS orqali yuborilgan 6 xonali kodni kiriting
                          </p>
                          {/* Dev: show fake OTP code */}
                          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                            <span className="text-xs text-amber-600">🧪 Test kod:</span>
                            <span className="font-mono font-bold text-lg text-amber-700 tracking-[0.3em]">123456</span>
                          </div>
                        </div>

                        {/* OTP Input boxes */}
                        <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                          {otp.map((digit, i) => (
                            <motion.input
                              key={i}
                              ref={(el) => { otpRefs.current[i] = el; }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(i, e)}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={cn(
                                "w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all",
                                digit
                                  ? "border-violet-400 bg-violet-50 text-violet-700"
                                  : "border-gray-200 bg-white text-gray-700",
                                "focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                              )}
                            />
                          ))}
                        </div>
                        {errors.otp && <p className="text-xs text-red-500 text-center">⚠ {errors.otp}</p>}

                        {/* Timer */}
                        <div className="text-center">
                          {otpTimer > 0 ? (
                            <p className="text-sm text-gray-400">
                              Kod amal qiladi: <span className="font-mono font-bold text-violet-500">{formatTimer(otpTimer)}</span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={loading}
                              className="text-sm text-violet-500 font-semibold hover:text-violet-600 underline disabled:opacity-50"
                            >
                              Kodni qayta yuborish
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "w-full h-12 rounded-xl font-semibold shadow-lg transition-all text-white",
                      role === "client"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/30"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30"
                    )}
                  >
                    {loading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <>
                        {step === 1 && "Ro'yxatdan o'tish"}
                        {step === 2 && "Tasdiqlash"}
                      </>
                    )}
                  </Button>
                </form>

                {/* Terms of Service & Privacy Policy */}
                {step === 1 && (
                  <div className="mt-4 px-2">
                    <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                      Davom etish orqali siz Yaqin platformasining{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-violet-500 hover:text-violet-600 underline underline-offset-2 font-medium"
                      >
                        Foydalanish shartlari
                      </button>{" "}
                      va{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacy(true)}
                        className="text-violet-500 hover:text-violet-600 underline underline-offset-2 font-medium"
                      >
                        Maxfiylik siyosati
                      </button>
                      ni qabul qilasiz.
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div className="mt-5 text-center">
                    <p className="text-sm text-gray-400">
                      Akkaunt mavjudmi?{" "}
                      <button onClick={() => setMode("login")} className="text-violet-500 font-semibold hover:text-violet-600 transition-colors">
                        Kirish
                      </button>
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =================== TERMS OF SERVICE DIALOG =================== */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-2xl">
          {/* PDF-style header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold text-white">Foydalanish Shartlari</DialogTitle>
              <p className="text-white/70 text-xs mt-0.5">Oxirgi yangilangan: 1 Fevral 2026</p>
            </div>
          </div>

          {/* Scrollable PDF content */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6 text-sm">
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">1. Umumiy Qoidalar</h3>
              <div className="text-slate-600 leading-relaxed space-y-3">
                <p>
                  Ushbu Foydalanish Shartlari ("Shartlar") Yaqin mobil ilovasi va veb-sayti
                  ("Platforma") dan foydalanish qoidalarini belgilaydi. Platformadan foydalanish
                  orqali siz ushbu Shartlarga rozilik bildirasiz.
                </p>
                <p>
                  Yaqin — O'zbekiston Respublikasi qonunlariga muvofiq ro'yxatdan o'tgan
                  "Yaqin Solutions" MChJ tomonidan boshqariladigan go'zallik xizmatlari platformasi.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Hisob Qaydnomasi</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>2.1.</strong> Platformadan foydalanish uchun siz 16 yoshdan katta bo'lishingiz kerak.</p>
                <p><strong>2.2.</strong> Ro'yxatdan o'tishda to'g'ri va to'liq ma'lumotlarni taqdim etishingiz shart.</p>
                <p><strong>2.3.</strong> Hisobingiz xavfsizligi uchun siz javobgarsiz. Parolingizni boshqalar bilan ulashmang.</p>
                <p><strong>2.4.</strong> Hisobingizda shubhali faoliyat sezilsa, darhol bizga xabar bering.</p>
                <p><strong>2.5.</strong> Bir shaxs faqat bitta hisob yaratishi mumkin.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Xizmatlar va To'lovlar</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>3.1.</strong> Platforma orqali siz turli xizmat ko'rsatuvchilarning xizmatlarini bron qilishingiz mumkin.</p>
                <p><strong>3.2.</strong> Xizmat narxlari xizmat ko'rsatuvchilar tomonidan belgilanadi va o'zgarishi mumkin.</p>
                <p><strong>3.3.</strong> To'lovlar Payme, Click yoki boshqa tasdiqlangan to'lov tizimlari orqali amalga oshiriladi.</p>
                <p><strong>3.4.</strong> Bron qilish tasdiqlangandan so'ng, bekor qilish siyosatiga muvofiq to'lov qaytariladi yoki qaytarilmaydi.</p>
                <p><strong>3.5.</strong> Premium obuna avtomatik ravishda yangilanadi. Istasangiz, sozlamalardan bekor qilishingiz mumkin.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">4. Bekor Qilish Siyosati</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>4.1.</strong> Bronni xizmat vaqtidan 24 soat oldin bekor qilsangiz, to'liq to'lov qaytariladi.</p>
                <p><strong>4.2.</strong> 12-24 soat orasida bekor qilsangiz, to'lovning 50% qaytariladi.</p>
                <p><strong>4.3.</strong> 12 soatdan kam vaqt qolganda bekor qilsangiz, to'lov qaytarilmaydi.</p>
                <p><strong>4.4.</strong> Xizmat ko'rsatuvchi tomonidan bekor qilingan bronlar uchun to'liq to'lov qaytariladi.</p>
                <p><strong>4.5.</strong> Fors-major holatlarda alohida ko'rib chiqiladi.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">5. Foydalanuvchi Majburiyatlari</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p>Platformadan foydalanishda siz quyidagilarga rioya qilishingiz kerak:</p>
                <ul className="list-disc list-inside space-y-1 ml-3">
                  <li>O'zbekiston Respublikasi qonunlariga rioya qilish</li>
                  <li>Boshqa foydalanuvchilar huquqlarini hurmat qilish</li>
                  <li>Noto'g'ri yoki yolg'on ma'lumot bermaslik</li>
                  <li>Platformani buzish yoki zarar yetkazish harakatlaridan tiyilish</li>
                  <li>Spam yoki keraksiz xabarlar yubormaslik</li>
                  <li>Xizmat ko'rsatuvchilarning mulkiga zarar yetkazmaslik</li>
                  <li>Kelishilgan vaqtda xizmatga kelish</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">6. Xizmat Ko'rsatuvchilar</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>6.1.</strong> Xizmat ko'rsatuvchilar mustaqil sub'yektlar bo'lib, Yaqin xodimlari emas.</p>
                <p><strong>6.2.</strong> Biz xizmat sifatini nazorat qilishga harakat qilamiz, lekin xizmat ko'rsatuvchilarning harakatlari uchun to'liq javobgar emasmiz.</p>
                <p><strong>6.3.</strong> Xizmat sifati bo'yicha shikoyatlar 48 soat ichida ko'rib chiqiladi.</p>
                <p><strong>6.4.</strong> Qoidabuzar xizmat ko'rsatuvchilar platformadan chiqariladi.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">7. Sharhlar va Reytinglar</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>7.1.</strong> Faqat xizmatdan foydalangan foydalanuvchilar sharh qoldirishi mumkin.</p>
                <p><strong>7.2.</strong> Sharhlar haqiqiy va adolatli bo'lishi kerak.</p>
                <p><strong>7.3.</strong> Haqoratli, soxta yoki reklama xarakteridagi sharhlar o'chiriladi.</p>
                <p><strong>7.4.</strong> Xizmat ko'rsatuvchilar sharhlarga javob berishi mumkin.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">8. Tangalar va Keshbek</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>8.1.</strong> Tangalar platforma ichida ishlatilishi mumkin va naqd pulga almashtirish mumkin emas.</p>
                <p><strong>8.2.</strong> Keshbek faqat Premium obunachilarga beriladi.</p>
                <p><strong>8.3.</strong> Foydalanilmagan tangalar 12 oy davomida amal qiladi.</p>
                <p><strong>8.4.</strong> Firibgarlik orqali olingan tangalar bekor qilinadi.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">9. Javobgarlikni Cheklash</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>9.1.</strong> Platforma "boricha" taqdim etiladi. Biz xizmatning uzluksiz ishlashiga kafolat bermaymiz.</p>
                <p><strong>9.2.</strong> Uchinchi shaxslar tomonidan yetkazilgan zarar uchun biz javobgar emasmiz.</p>
                <p><strong>9.3.</strong> Bizning maksimal javobgarligimiz oxirgi 12 oy davomida siz to'lagan summadan oshmaydi.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">10. Hisobni To'xtatish</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>10.1.</strong> Biz quyidagi hollarda hisobingizni to'xtatish yoki o'chirish huquqiga egamiz:</p>
                <ul className="list-disc list-inside space-y-1 ml-3">
                  <li>Ushbu Shartlarni buzish</li>
                  <li>Firibgarlik harakatlari</li>
                  <li>Boshqa foydalanuvchilarga zarar yetkazish</li>
                  <li>Qonunga zid harakatlar</li>
                </ul>
                <p><strong>10.2.</strong> Siz istalgan vaqtda hisobingizni o'chirishingiz mumkin.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">11. Nizolarni Hal Qilish</h3>
              <div className="text-slate-600 leading-relaxed space-y-2">
                <p><strong>11.1.</strong> Barcha nizolar avval muzokaralar orqali hal qilinishga harakat qilinadi.</p>
                <p><strong>11.2.</strong> Hal bo'lmagan nizolar O'zbekiston Respublikasi sudlarida ko'rib chiqiladi.</p>
                <p><strong>11.3.</strong> Ushbu Shartlarga O'zbekiston Respublikasi qonunlari qo'llaniladi.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">12. O'zgarishlar</h3>
              <p className="text-slate-600 leading-relaxed">
                Biz ushbu Shartlarni istalgan vaqtda o'zgartirish huquqiga egamiz. Muhim o'zgarishlar
                haqida sizga ilova orqali va elektron pochta orqali xabar beramiz. O'zgarishlardan
                so'ng platformadan foydalanishni davom ettirsangiz, yangi shartlarga rozilik bildirgan
                hisoblanasiz.
              </p>
            </section>

            <section className="bg-indigo-50 rounded-xl p-4">
              <h3 className="text-base font-bold text-slate-900 mb-2">Bog'lanish</h3>
              <p className="text-slate-600 leading-relaxed mb-2">
                Foydalanish shartlari bo'yicha savollaringiz bo'lsa, biz bilan bog'laning:
              </p>
              <div className="space-y-1 text-slate-600 text-sm">
                <p>📧 legal@yaqin.uz</p>
                <p>📞 +998 71 200 00 00</p>
              </div>
            </section>

            <div className="border-t pt-4">
              <p className="text-slate-500 text-xs text-center">
                Ushbu Foydalanish Shartlarini qabul qilish orqali siz yuqoridagi barcha
                qoidalarni o'qib chiqqaningizni va ularga rozilik bildirganingizni tasdiqlaysiz.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =================== PRIVACY POLICY DIALOG =================== */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-2xl">
          {/* PDF-style header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-5 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold text-white">Maxfiylik Siyosati</DialogTitle>
              <p className="text-white/70 text-xs mt-0.5">Oxirgi yangilangan: 1 Fevral 2026</p>
            </div>
          </div>

          {/* Scrollable PDF content */}
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6 text-sm">
            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Kirish</h3>
              <p className="text-slate-600 leading-relaxed">
                Yaqin ("biz", "bizning" yoki "Kompaniya") foydalanuvchilarimizning maxfiyligini muhim deb biladi.
                Ushbu Maxfiylik Siyosati biz qanday ma'lumotlarni to'plashimiz, ulardan qanday foydalanishimiz va
                ularni qanday himoya qilishimiz haqida tushuntiradi. Ilovamizdan foydalanish orqali siz ushbu
                siyosatga rozilik bildirasiz.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">To'planadigan Ma'lumotlar</h3>
              <div className="space-y-3 text-slate-600">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Shaxsiy ma'lumotlar:</h4>
                  <ul className="list-disc list-inside space-y-0.5 ml-3">
                    <li>To'liq ism va familiya</li>
                    <li>Telefon raqami</li>
                    <li>Elektron pochta manzili</li>
                    <li>Tug'ilgan sana</li>
                    <li>Profil rasmi (ixtiyoriy)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Texnik ma'lumotlar:</h4>
                  <ul className="list-disc list-inside space-y-0.5 ml-3">
                    <li>Qurilma turi va modeli</li>
                    <li>Operatsion tizim versiyasi</li>
                    <li>IP manzil</li>
                    <li>Joylashuv ma'lumotlari (ruxsat bilan)</li>
                    <li>Ilova foydalanish statistikasi</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Tranzaksiya ma'lumotlari:</h4>
                  <ul className="list-disc list-inside space-y-0.5 ml-3">
                    <li>Bron qilish tarixi</li>
                    <li>To'lov ma'lumotlari (oxirgi 4 raqam)</li>
                    <li>Xizmat tarixi</li>
                    <li>Sharhlar va baholar</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ma'lumotlardan Foydalanish</h3>
              <p className="text-slate-600 leading-relaxed mb-2">
                Biz to'plangan ma'lumotlardan quyidagi maqsadlarda foydalanamiz:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-3">
                <li>Xizmatlarimizni taqdim etish va yaxshilash</li>
                <li>Foydalanuvchi hisobini boshqarish</li>
                <li>Bron qilish va to'lovlarni qayta ishlash</li>
                <li>Mijozlarga xizmat ko'rsatish</li>
                <li>Shaxsiylashtirilgan tavsiyalar berish</li>
                <li>Xavfsizlik va firibgarlikning oldini olish</li>
                <li>Qonuniy talablarni bajarish</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ma'lumotlarni Ulashish</h3>
              <p className="text-slate-600 leading-relaxed mb-2">
                Biz shaxsiy ma'lumotlaringizni quyidagi hollarda ulashishimiz mumkin:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-3">
                <li><strong>Xizmat ko'rsatuvchilar bilan:</strong> Siz bron qilgan xizmatlarni bajarish uchun</li>
                <li><strong>To'lov provayderlari bilan:</strong> Xavfsiz to'lovlarni amalga oshirish uchun</li>
                <li><strong>Qonun talabi bo'yicha:</strong> Huquqiy majburiyatlarni bajarish uchun</li>
                <li><strong>Sizning roziligingiz bilan:</strong> Boshqa maqsadlar uchun faqat sizning roziligingiz bilan</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Bildirishnomalar</h3>
              <p className="text-slate-600 leading-relaxed">
                Biz sizga quyidagi bildirishnomalarni yuborishimiz mumkin: bron tasdiqlari, eslatmalar,
                aksiya va chegirmalar, xizmat yangilanishlari. Siz ilovaning sozlamalar bo'limidan
                bildirishnomalarni boshqarishingiz mumkin.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ma'lumotlar Xavfsizligi</h3>
              <p className="text-slate-600 leading-relaxed">
                Biz ma'lumotlaringizni himoya qilish uchun sanoat standartlariga mos keluvchi
                xavfsizlik choralarini qo'llaymiz: SSL shifrlash, xavfsiz serverlar, muntazam
                xavfsizlik tekshiruvlari va xodimlarning kirish huquqlarini cheklash.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sizning Huquqlaringiz</h3>
              <p className="text-slate-600 leading-relaxed mb-2">Siz quyidagi huquqlarga egasiz:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-3">
                <li>Ma'lumotlaringizga kirish huquqi</li>
                <li>Ma'lumotlarni tuzatish huquqi</li>
                <li>Ma'lumotlarni o'chirish huquqi</li>
                <li>Ma'lumotlarni ko'chirish huquqi</li>
                <li>Rozilikni qaytarib olish huquqi</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">Bolalar Maxfiyligi</h3>
              <p className="text-slate-600 leading-relaxed">
                Ilovamiz 16 yoshdan kichik bolalar uchun mo'ljallanmagan. Biz bila turib
                16 yoshdan kichik bolalardan shaxsiy ma'lumotlarni to'plamaymiz.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-slate-900 mb-2">O'zgarishlar</h3>
              <p className="text-slate-600 leading-relaxed">
                Biz ushbu Maxfiylik Siyosatini vaqti-vaqti bilan yangilashimiz mumkin.
                Muhim o'zgarishlar haqida sizga ilova orqali xabar beramiz.
              </p>
            </section>

            <section className="bg-purple-50 rounded-xl p-4">
              <h3 className="text-base font-bold text-slate-900 mb-2">Bog'lanish</h3>
              <p className="text-slate-600 leading-relaxed mb-2">
                Maxfiylik siyosati bo'yicha savollaringiz bo'lsa, biz bilan bog'laning:
              </p>
              <div className="space-y-1 text-slate-600 text-sm">
                <p>📧 privacy@yaqin.uz</p>
                <p>📞 +998 71 200 00 00</p>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
