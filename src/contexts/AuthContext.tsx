import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService, UserData, RegisterRequest } from "@/services/authService";

export type UserRole = "user" | "admin" | "moderator" | "business_owner";

// Backward-compatible Profile interface for components that use profile.*
interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  trust_score: number;
  total_wins: number;
  total_feedbacks: number;
  is_verified: boolean;
  business_description?: string | null;
  working_hours_start?: string | null;
  working_hours_end?: string | null;
  hours?: Record<string, any> | null;
  region?: string | null;
  district?: string | null;
  birth_date?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: 'male' | 'female' | null;
  email?: string | null;
  category?: string | null;
  amenities?: string[] | null;
  gallery?: string[] | null;
  location?: any | null;
  instagram?: string | null;
  telegram?: string | null;
  facebook?: string | null;
  services?: { name: string; price: number }[] | null;
  subscription?: {
    tier: 'standard' | 'gold' | 'platinum';
    expiryDate: string | null;
  };
}

interface AuthContextType {
  user: any | null;
  session: any | null;
  profile: Profile | null;
  loading: boolean;
  userRole: UserRole | null;
  accessToken: string | null;
  signIn: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: RegisterRequest) => Promise<{ success: boolean; error?: string; userId?: number }>;
  verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isRole: (role: UserRole) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Build backward-compatible user/profile from API UserData
function buildCompatUser(userData: UserData) {
  return {
    id: String(userData.id),
    email: userData.email,
    phone: userData.phone,
  };
}

function buildCompatProfile(userData: UserData): Profile {
  const loc = userData.locations?.[0];
  return {
    id: String(userData.id),
    user_id: String(userData.id),
    full_name: `${userData.first_name} ${userData.last_name}`,
    phone: userData.phone,
    avatar_url: userData.avatar,
    trust_score: 80,
    total_wins: 5,
    total_feedbacks: 12,
    is_verified: userData.is_active,
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    birth_date: userData.birth_date,
    region: loc?.region?.name_uz || null,
    district: loc?.district?.name_uz || null,
    location: loc ? {
      latitude: loc.latitude,
      longitude: loc.longitude,
      home: loc.home,
      post_number: loc.post_number,
      street: loc.street?.name_uz,
    } : null,
  };
}

// ===== Mock Test Users =====
const MOCK_USERS: Record<string, { password: string; role: UserRole; userData: UserData }> = {
  "+998900000001": {
    password: "admin123",
    role: "admin",
    userData: {
      id: 1,
      first_name: "Admin",
      last_name: "Yaqin",
      phone: "+998900000001",
      email: "admin@yaqin.uz",
      birth_date: "1990-01-01",
      is_active: true,
      verified_at: new Date().toISOString(),
      created_at: "2026-01-01T00:00:00Z",
      created_by: null, updated_at: null, updated_by: null,
      deleted_at: null, deleted_by: null, delete_status: false,
      avatar: null,
      locations: [{
        id: 1, is_primary: true, home: "1", post_number: "100000",
        latitude: 41.311081, longitude: 69.240562,
        created_at: "2026-01-01T00:00:00Z", created_by: null, updated_at: null, updated_by: null,
        deleted_at: null, deleted_by: null, delete_status: false,
        region: { id: 1, name_uz: "Toshkent shahri", name_ru: "Ташкент город", name_en: "Tashkent city" },
        district: { id: 4, name_uz: "Yunusobod", name_ru: "Юнусабад", name_en: "Yunusabad" },
        street: { id: 6, name_uz: "Amir Temur ko'chasi", name_ru: "Улица Амира Темура", name_en: "Amir Temur Street" },
      }],
    },
  },
  "+998900000002": {
    password: "owner123",
    role: "business_owner",
    userData: {
      id: 2,
      first_name: "Sardor",
      last_name: "Karimov",
      phone: "+998900000002",
      email: "owner@yaqin.uz",
      birth_date: "1988-05-15",
      is_active: true,
      verified_at: new Date().toISOString(),
      created_at: "2026-01-01T00:00:00Z",
      created_by: null, updated_at: null, updated_by: null,
      deleted_at: null, deleted_by: null, delete_status: false,
      avatar: null,
      locations: [{
        id: 2, is_primary: true, home: "45", post_number: "100100",
        latitude: 41.299496, longitude: 69.240074,
        created_at: "2026-01-01T00:00:00Z", created_by: null, updated_at: null, updated_by: null,
        deleted_at: null, deleted_by: null, delete_status: false,
        region: { id: 1, name_uz: "Toshkent shahri", name_ru: "Ташкент город", name_en: "Tashkent city" },
        district: { id: 2, name_uz: "Chilonzor", name_ru: "Чиланзар", name_en: "Chilanzar" },
        street: { id: 1, name_uz: "Bunyodkor ko'chasi", name_ru: "Улица Бунёдкор", name_en: "Bunyodkor Street" },
      }],
    },
  },
  "+998900000003": {
    password: "client123",
    role: "user",
    userData: {
      id: 3,
      first_name: "Malika",
      last_name: "Rahimova",
      phone: "+998900000003",
      email: "client@yaqin.uz",
      birth_date: "1995-09-20",
      is_active: true,
      verified_at: new Date().toISOString(),
      created_at: "2026-01-01T00:00:00Z",
      created_by: null, updated_at: null, updated_by: null,
      deleted_at: null, deleted_by: null, delete_status: false,
      avatar: null,
      locations: [{
        id: 3, is_primary: true, home: "12", post_number: "100123",
        latitude: 41.326942, longitude: 69.228590,
        created_at: "2026-01-01T00:00:00Z", created_by: null, updated_at: null, updated_by: null,
        deleted_at: null, deleted_by: null, delete_status: false,
        region: { id: 1, name_uz: "Toshkent shahri", name_ru: "Ташкент город", name_en: "Tashkent city" },
        district: { id: 5, name_uz: "Mirzo Ulug'bek", name_ru: "Мирзо Улугбек", name_en: "Mirzo Ulugbek" },
        street: { id: 9, name_uz: "Navoiy ko'chasi", name_ru: "Улица Навои", name_en: "Navoi Street" },
      }],
    },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user_data");
    const storedRole = localStorage.getItem("user_role");

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as UserData;
        setAccessToken(storedToken);
        setUser(buildCompatUser(parsed));
        setProfile(buildCompatProfile(parsed));
        setSession({ access_token: storedToken });
        setUserRole((storedRole as UserRole) || "user");
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("user_role");
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (token: string, userData: UserData, role: UserRole = "user") => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    localStorage.setItem("user_role", role);
    setAccessToken(token);
    setUser(buildCompatUser(userData));
    setProfile(buildCompatProfile(userData));
    setSession({ access_token: token });
    setUserRole(role);
  };

  const signIn = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check mock test users first
    const mockUser = MOCK_USERS[phone];
    if (mockUser) {
      // Allow login without strict password check since UI now uses OTP
      const fakeToken = `mock_token_${mockUser.role}_${Date.now()}`;
      persistSession(fakeToken, mockUser.userData, mockUser.role);
      return { success: true };
    }

    // Real API call for non-test users
    try {
      const result = await authService.login({ phone, password });

      if (!result.success || !result.data) {
        return { success: false, error: result.error?.message || "Login xatosi" };
      }

      persistSession(result.data.access_token, result.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Xatolik yuz berdi" };
    }
  };

  // Store pending registration for mock OTP flow
  const [pendingRegistration, setPendingRegistration] = useState<RegisterRequest | null>(null);
  const MOCK_OTP_CODE = "123456";

  const signUp = async (data: RegisterRequest): Promise<{ success: boolean; error?: string; userId?: number }> => {
    // Mock registration: store data and simulate SMS sent
    setPendingRegistration(data);
    return { success: true, userId: Date.now() };

    // Real API call (uncomment when backend is ready):
    // try {
    //   const result = await authService.register(data);
    //   if (!result.success || !result.data) {
    //     return { success: false, error: result.error?.message || "Ro'yxatdan o'tishda xatolik" };
    //   }
    //   return { success: true, userId: result.data.user_id };
    // } catch (err) {
    //   return { success: false, error: "Xatolik yuz berdi" };
    // }
  };

  const verifyOtp = async (phone: string, code: string): Promise<{ success: boolean; error?: string }> => {
    // Mock OTP verification
    if (code === MOCK_OTP_CODE && pendingRegistration) {
      const isOwner = pendingRegistration.role === "owner";
      
      const mockUserData: UserData = {
        id: Date.now(),
        // For business owner, we mapped business name to first_name
        first_name: pendingRegistration.first_name,
        last_name: pendingRegistration.last_name,
        phone: pendingRegistration.phone,
        email: pendingRegistration.email || null,
        birth_date: pendingRegistration.birth_date || "",
        is_active: isOwner ? false : true,
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        created_by: null, updated_at: null, updated_by: null,
        deleted_at: null, deleted_by: null, delete_status: false,
        avatar: null,
        locations: isOwner && pendingRegistration.latitude ? [{
          id: Date.now(),
          is_primary: true,
          home: pendingRegistration.home || "",
          post_number: pendingRegistration.post_number || "",
          latitude: pendingRegistration.latitude || 0,
          longitude: pendingRegistration.longitude || 0,
          created_at: new Date().toISOString(),
          created_by: null, updated_at: null, updated_by: null,
          deleted_at: null, deleted_by: null, delete_status: false,
          region: { id: pendingRegistration.region_id || 1, name_uz: pendingRegistration.region_name || "", name_ru: "", name_en: "" },
          district: { id: pendingRegistration.district_id || 1, name_uz: pendingRegistration.district_name || "", name_ru: "", name_en: "" },
          street: { id: pendingRegistration.street_id || 1, name_uz: pendingRegistration.street_name || "", name_ru: "", name_en: "" },
        }] : [],
        // We will also use category from pendingRegistration later if needed in profile builder
      };
      const finalRole = isOwner ? "business_owner" : "user";
      const fakeToken = `mock_token_${finalRole}_${Date.now()}`;
      
      // If business owner, we can inject business_description/category into the built profile
      // so we pass the data around. Actually `buildCompatProfile` uses `userData.locations` etc.
      
      persistSession(fakeToken, mockUserData, finalRole as UserRole);
      setPendingRegistration(null);
      return { success: true };
    } else if (code !== MOCK_OTP_CODE) {
      return { success: false, error: "Kod noto'g'ri. To'g'ri kod: 123456" };
    }

    // Real API call (uncomment when backend is ready):
    // try {
    //   const result = await authService.verifyOtp({ phone, code });
    //   if (!result.success || !result.data) {
    //     return { success: false, error: result.error?.message || "Kod noto'g'ri" };
    //   }
    //   persistSession(result.data.access_token, result.data.user);
    //   return { success: true };
    // } catch (err) {
    //   return { success: false, error: "Xatolik yuz berdi" };
    // }
    return { success: false, error: "Ro'yxatdan o'tish ma'lumotlari topilmadi" };
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_role");
    setAccessToken(null);
    setUser(null);
    setProfile(null);
    setSession(null);
    setUserRole(null);
  };

  const isRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const refreshProfile = async () => {
    // Will be implemented when profile GET endpoint is available
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        userRole,
        accessToken,
        signIn,
        signUp,
        verifyOtp,
        signOut,
        isRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
