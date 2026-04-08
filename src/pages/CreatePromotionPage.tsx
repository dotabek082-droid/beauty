import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePromotionWizard } from "@/components/business/CreatePromotionWizard";
import { useFrontendPromotions } from "@/hooks/useFrontendPromotions";
import { useAuth } from "@/contexts/AuthContext";

const CreatePromotionPage = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [showWizard, setShowWizard] = useState(true);
    const { createPromotion } = useFrontendPromotions(profile?.id || "");

    const handleClose = () => {
        navigate("/business?tab=profile");
    };

    const handleSubmit = async (data: any) => {
        await createPromotion(data);
        navigate("/business?tab=profile");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">Yangi Aksiya Yaratish</h1>
                        <p className="text-xs text-muted-foreground">
                            Mijozlarni jalb qilish uchun aksiya yarating
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6">
                <CreatePromotionWizard
                    isOpen={showWizard}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default CreatePromotionPage;
