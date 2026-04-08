import { Bell, Calendar, Star, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

const BusinessInbox = () => {
    // Mock notifications
    const notifications = [
        {
            id: 1,
            title: "Yangi buyurtma!",
            message: "Aziza Rahimova 'Soch bo'yash' xizmatiga yozildi.",
            type: "booking",
            time: new Date().toISOString(),
            read: false
        },
        {
            id: 2,
            title: "Yangi sharh",
            message: "Mijoz sizga 5 yulduzli baho qoldirdi: 'Ajoyib xizmat!'",
            type: "review",
            time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            read: false
        },
        {
            id: 3,
            title: "Tizim xabari",
            message: "Sizning 'Premium' obunangiz 3 kundan keyin tugaydi.",
            type: "warning",
            time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            read: true
        },
        {
            id: 4,
            title: "Reyting oshdi",
            message: "Tabriklaymiz! Siz 'Ishonchli Hamkor' darajasiga yetdingiz.",
            type: "success",
            time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            read: true
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking': return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'review': return <Star className="w-5 h-5 text-amber-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
            default: return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-4">
            {/* Unread stats or filter could go here */}
            <div className="flex items-center justify-between px-1">
                <span className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} ta o'qilmagan</span>
                <span className="text-xs text-blue-600 font-medium cursor-pointer">Barchasini o'qilgan deb belgilash</span>
            </div>

            <ScrollArea className="h-[calc(100hv-200px)]">
                <div className="space-y-2">
                    {notifications.map((notif) => (
                        <Card
                            key={notif.id}
                            className={`p-4 border-l-4 transition-all hover:shadow-md ${notif.read ? "border-l-transparent opacity-80" : "border-l-blue-500 bg-blue-50/30"}`}
                        >
                            <div className="flex gap-4">
                                <div className={`p-2 rounded-full h-fit flex-shrink-0 ${notif.read ? "bg-gray-100" : "bg-white shadow-sm"}`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-sm font-semibold ${!notif.read && "text-blue-700"}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                            {format(new Date(notif.time), "HH:mm, d MMM", { locale: uz })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-snug">
                                        {notif.message}
                                    </p>
                                    {!notif.read && (
                                        <div className="pt-1">
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                                                Yangi
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default BusinessInbox;
