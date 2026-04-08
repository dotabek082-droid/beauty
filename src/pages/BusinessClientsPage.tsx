import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Search,
    Users,
    Calendar,
    Phone,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    Banknote,
    CreditCard,
    Coins,
    Star,
    Plus,
    UserPlus,

    Scissors,
    Trash2,
    Edit,
} from "lucide-react";
import { fakeBusinessClients, BusinessClient, ClientBooking } from "@/data/fakeBusinessClients";
import { ManualServiceRegistration } from "@/components/business/ManualServiceRegistration";
import { AddOfflineClientDialog } from "@/components/business/AddOfflineClientDialog";
import { useFrontendPromotions } from "@/hooks/useFrontendPromotions";
import { mockBusinesses } from "@/data/businessData";

const BusinessClientsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [clients, setClients] = useState<BusinessClient[]>(fakeBusinessClients);
    const [selectedClient, setSelectedClient] = useState<BusinessClient | null>(null);
    const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
    const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<ClientBooking | undefined>(undefined);

    // Get business data (mock)
    const businessId = 'biz-1'; // Using Belleza Studio as mock
    const business = mockBusinesses.find(b => b.id === businessId);
    const services = business?.services || [];

    // Handle service registration
    const handleServiceRegister = (serviceId: string, clientId: string, date?: string, paymentMethod?: 'cash' | 'card' | 'coin', status: 'completed' | 'draft' = 'completed') => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        const bookingDate = date || new Date().toISOString();

        const newBooking: ClientBooking = {
            id: `manual-service-${Date.now()}`,
            date: bookingDate,
            service: service.name,
            price: service.price,
            status: status,
            paymentMethod: paymentMethod || 'cash',
        };

        const updateClient = (client: BusinessClient) => {
            // Check if this date is later than current lastVisit
            const isLatest = !client.lastVisit || new Date(bookingDate) > new Date(client.lastVisit);

            return {
                ...client,
                totalVisits: client.totalVisits + 1,
                totalSpent: client.totalSpent + service.price,
                lastVisit: isLatest ? bookingDate : client.lastVisit,
                pastBookings: [newBooking, ...client.pastBookings].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ),
                servicesUsed: Array.from(new Set([...client.servicesUsed, service.name]))
            };
        };

        // Update clients list
        setClients(prev => prev.map(c => c.id === clientId ? updateClient(c) : c));

        // Update selected client if open
        if (selectedClient?.id === clientId) {
            setSelectedClient(prev => prev ? updateClient(prev) : null);
        }
    };

    const handleUpdateBooking = (bookingId: string, updates: Partial<ClientBooking>) => {
        if (!selectedClient) return;

        const updateClient = (client: BusinessClient) => {
            const updatedBookings = client.pastBookings.map(booking =>
                booking.id === bookingId ? { ...booking, ...updates } : booking
            ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // Recalculate totals
            const completedBookings = updatedBookings.filter(b => b.status === 'completed');
            const totalSpent = completedBookings.reduce((sum, b) => sum + b.price, 0);

            return {
                ...client,
                pastBookings: updatedBookings,
                totalSpent,
                // Update services used if needed, simple approach:
                servicesUsed: Array.from(new Set(updatedBookings.map(b => b.service)))
            };
        };

        setClients(prev => prev.map(c => c.id === selectedClient.id ? updateClient(c) : c));
        setSelectedClient(prev => prev ? updateClient(prev) : null);
    };

    const handleDeleteBooking = (bookingId: string) => {
        if (!selectedClient) return;

        const updateClient = (client: BusinessClient) => {
            const updatedBookings = client.pastBookings.filter(b => b.id !== bookingId);

            // Recalculate totals
            const completedBookings = updatedBookings.filter(b => b.status === 'completed');
            const totalSpent = completedBookings.reduce((sum, b) => sum + b.price, 0);

            return {
                ...client,
                pastBookings: updatedBookings,
                totalSpent,
                servicesUsed: Array.from(new Set(updatedBookings.map(b => b.service)))
            };
        };

        setClients(prev => prev.map(c => c.id === selectedClient.id ? updateClient(c) : c));
        setSelectedClient(prev => prev ? updateClient(prev) : null);
    };

    const handleAddClient = ({ fullName, phone }: { fullName: string; phone: string }) => {
        const newClient: BusinessClient = {
            id: `offline-${Date.now()}`,
            userId: `offline-user-${Date.now()}`,
            fullName,
            phone,
            avatarUrl: null,
            totalVisits: 0,
            lastVisit: null,
            upcomingAppointments: [],
            pastBookings: [],
            servicesUsed: [],
            totalSpent: 0,
            joinedDate: new Date().toISOString().split('T')[0],
            isManual: true
        };

        setClients(prev => [newClient, ...prev]);
    };

    // Filter clients based on search
    const filteredClients = clients.filter((client) =>
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
    );

    // Calculate statistics
    const totalClients = clients.length;
    const totalUpcoming = clients.reduce(
        (sum, client) => sum + client.upcomingAppointments.length,
        0
    );
    const totalRevenue = clients.reduce(
        (sum, client) => sum + client.totalSpent,
        0
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const bookingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffTime = bookingDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // If it's today
        if (diffDays === 0) {
            return `Bugun, ${date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;
        }

        // If it's yesterday
        if (diffDays === -1) {
            return 'Kecha';
        }

        // If it's tomorrow
        if (diffDays === 1) {
            return 'Ertaga';
        }

        // For upcoming dates within next 7 days
        if (diffDays > 1 && diffDays <= 7) {
            return `${diffDays} kun ichida`;
        }

        // For past dates within last 7 days
        if (diffDays < -1 && diffDays >= -7) {
            return `${Math.abs(diffDays)} kun oldin`;
        }

        // For dates beyond 7 days
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        };

        // Manual formatting with Uzbek month names (jan, feb, etc)
        const monthNames = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'];
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return year !== now.getFullYear() ? `${day} ${month} ${year}` : `${day} ${month}`;
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('ru-RU') + " so'm";
    };

    // Format with both date and time for visit history
    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const monthNames = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'];

        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const getStatusColor = (status: ClientBooking['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/10 text-green-600 border-green-200';
            case 'upcoming':
                return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'cancelled':
                return 'bg-red-500/10 text-red-600 border-red-200';
            case 'draft':
                return 'bg-gray-500/10 text-gray-600 border-gray-200';
        }
    };

    const getStatusText = (status: ClientBooking['status']) => {
        switch (status) {
            case 'completed':
                return 'Bajarildi';
            case 'upcoming':
                return 'Kelayotgan';
            case 'cancelled':
                return 'Bekor qilindi';
            case 'draft':
                return 'Qoralama';
        }
    };

    const getPaymentIcon = (method: ClientBooking['paymentMethod']) => {
        switch (method) {
            case 'cash':
                return <Banknote className="w-3.5 h-3.5" />;
            case 'card':
                return <CreditCard className="w-3.5 h-3.5" />;
            case 'coin':
                return <Coins className="w-3.5 h-3.5" />;
        }
    };

    const getPaymentText = (method: ClientBooking['paymentMethod']) => {
        switch (method) {
            case 'cash':
                return 'Naqd';
            case 'card':
                return 'Karta';
            case 'coin':
                return 'Coin';
        }
    };

    const getPaymentColor = (method: ClientBooking['paymentMethod']) => {
        switch (method) {
            case 'cash':
                return 'text-emerald-600';
            case 'card':
                return 'text-blue-600';
            case 'coin':
                return 'text-amber-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Orqaga</span>
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
                            <p className="text-sm text-muted-foreground">
                                Xizmatingizdan foydalanganlar
                            </p>
                        </div>
                        <Button onClick={() => setAddClientDialogOpen(true)}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Mijoz qo'shish
                        </Button>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <Card className="p-3">
                            <div className="text-xs text-muted-foreground mb-1">Jami mijozlar</div>
                            <div className="text-2xl font-bold text-primary">{totalClients}</div>
                        </Card>
                        <Card className="p-3">
                            <div className="text-xs text-muted-foreground mb-1">Kelayotgan</div>
                            <div className="text-2xl font-bold text-blue-600">{totalUpcoming}</div>
                        </Card>
                        <Card className="p-3">
                            <div className="text-xs text-muted-foreground mb-1">Jami daromad</div>
                            <div className="text-lg font-bold text-green-600">
                                {(totalRevenue / 1000000).toFixed(1)}M
                            </div>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Ism yoki telefon raqam bo'yicha qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Clients List */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="space-y-3">
                    {filteredClients.map((client) => (
                        <Card
                            key={client.id}
                            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                                console.log('Client clicked:', client);
                                setSelectedClient(client);
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-lg font-semibold text-primary">
                                            {client.fullName.charAt(0)}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-base truncate max-w-[200px] sm:max-w-none">
                                                {client.fullName}
                                            </h3>
                                            {client.isManual && (
                                                <Badge variant="outline" className="shrink-0 h-5 px-1.5 text-[10px] bg-orange-50 text-orange-700 border-orange-200">
                                                    <UserPlus className="w-3 h-3 mr-1" />
                                                    Manual
                                                </Badge>
                                            )}
                                            <Badge variant="secondary" className="shrink-0">
                                                {client.totalVisits} ta tashrif
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                <span>{client.phone}</span>
                                            </div>
                                            {client.lastVisit && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Oxirgi: {formatDate(client.lastVisit)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Upcoming appointments */}
                                        {client.upcomingAppointments.length > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-blue-600 font-medium">
                                                    {client.upcomingAppointments.length} ta kelayotgan uchrashuv
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Total spent */}
                                <div className="text-right shrink-0 ml-4">
                                    <div className="text-xs text-muted-foreground mb-1">Jami sarflagan</div>
                                    <div className="text-sm font-bold text-green-600">
                                        {formatPrice(client.totalSpent)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredClients.length === 0 && (
                        <Card className="p-12 text-center">
                            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Mijozlar topilmadi</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery
                                    ? "Qidiruv bo'yicha natija yo'q"
                                    : "Hozircha sizning xizmatingizdan foydalanganlar yo'q"}
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Client Details Dialog */}
            <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xl font-semibold text-primary">
                                    {selectedClient?.fullName.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <div className="text-lg flex items-center gap-2">
                                    {selectedClient?.fullName}
                                    {selectedClient?.isManual && (
                                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-orange-50 text-orange-700 border-orange-200">
                                            <UserPlus className="w-3 h-3 mr-1" />
                                            Manual
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground font-normal">
                                    {selectedClient?.phone}
                                </div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedClient && (
                        <div className="space-y-6 mt-4">
                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold text-primary">
                                        {selectedClient.totalVisits}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Jami tashrif</div>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatPrice(selectedClient.totalSpent)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Jami sarflagan</div>
                                </div>
                                <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {selectedClient.upcomingAppointments.length}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Kelayotgan</div>
                                </div>
                            </div>

                            {/* Register Service Button */}
                            <Button
                                onClick={() => setServiceDialogOpen(true)}
                                className="w-full"
                                variant="default"
                            >
                                <Scissors className="w-4 h-4 mr-2" />
                                Xizmatdan foydalanishni ro'yxatga olish
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                * Qoralama sifatida saqlashingiz yoki to'g'ridan-to'g'ri tasdiqlashingiz mumkin
                            </p>

                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    Foydalanilgan xizmatlar
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedClient.servicesUsed.map((service, idx) => (
                                        <Badge key={idx} variant="outline">
                                            {service}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Upcoming Appointments */}
                            {selectedClient.upcomingAppointments.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        Kelayotgan uchrashuvlar
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedClient.upcomingAppointments.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50"
                                            >
                                                <div>
                                                    <div className="font-medium">{booking.service}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatDate(booking.date)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold mb-1">{formatPrice(booking.price)}</div>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Badge className={getStatusColor(booking.status)} variant="outline">
                                                            {getStatusText(booking.status)}
                                                        </Badge>
                                                        <div className={`flex items-center gap-1 text-xs ${getPaymentColor(booking.paymentMethod)}`}>
                                                            {getPaymentIcon(booking.paymentMethod)}
                                                            <span>{getPaymentText(booking.paymentMethod)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Bookings */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    Tashrif tarixi ({selectedClient.pastBookings.length})
                                </h4>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {selectedClient.pastBookings.map((booking) => (
                                        <div key={booking.id} className="flex flex-col gap-2 w-full">
                                            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3 justify-between flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                            {booking.status === 'completed' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4 text-red-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-sm">{booking.service}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDateTime(booking.date)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold mb-1">{formatPrice(booking.price)}</div>
                                                        <div className={`flex items-center gap-1 text-xs justify-end ${getPaymentColor(booking.paymentMethod)}`}>
                                                            {getPaymentIcon(booking.paymentMethod)}
                                                            <span>{getPaymentText(booking.paymentMethod)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions for draft */}
                                            {
                                                booking.status === 'draft' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingBooking(booking);
                                                                setServiceDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="w-3.5 h-3.5 mr-1" />
                                                            O'zgartirish
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteBooking(booking.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                            O'chirish
                                                        </Button>
                                                    </div>
                                                )
                                            }

                                            {/* Review Section */}
                                            {
                                                booking.rating && (
                                                    <div className="ml-11 mr-1 p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg text-sm">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-3.5 h-3.5 ${i < (booking.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="font-medium text-yellow-700 text-xs">
                                                                {booking.rating}.0
                                                            </span>
                                                        </div>
                                                        {booking.review && (
                                                            <p className="text-gray-600 italic">"{booking.review}"</p>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Manual Service Registration Dialog */}
            {
                selectedClient && (
                    <ManualServiceRegistration
                        open={serviceDialogOpen}
                        onOpenChange={(open) => {
                            setServiceDialogOpen(open);
                            if (!open) setEditingBooking(undefined);
                        }}
                        clientName={selectedClient.fullName}
                        clientId={selectedClient.id}
                        businessId={businessId}
                        services={services}
                        onRegister={handleServiceRegister}
                        initialBooking={editingBooking}
                        onUpdate={handleUpdateBooking}
                    />
                )
            }

            <AddOfflineClientDialog
                open={addClientDialogOpen}
                onOpenChange={setAddClientDialogOpen}
                onAddClient={handleAddClient}
            />
        </div >
    );
};

export default BusinessClientsPage;

