import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Gift, Calendar, Star, Megaphone, Check, Trash2, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "booking" | "promo" | "review" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Buyurtma tasdiqlandi! ✅",
    message: "Gulnoza Beauty Salon sizning buyurtmangizni tasdiqladi. Sana: 20-yanvar, 14:00",
    time: "5 daqiqa oldin",
    isRead: false,
    actionUrl: "/bookings",
  },
  {
    id: "2",
    type: "promo",
    title: "Yangi aksiya! 🎁",
    message: "Nilufar Spa Center da bepul yuz parvarishi! Tez ro'yxatdan o'ting!",
    time: "1 soat oldin",
    isRead: false,
    actionUrl: "/",
  },
  {
    id: "3",
    type: "review",
    title: "Sharhingizga javob berildi",
    message: "Baraka Beauty Studio sizning sharhingizga javob berdi: 'Rahmat! Yana kutamiz!'",
    time: "3 soat oldin",
    isRead: false,
    actionUrl: "/profile/reviews",
  },
  {
    id: "4",
    type: "system",
    title: "Promo kod oldinz! 🎉",
    message: "SARTAROSH20 - 20% chegirma kodi aktivlashtirildi. Keyingi buyurtmada foydalaning!",
    time: "1 kun oldin",
    isRead: true,
  },
  {
    id: "5",
    type: "booking",
    title: "Eslatma: Buyurtma ertaga",
    message: "Ertaga soat 10:30 da Baraka Beauty Studio da sizni kutamiz!",
    time: "1 kun oldin",
    isRead: true,
    actionUrl: "/bookings",
  },
  {
    id: "6",
    type: "promo",
    title: "Siz g'olib bo'ldingiz! 🏆",
    message: "Tabriklaymiz! Zebra Salon aksiyasida g'olib bo'ldingiz. Bepul xizmat sizniki!",
    time: "2 kun oldin",
    isRead: true,
    actionUrl: "/my-registrations",
  },
  {
    id: "7",
    type: "system",
    title: "Ilovani yangilang",
    message: "Yangi versiya chiqdi! Yangi funksiyalar va tuzatishlar qo'shildi.",
    time: "3 kun oldin",
    isRead: true,
  },
];

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return Calendar;
      case "promo":
        return Gift;
      case "review":
        return Star;
      default:
        return Megaphone;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return "bg-blue-500/10 text-blue-500";
      case "promo":
        return "bg-primary/10 text-primary";
      case "review":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("Barcha bildirishnomalar o'qilgan deb belgilandi");
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Bildirishnoma o'chirildi");
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const allNotifications = notifications;
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between p-4 safe-top">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bildirishnomalar</h1>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} ta yangi` : "Yangi bildirishnoma yo'q"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-1" />
              Barchasini o'qilgan qilish
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              Barchasi ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              O'qilmagan ({unreadNotifications.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="px-4 pt-4 space-y-3">
          <NotificationList
            notifications={allNotifications}
            onNotificationClick={handleNotificationClick}
            onDelete={handleDelete}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
          />
        </TabsContent>

        <TabsContent value="unread" className="px-4 pt-4 space-y-3">
          {unreadNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Hammasi o'qilgan</h3>
              <p className="text-sm text-muted-foreground">Yangi bildirishnomalar yo'q</p>
            </Card>
          ) : (
            <NotificationList
              notifications={unreadNotifications}
              onNotificationClick={handleNotificationClick}
              onDelete={handleDelete}
              getTypeIcon={getTypeIcon}
              getTypeColor={getTypeColor}
            />
          )}
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onDelete: (id: string) => void;
  getTypeIcon: (type: Notification["type"]) => React.ElementType;
  getTypeColor: (type: Notification["type"]) => string;
}

const NotificationList = ({
  notifications,
  onNotificationClick,
  onDelete,
  getTypeIcon,
  getTypeColor,
}: NotificationListProps) => {
  return (
    <AnimatePresence mode="popLayout">
      {notifications.map((notification, index) => {
        const TypeIcon = getTypeIcon(notification.type);
        return (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-colors hover:bg-secondary/50 ${
                !notification.isRead ? "bg-primary/5 border-primary/20" : ""
              }`}
              onClick={() => onNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                  <TypeIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-sm ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <Badge variant="default" className="text-xs flex-shrink-0">
                        Yangi
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2">{notification.time}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default NotificationsPage;
