import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Scissors, Clock, Banknote, Search, CreditCard, Coins, FileEdit } from 'lucide-react';
import { BusinessService } from '@/types/business';
import { ClientBooking } from '@/data/fakeBusinessClients';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';


interface ManualServiceRegistrationProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientName: string;
    clientId: string;
    businessId: string;
    services: BusinessService[];
    initialBooking?: ClientBooking;
    onRegister?: (serviceId: string, clientId: string, date: string, paymentMethod: 'cash' | 'card' | 'coin', status: 'completed' | 'draft') => void;
    onUpdate?: (bookingId: string, updates: Partial<ClientBooking>) => void;
}

export function ManualServiceRegistration({
    open,
    onOpenChange,
    clientName,
    clientId,
    businessId,
    services,
    initialBooking,
    onRegister,
    onUpdate
}: ManualServiceRegistrationProps) {
    const [selectedService, setSelectedService] = useState<BusinessService | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form states
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'coin'>('cash');

    // Initialize with booking data if provided
    useEffect(() => {
        if (open) {
            if (initialBooking) {
                const bookingDate = new Date(initialBooking.date);
                setDate(bookingDate.toISOString().split('T')[0]);
                setTime(bookingDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
                setPaymentMethod(initialBooking.paymentMethod);

                // Find service
                const service = services.find(s => s.name === initialBooking.service);
                if (service) {
                    setSelectedService(service);
                    setIsConfirming(true); // Jump to confirm step
                }
            } else {
                // Reset form if opening without initialBooking (new registration)
                setDate(new Date().toISOString().split('T')[0]);
                setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
                setPaymentMethod('cash');
                setSelectedService(null);
                setIsConfirming(false);
            }
        }
    }, [initialBooking, open, services]);

    const { toast } = useToast();

    // Filter only active services
    const activeServices = (services || []).filter(
        s => s.isActive && s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleConfirm = (status: 'completed' | 'draft') => {
        if (!selectedService) return;

        // Combine date and time
        const dateTime = new Date(`${date}T${time}`);

        if (initialBooking && onUpdate) {
            // Updating existing booking
            onUpdate(initialBooking.id, {
                date: dateTime.toISOString(),
                paymentMethod,
                service: selectedService.name,
                price: selectedService.price,
                status: status
            });

            toast({
                title: status === 'draft' ? "Qoralama saqlandi" : "Xizmat tasdiqlandi",
                description: `${clientName} - ${selectedService.name} (${status === 'draft' ? 'Qoralama' : 'Bajarildi'})`,
                duration: 3000,
            });
        } else {
            // Creating new booking
            onRegister?.(
                selectedService.id,
                clientId,
                dateTime.toISOString(),
                paymentMethod,
                status
            );

            toast({
                title: status === 'draft' ? "Qoralama yaratildi" : "Xizmat muvaffaqiyatli ro'yxatga olindi! ✅",
                description: `${clientName} - ${selectedService.name} (${status === 'draft' ? 'Qoralama' : 'Bajarildi'})`,
                duration: 3000,
            });
        }

        // Reset and close
        setSelectedService(null);
        setIsConfirming(false);
        setSearchQuery("");
        setPaymentMethod('cash');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                // Only reset if completely closing, but keep state if just switching views within dialog? 
                // Actually reset is fine.
                setSelectedService(null);
                setIsConfirming(false);
                setSearchQuery("");
            }
            onOpenChange(isOpen);
        }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Xizmatdan foydalanishni ro'yxatga olish
                    </DialogTitle>
                    <DialogDescription>
                        {clientName} uchun xizmat turini tanlang
                    </DialogDescription>
                </DialogHeader>

                {!isConfirming ? (
                    <div className="space-y-4 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Xizmat nomini qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {activeServices.length === 0 ? (
                            <Card className="p-8 text-center">
                                <Scissors className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                                <p className="text-muted-foreground">
                                    Xizmatlar topilmadi
                                </p>
                            </Card>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    Jami {activeServices.length} ta xizmat
                                </p>

                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {activeServices.map((service) => (
                                        <Card
                                            key={service.id}
                                            className={`p-4 cursor-pointer transition-all ${selectedService?.id === service.id
                                                ? 'border-primary border-2 bg-primary/5'
                                                : 'hover:border-primary/50 hover:bg-muted/50'
                                                }`}
                                            onClick={() => setSelectedService(service)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Scissors className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-semibold text-base">
                                                                {service.name}
                                                            </h4>
                                                            {service.description && (
                                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                                    {service.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            {service.category}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {service.duration} daqiqa
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Banknote className="w-3 h-3" />
                                                            {service.price.toLocaleString()} so'm
                                                        </div>
                                                    </div>
                                                </div>

                                                {selectedService?.id === service.id && (
                                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {selectedService && (
                                    <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-background">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setSelectedService(null)}
                                        >
                                            Bekor qilish
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() => setIsConfirming(true)}
                                        >
                                            Davom etish
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-background rounded-lg">
                                    <Scissors className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{selectedService!.name}</h4>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {selectedService!.duration} daqiqa
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Banknote className="w-3 h-3" />
                                            {selectedService!.price.toLocaleString()} so'm
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date and Time Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sana</label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Vaqt</label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">To'lov turi</label>
                            <div className="grid grid-cols-3 gap-2">
                                <div
                                    className={`border rounded-lg p-3 cursor-pointer text-center hover:bg-muted/50 transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <Banknote className="w-5 h-5 mx-auto mb-1 text-green-600" />
                                    <div className="text-xs font-medium">Naqd</div>
                                </div>
                                <div
                                    className={`border rounded-lg p-3 cursor-pointer text-center hover:bg-muted/50 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                    <div className="text-xs font-medium">Karta</div>
                                </div>
                                <div
                                    className={`border rounded-lg p-3 cursor-pointer text-center hover:bg-muted/50 transition-colors ${paymentMethod === 'coin' ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''}`}
                                    onClick={() => setPaymentMethod('coin')}
                                >
                                    <Coins className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                                    <div className="text-xs font-medium">Coin</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Mijoz:</span>
                                <span className="font-medium">{clientName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Xizmat:</span>
                                <span className="font-medium">{selectedService!.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Vaqt:</span>
                                <span className="font-medium">{date} | {time}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">To'lov:</span>
                                <span className="font-medium capitalize">{paymentMethod === 'cash' ? 'Naqd' : paymentMethod === 'card' ? 'Karta' : 'Coin'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-2 mt-2">
                                <span className="text-muted-foreground">Jami:</span>
                                <span className="font-bold text-green-600">
                                    {selectedService!.price.toLocaleString()} so'm
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setIsConfirming(false)}
                            >
                                Orqaga
                            </Button>

                            {/* Actions based on context */}
                            <div className="flex gap-2 flex-[2]">
                                <Button
                                    variant="secondary"
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    onClick={() => handleConfirm('draft')}
                                >
                                    <FileEdit className="w-4 h-4 mr-2" />
                                    Saqlash (Qoralama)
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleConfirm('completed')}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Tasdiqlash
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// Add necessary imports to the top of the file if they are missing.
// I see I used CreditCard, Coins which were not imported in the original file view, only Banknote.
// Need to update imports too.
