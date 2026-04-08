
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DiscountProvider } from "@/contexts/DiscountContext";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import SalonDetail from "./pages/SalonDetail";
import BookingsPage from "./pages/BookingsPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import RegisterBusinessPage from "./pages/RegisterBusinessPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBusinesses from "./pages/AdminBusinesses";
import AdminReviews from "./pages/AdminReviews";
import AdminPromotions from "./pages/AdminPromotions";
import AdminPromocodes from "./pages/AdminPromocodes";
import BusinessDashboard from "./pages/BusinessDashboard";
import CreatePromotionPage from "./pages/CreatePromotionPage";
import EditBusinessInfo from "./pages/EditBusinessInfo";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import MyReviewsPage from "./pages/MyReviewsPage";
import MyPromocodesPage from "./pages/MyPromocodesPage";
import SupportChatPage from "./pages/SupportChatPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentCardsPage from "./pages/PaymentCardsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import TrustHistoryPage from "./pages/TrustHistoryPage";
import CoinWalletPage from "./pages/CoinWalletPage";
import ReviewsPage from "./pages/ReviewsPage";
import AdminCoinHistory from "./pages/AdminCoinHistory";
import AdminTransactionDetail from "./pages/AdminTransactionDetail";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminPaymentHistory from "./pages/admin/AdminPaymentHistory";
import AdminPromoUsage from "./pages/admin/AdminPromoUsage";
import AdminNewsPage from "./pages/AdminNewsPage";
import AdminLayout from "./components/layout/AdminLayout";
import NotFound from "./pages/NotFound";
import BusinessBookingsPage from "./pages/BusinessBookingsPage";
import BusinessPromotionsPage from "./pages/BusinessPromotionsPage";
import BusinessReviewsPage from "./pages/BusinessReviewsPage";
import BusinessServicesPage from "./pages/BusinessServicesPage";
import EditBusinessProfilePage from "./pages/EditBusinessProfilePage";
import BusinessClientsPage from "./pages/BusinessClientsPage";
import BusinessQRScannerPage from "./pages/BusinessQRScannerPage";
import ClientPremiumPage from "./pages/client/ClientPremiumPage";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const queryClient = new QueryClient();

import DesktopNav from "./components/DesktopNav";

import BusinessServicePaymentsPage from "./pages/BusinessServicePaymentsPage";
import BusinessPromotionPage from "./pages/business/BusinessPromotionPage";

const AppContent = () => {
  const location = useLocation();
  const { isRole } = useAuth();
  const isAdmin = isRole("admin");
  const isDesktopPath = location.pathname === "/" || location.pathname === "/register-business" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/business") || location.pathname.startsWith("/profile");

  // Admin-only Full Width Logic - now includes home page
  const isFullWidth = isAdmin && isDesktopPath;

  // Strict Container Class: Non-admins ALWAYS get max-w-md (Mobile View)
  // Admins get full width on all pages
  const containerClass = isAdmin
    ? "w-full"
    : "max-w-md w-full";

  return (
    <div className={`mx-auto bg-background min-h-screen relative shadow-2xl ${containerClass}`}>
      {isAdmin && <DesktopNav />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/reviews" element={<MyReviewsPage />} />
        <Route path="/profile/promocodes" element={<MyPromocodesPage />} />
        <Route path="/profile/addresses" element={<AddressesPage />} />
        <Route path="/profile/payments" element={<PaymentCardsPage />} />
        <Route path="/profile/coins" element={<CoinWalletPage />} />
        <Route path="/profile/notifications" element={<NotificationsPage />} />
        <Route path="/profile/settings" element={<SettingsPage />} />
        <Route path="/profile/help" element={<HelpPage />} />
        <Route path="/profile/support" element={<SupportChatPage />} />
        <Route path="/profile/trust-history" element={<TrustHistoryPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register-business" element={<RegisterBusinessPage />} />
        <Route element={<AdminLayoutWrapper />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/coins" element={<AdminCoinHistory />} />
          <Route path="/admin/coins/:id" element={<AdminTransactionDetail />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
          <Route path="/admin/promocodes" element={<AdminPromocodes />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/payments" element={<AdminPaymentHistory />} />
          <Route path="/admin/promo-usage" element={<AdminPromoUsage />} />
          <Route path="/admin/news" element={<AdminNewsPage />} />
        </Route>
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/client/premium" element={<ClientPremiumPage />} />
        <Route path="/business/bookings" element={<BusinessBookingsPage />} />
        <Route path="/business/promotions" element={<BusinessPromotionsPage />} />
        <Route path="/business/promote" element={<BusinessPromotionPage />} />
        <Route path="/business/service-payments" element={<BusinessServicePaymentsPage />} />
        <Route path="/business/services" element={<BusinessServicesPage />} />
        <Route path="/business/create-promotion" element={<CreatePromotionPage />} />
        <Route path="/business/edit-info" element={<EditBusinessInfo />} />
        <Route path="/business/edit-profile" element={<EditBusinessProfilePage />} />
        <Route path="/business/reviews" element={<BusinessReviewsPage />} />
        <Route path="/business/clients" element={<BusinessClientsPage />} />
        <Route path="/business/scan-qr" element={<BusinessQRScannerPage />} />
        <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <DiscountProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </DiscountProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
