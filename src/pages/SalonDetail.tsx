import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Clock, Phone, Heart, Share2, ChevronLeft, Calendar, Check, X, Users, Image, Wrench, Info, MessageSquare, ThumbsUp, Verified, Gift, Ticket, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { mockBusinesses } from "@/data/businessData";
import { getCategoryById } from "@/data/categories";
import { mockPromotions, Promotion } from "@/data/promotionData";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import PromotionCard from "@/components/PromotionCard";
import PromotionBookingModal from "@/components/PromotionBookingModal";
import ServiceBookingModal from "@/components/ServiceBookingModal";
import BusinessReviews from "@/components/BusinessReviews";
import { useDiscount } from "@/contexts/DiscountContext";
import { useAuth } from "@/contexts/AuthContext";
import EditProfileDialog from "@/components/business/EditProfileDialog";
import ServiceEditDialog from "@/components/business/ServiceEditDialog";
import AmenitiesEditDialog from "@/components/business/AmenitiesEditDialog";
import PhotoGalleryEditDialog from "@/components/business/PhotoGalleryEditDialog";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

const SalonDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { hasActiveDiscount, applyDiscount } = useDiscount();
  const { user } = useAuth();
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Edit States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isServiceEditOpen, setIsServiceEditOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null); // Use proper type if available
  const [isAmenitiesEditOpen, setIsAmenitiesEditOpen] = useState(false);
  const [isGalleryEditOpen, setIsGalleryEditOpen] = useState(false);

  // Salon Photos State
  const [salonPhotos, setSalonPhotos] = useState<string[]>(() => {
    const stored = localStorage.getItem(`salon_photos_${id}`);
    return stored ? JSON.parse(stored) : [
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=60"
    ];
  });
  const [isSalonGalleryEditOpen, setIsSalonGalleryEditOpen] = useState(false);

  // Get business from mockBusinesses
  const business = mockBusinesses.find(b => b.id === id);

  // Check ownership (Simulated for this task based on URL or user role if available)
  // For demo: if URL includes 'biz-2', we treat current user as owner
  const isOwner = user && (id === 'biz-2' || business?.ownerId === user.id);

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Biznes topilmadi</h2>
          <Button onClick={() => navigate("/")}>Bosh sahifaga qaytish</Button>
        </div>
      </div>
    );
  }

  const category = getCategoryById(business.category);

  // Get promotions for this business
  const businessPromotions = mockPromotions.filter(p => p.salonId === id && p.isActive);

  // Check if business is open now
  const isOpenNow = () => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()];
    const hours = business.hours[currentDay];

    if (!hours || hours.closed) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  // Get today's hours
  const getTodayHours = () => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[new Date().getDay()];
    const hours = business.hours[currentDay];
    if (!hours || hours.closed) return "Yopiq";
    return `${hours.open} - ${hours.close}`;
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('uz-UZ', { weekday: 'short' }),
      date: date.getDate(),
      full: date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' }),
    };
  });

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleBook = () => {
    setShowBooking(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Удалено из избранного" : "Добавлено в избранное");
  };

  const handleBookPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsPromotionModalOpen(true);
  };

  const handleClosePromotionModal = () => {
    setIsPromotionModalOpen(false);
    setSelectedPromotion(null);
  };

  const handleSaveSalonPhotos = async (newPhotos: string[]) => {
    setSalonPhotos(newPhotos);
    localStorage.setItem(`salon_photos_${id}`, JSON.stringify(newPhotos));
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-72">
        <img
          src={business.photos[0]}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between safe-top">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Main Info Card */}
        <Card variant="elevated" className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">{business.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm font-semibold text-foreground">{business.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({business.reviewCount} ta sharh)</span>
                <span className="text-sm font-medium text-muted-foreground">{business.priceRange}</span>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${isOpenNow() ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
              {isOpenNow() ? 'Ochiq' : 'Yopiq'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{business.address.street}, {business.address.neighborhood}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{getTodayHours()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{business.contact.phone}</span>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-secondary rounded-2xl">
            <TabsTrigger value="services" className="flex flex-col items-center gap-1 py-2 px-1 text-xs rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Calendar className="w-4 h-4" />
              <span>{category?.id === 'restaurants' ? 'Band qilish' : 'Xizmatlar'}</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex flex-col items-center gap-1 py-2 px-1 text-xs rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Info className="w-4 h-4" />
              <span>О нас</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex flex-col items-center gap-1 py-2 px-1 text-xs rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Отзывы</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex flex-col items-center gap-1 py-2 px-1 text-xs rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Image className="w-4 h-4" />
              <span>Работы</span>
            </TabsTrigger>
            <TabsTrigger value="room" className="flex flex-col items-center gap-1 py-2 px-1 text-xs rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Wrench className="w-4 h-4" />
              <span>Салон</span>
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-4">

            {business.services && business.services.length > 0 ? (
              <>
                {/* Discount Indicator */}
                {hasActiveDiscount && (
                  <Card className="p-3 mb-3 border-success/30 bg-success/5 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-success" />
                    <span className="text-sm text-success font-medium">20% chegirma barcha xizmatlarga qo'llaniladi!</span>
                  </Card>
                )}
                <div className="space-y-2">
                  {business.services.map((service, index) => {
                    const priceInfo = applyDiscount(service.price);
                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{service.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              {service.duration && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{service.duration} daqiqa</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            {hasActiveDiscount ? (
                              <div>
                                <p className="text-sm line-through text-muted-foreground">{service.price.toLocaleString()} so'm</p>
                                <p className="font-semibold text-success">{priceInfo.finalPrice.toLocaleString()} so'm</p>
                              </div>
                            ) : (
                              <div className="text-right">
                                {service.price > 0 ? (
                                  <>
                                    <p className="font-semibold text-foreground">{service.price.toLocaleString()} so'm</p>
                                    {category?.id === 'restaurants' && <p className="text-[10px] text-muted-foreground">Depozit</p>}
                                  </>
                                ) : (
                                  <p className="font-semibold text-success">Bepul</p>
                                )}
                              </div>
                            )}
                            <Button
                              variant="soft"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleSelectService(service)}
                            >
                              {category?.id === 'restaurants' ? 'Band qilish' : 'Tanlash'}
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Bu biznesda xizmatlar mavjud emas</p>
              </Card>
            )}
          </TabsContent>

          {/* About Us Tab */}
          <TabsContent value="about" className="mt-4 space-y-4">
            <Card className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  О салоне
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {business.description}
              </p>
            </Card>

            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="h-56 w-full z-0">
                <MapContainer
                  center={[business.location.lat, business.location.lng]}
                  zoom={15}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                  dragging={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[business.location.lat, business.location.lng]} />
                </MapContainer>
              </div>
              <div className="p-4 bg-card">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  {business.address.street}, {business.address.neighborhood}
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Xususiyatlar
                </h3>
              </div>
              <div className="space-y-3">
                {business.amenities.freeWifi && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Bepul Wi-Fi</p>
                  </div>
                )}
                {business.amenities.acceptsCreditCards && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Bank kartalari qabul qilinadi</p>
                  </div>
                )}
                {business.amenities.parking && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Parking mavjud</p>
                  </div>
                )}
                {business.amenities.wheelchairAccessible && (
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Nogironlar uchun qulay</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-4 space-y-4">
            <BusinessReviews
              businessId={business.id}
              businessRating={business.rating}
              reviewCount={business.reviewCount}
              isOwner={isOwner}
            />
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">Rasmlar</h3>
                <span className="text-sm text-muted-foreground">{business.photos.length} ta rasm</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {business.photos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(photo)}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img
                      src={photo}
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Service Room Tab */}
          <TabsContent value="room" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">Salon ko'rinishi</h3>
                <span className="text-sm text-muted-foreground">{salonPhotos.length} ta rasm</span>
              </div>
            </div>
            {salonPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {salonPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(photo)}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <img
                        src={photo}
                        alt="Salon interior"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Salon rasmlari hozircha yo'q</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Promotions Section */}
        {businessPromotions.length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-success" />
              Bepul xizmatlar
            </h3>
            <div className="space-y-3">
              {businessPromotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  onBook={handleBookPromotion}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowBooking(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background w-full rounded-t-3xl overflow-hidden flex flex-col"
              style={{ maxHeight: "70vh" }}
            >
              {/* Modal Header with Progress */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-foreground">Запись</h2>
                  <button onClick={() => setShowBooking(false)} className="p-1">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                {/* Progress Steps */}
                <div className="flex items-center gap-2">
                  {[
                    { label: "Услуга", done: !!selectedService },
                    { label: "Дата", done: !!selectedDate },
                    { label: "Время", done: !!selectedTime },
                  ].map((step, index) => (
                    <div key={index} className="flex-1 flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step.done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                        }`}>
                        {step.done ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <span className={`text-xs ${step.done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                      {index < 2 && <div className={`flex-1 h-0.5 ${step.done ? 'bg-primary' : 'bg-secondary'}`} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Service Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Xizmat</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {business.services && business.services.length > 0 ? (
                      business.services.map((service) => (
                        <motion.button
                          key={service.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedService(service)}
                          className={`p-3 rounded-xl text-left transition-all border ${selectedService?.id === service.id
                            ? 'bg-primary/10 border-primary'
                            : 'bg-secondary border-transparent'
                            }`}
                        >
                          <p className={`text-sm font-medium ${selectedService?.id === service.id ? 'text-primary' : 'text-foreground'}`}>
                            {service.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{service.price.toLocaleString()} so'm</p>
                        </motion.button>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 text-muted-foreground text-sm">
                        Xizmatlar mavjud emas
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sana</h3>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {dates.map((d, index) => (
                      <motion.button
                        key={index}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(d.full)}
                        className={`flex flex-col items-center min-w-[52px] py-2 px-3 rounded-xl transition-all ${selectedDate === d.full
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                          }`}
                      >
                        <span className="text-[10px] font-medium opacity-70">{d.day}</span>
                        <span className="text-base font-bold">{d.date}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Vaqt</h3>
                  <div className="grid grid-cols-5 gap-1.5">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${selectedTime === time
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                          }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Summary & Button */}
              <div className="p-4 border-t border-border bg-background">
                {selectedService && (
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <div className="text-muted-foreground">
                      <span className="text-foreground font-medium">{selectedService.name}</span>
                      {selectedDate && <span> • {selectedDate}</span>}
                      {selectedTime && <span> • {selectedTime}</span>}
                    </div>
                    <span className="font-bold text-foreground">{selectedService.price.toLocaleString()} so'm</span>
                  </div>
                )}
                <Button
                  variant="coral"
                  size="lg"
                  className="w-full"
                  onClick={handleBook}
                  disabled={!selectedService || !selectedDate || !selectedTime}
                >
                  <Check className="w-4 h-4" />
                  Подтвердить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 w-10 h-10 bg-background/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promotion Booking Modal */}
      <PromotionBookingModal
        promotion={selectedPromotion}
        isOpen={isPromotionModalOpen}
        onClose={handleClosePromotionModal}
      />

      {/* Service Booking Modal */}
      <ServiceBookingModal
        service={selectedService}
        salonName={business.name}
        isOpen={isServiceModalOpen}
        onClose={handleCloseServiceModal}
      />

      {/* Edit Dialogs */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      />

      <ServiceEditDialog
        open={isServiceEditOpen}
        onOpenChange={setIsServiceEditOpen}
        service={editingService}
        businessId={business.id}
        onSuccess={() => toast.success("Xizmat yangilandi")}
      />

      {/* Note: In a real app, amenities would be passed from a real data source, 
          here we just use default/mock for the dialog initial state if business.amenities is not perfectly matching 
      */}
      <AmenitiesEditDialog
        open={isAmenitiesEditOpen}
        onOpenChange={setIsAmenitiesEditOpen}
        amenities={business.amenities || { freeWifi: false, acceptsCreditCards: false, parking: false, wheelchairAccessible: false }}
        businessId={business.id}
        categoryId={business.category}
        onSuccess={() => toast.success("Xususiyatlar yangilandi")}
      />

      <PhotoGalleryEditDialog
        open={isGalleryEditOpen}
        onOpenChange={setIsGalleryEditOpen}
        photos={business.photos || []}
        businessId={business.id}
        onSuccess={() => toast.success("Galereya yangilandi")}
      />

      {/* Salon Photos Edit Dialog */}
      <PhotoGalleryEditDialog
        open={isSalonGalleryEditOpen}
        onOpenChange={setIsSalonGalleryEditOpen}
        photos={salonPhotos}
        businessId={business.id}
        onSuccess={() => toast.success("Salon rasmlari yangilandi")}
        onSave={handleSaveSalonPhotos}
      />

      <BottomNav />
    </div>
  );
};

export default SalonDetail;
