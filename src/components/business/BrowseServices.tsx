// Placeholder component - to be implemented
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BrowseServicesProps {
    currentBusinessId: string;
}

const BrowseServices = ({ currentBusinessId }: BrowseServicesProps) => {
    return (
        <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Xizmatlarni ko'rish</h3>
            <p className="text-gray-600">
                Bu bo'lim boshqa bizneslarning xizmatlarini ko'rish va buyurtma qilish imkonini beradi.
            </p>
            <p className="text-sm text-gray-500 mt-2">Tez orada ishga tushadi...</p>
        </Card>
    );
};

export default BrowseServices;
