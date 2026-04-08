import { Business } from "@/types/business";
import { MapPin, Phone, Mail, Globe, Clock, Star, Edit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BusinessDetailsCardProps {
    business: Business;
}

const BusinessDetailsCard = ({ business }: BusinessDetailsCardProps) => {
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayNames: { [key: string]: string } = {
        monday: "Dushanba",
        tuesday: "Seshanba",
        wednesday: "Chorshanba",
        thursday: "Payshanba",
        friday: "Juma",
        saturday: "Shanba",
        sunday: "Yakshanba",
    };

    return (
        <div className="space-y-6">
            {/* Main Info Card */}
            <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{business.name}</h2>
                        <p className="text-gray-600">{business.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {business.category}
                            </span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{business.rating}</span>
                                <span className="text-gray-500 text-sm">({business.reviewCount} sharh)</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Tahrirlash
                    </Button>
                </div>

                {/* Photos */}
                {business.photos.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Rasmlar</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {business.photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`${business.name} ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="font-semibold mb-3">Aloqa ma'lumotlari</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{business.contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{business.contact.email}</span>
                            </div>
                            {business.contact.website && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Globe className="w-4 h-4 text-gray-500" />
                                    <a href={business.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {business.contact.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Manzil</h3>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                            <div>
                                <p>{business.address.street}</p>
                                <p>{business.address.city}, {business.address.region}</p>
                                <p>{business.address.postalCode}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Working Hours */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ish vaqti
                    </h3>
                    <div className="grid md:grid-cols-2 gap-2">
                        {daysOfWeek.map((day) => {
                            const hours = business.hours[day];
                            return (
                                <div key={day} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium">{dayNames[day]}</span>
                                    <span className="text-sm text-gray-600">
                                        {hours.closed ? (
                                            <span className="text-red-600">Yopiq</span>
                                        ) : (
                                            `${hours.open} - ${hours.close}`
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Services Card */}
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Xizmatlar ({business.services.length})</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {business.services.map((service) => (
                        <div key={service.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{service.name}</h4>
                                <span className="text-primary font-semibold">{service.price.toLocaleString()} so'm</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {service.duration} daqiqa
                                </span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded">{service.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Staff Card */}
            {business.staff.length > 0 && (
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Xodimlar ({business.staff.length})</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {business.staff.map((staff) => (
                            <div key={staff.id} className="text-center">
                                {staff.photo ? (
                                    <img
                                        src={staff.photo}
                                        alt={staff.name}
                                        className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full mx-auto mb-2 bg-gray-200 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-500">{staff.name[0]}</span>
                                    </div>
                                )}
                                <h4 className="font-medium">{staff.name}</h4>
                                <p className="text-sm text-gray-600">{staff.role}</p>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-semibold">{staff.rating}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 justify-center mt-2">
                                    {staff.specialties.map((specialty, index) => (
                                        <span key={index} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BusinessDetailsCard;
