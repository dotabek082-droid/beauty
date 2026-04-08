import { motion } from "framer-motion";
import { Users, Building2, Percent, MessageSquare, TrendingUp, Activity, Server, BarChart3, ChevronLeft, Coins, CreditCard, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "@/components/NotificationCenter";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Foydalanuvchilar", value: "1,234", icon: Users, color: "text-blue-500", bg: "bg-blue-100", path: "/admin/users" },
    { label: "Bizneslar", value: "56", icon: Building2, color: "text-purple-500", bg: "bg-purple-100", path: "/admin/businesses" },
    { label: "Aksiyalar", value: "12", icon: Percent, color: "text-green-500", bg: "bg-green-100", path: "/admin/promotions" },
    { label: "Promokodlar", value: "8", icon: BarChart3, color: "text-pink-500", bg: "bg-pink-100", path: "/admin/promocodes" },
    { label: "Tangalar Tarixi", value: "History", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-100", path: "/admin/coins" },
    { label: "Sharhlar", value: "89", icon: MessageSquare, color: "text-yellow-500", bg: "bg-yellow-100", path: "/admin/reviews" },
    { label: "Jami Tangalar", value: "1.2M", icon: Coins, color: "text-amber-500", bg: "bg-amber-100", path: "/admin/coins" },
    { label: "To'lovlar Tarixi", value: "12", icon: CreditCard, color: "text-teal-500", bg: "bg-teal-100", path: "/admin/payments" },
    { label: "Promokod Foydalanish", value: "10", icon: Tag, color: "text-violet-500", bg: "bg-violet-100", path: "/admin/promo-usage" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 safe-top bg-primary text-primary-foreground relative">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground hover:bg-primary-foreground/10 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-sm opacity-80 pl-10 -mt-1">Tizim holati va statistika</p>
        <div className="absolute top-4 right-4">
          <NotificationCenter />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(stat.path)}
              className={`cursor-pointer ${index === 6 ? 'col-span-2' : ''}`} // Make Jami Tangalar span full width
            >
              <Card className="p-4 hover:shadow-md transition-shadow flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* System Load */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Tizim Yuklamasi
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="font-medium text-green-600">24%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "24%" }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">RAM</span>
                  <span className="font-medium text-yellow-600">65%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-medium text-blue-600">42%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "42%" }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Growth Chart (Mock) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              O'sish Dinamikasi
            </h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
              {[35, 45, 30, 60, 75, 50, 85].map((h, i) => (
                <div key={i} className="w-full bg-primary/10 rounded-t-sm relative group">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="w-full bg-primary absolute bottom-0 rounded-t-sm group-hover:bg-primary/80 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              So'nggi Faollik
            </h3>
            <div className="space-y-4">
              {[
                { text: "Yangi biznes ro'yxatdan o'tdi", time: "2 daqiqa oldin", type: "business" },
                { text: "Yangi aksiya yaratildi", time: "15 daqiqa oldin", type: "promo" },
                { text: "15 ta yangi foydalanuvchi", time: "1 soat oldin", type: "user" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'business' ? 'bg-purple-500' :
                    item.type === 'promo' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div >
  );
};

export default AdminDashboard;
