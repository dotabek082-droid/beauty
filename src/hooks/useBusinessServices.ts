import { useState, useEffect } from "react";
import { Service } from "@/types/service";
import { MOCK_SERVICES } from "@/data/mockServices";

export const useBusinessServices = (businessId?: string) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const loadServices = async () => {
            setLoading(true);
            try {
                // In a real app, fetch from Supabase using businessId
                // For now, return mock data
                await new Promise(resolve => setTimeout(resolve, 500));
                setServices(MOCK_SERVICES);
            } catch (error) {
                console.error("Error loading services:", error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [businessId]);

    return { services, loading };
};
