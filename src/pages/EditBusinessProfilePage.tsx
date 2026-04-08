import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BusinessRegistrationForm, { defaultHours } from "@/components/business/BusinessRegistrationForm";
import { BUSINESS_CATEGORIES } from "@/data/businessCategories";

const EditBusinessProfilePage = () => {
    const { user, loading, profile, isRole } = useAuth();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/auth");
            } else if (!isRole("business_owner")) {
                // Only business owners can access this page
                console.log('Not a business owner, redirecting to profile');
                navigate("/profile");
            } else if (profile) {
                // Parse category back to mainCategory and subCategory
                const parseCategoryString = (categoryStr: string) => {
                    if (!categoryStr) return { category: "", subcategory: "" };

                    const parts = categoryStr.split(" > ");
                    if (parts.length === 2) {
                        const mainCat = BUSINESS_CATEGORIES.find(c => c.label === parts[0].trim());
                        if (mainCat) {
                            const subCat = mainCat.subcategories.find(s => s.label === parts[1].trim());
                            return {
                                category: mainCat.id,
                                subcategory: subCat?.id || ""
                            };
                        }
                    }
                    return { category: categoryStr, subcategory: "" };
                };

                const { category, subcategory } = parseCategoryString(profile.category || "");
                const profileData = profile as any; // Cast to access business-specific fields

                // Prepare initial data for form
                setInitialData({
                    full_name: profile.full_name || "",
                    responsible_person: profileData.responsible_person || "",
                    responsible_person_phone: profileData.responsible_person_phone || "",
                    org_type: "individual" as const,
                    phone: profile.phone || "",
                    description: profileData.business_description || "",
                    website: profileData.website || "",
                    instagram: profileData.instagram || "",
                    telegram: profileData.telegram || "",
                    facebook: profileData.facebook || "",
                    avatar_url: profile.avatar_url || "",
                    category: category,
                    subcategory: subcategory,
                    services: profileData.services || [],
                    location: profileData.location || {
                        lat: 41.2995,
                        lng: 69.2401,
                        region: "",
                        district: "",
                        address_line1: "",
                        address_line2: "",
                        postal_code: ""
                    },
                    hours: profileData.hours || defaultHours,
                    amenities: [],
                    gallery: [],
                    portfolio: profileData.portfolio || "",
                    termsAccepted: true,
                });
            }
        }
    }, [user, loading, profile, navigate]);

    if (loading || !initialData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/profile')}
                    className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg>
                    <span className="text-sm font-medium">Orqaga</span>
                </button>

                <BusinessRegistrationForm
                    userId={user?.id || ""}
                    editMode={true}
                    initialData={initialData}
                    onComplete={() => {
                        navigate("/profile");
                        // Reload to show updated data
                        window.location.reload();
                    }}
                />
            </div>
        </div>
    );
};

export default EditBusinessProfilePage;
