
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BusinessRegistrationForm from "@/components/business/BusinessRegistrationForm";
import { Card } from "@/components/ui/card";

const RegisterBusinessPage = () => {
    const { user, loading, profile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/auth");
            } else if (profile?.category) {
                // Already registered
                navigate("/business");
            }
        }
    }, [user, loading, navigate, profile]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <BusinessRegistrationForm
                    userId={user?.id || ""}
                    onComplete={() => navigate("/business")}
                />
            </div>
        </div>
    );
};

export default RegisterBusinessPage;
