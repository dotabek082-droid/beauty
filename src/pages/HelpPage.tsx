import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  FileText,
  Shield,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { helpCategories, HelpCategory } from "@/data/helpData";

const HelpPage = () => {
  const navigate = useNavigate();
  const { isRole } = useAuth();
  const isAdmin = isRole("admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(helpCategories[0].id);

  const handleContactClick = (type: string) => {
    switch (type) {
      case "telegram":
        window.open("https://t.me/beautyfind_support", "_blank");
        break;
      case "phone":
        window.location.href = "tel:+998901234567";
        break;
      case "email":
        window.location.href = "mailto:support@beautyfind.uz";
        break;
      default:
        toast.info("Tez orada...");
    }
  };

  // Search Logic
  const allItems = helpCategories.flatMap(cat =>
    cat.items.map(item => ({ ...item, category: cat.title, categoryResult: cat }))
  );

  const filteredItems = allItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      {!isAdmin && (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="flex items-center gap-3 p-4 safe-top">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Yordam Markazi</h1>
              <p className="text-xs text-muted-foreground">Savollar va qo'llanmalar</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Savol yoki kalit so'zni yozing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-transparent focus:bg-background transition-colors"
          />
        </div>

        {/* Support Channels */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <Card
              className="p-3 text-center cursor-pointer hover:bg-secondary/50 transition-colors border-none shadow-sm bg-blue-50/50 dark:bg-blue-900/10"
              onClick={() => handleContactClick("telegram")}
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-[10px] font-medium text-blue-700 dark:text-blue-300">Telegram</p>
            </Card>
            <Card
              className="p-3 text-center cursor-pointer hover:bg-secondary/50 transition-colors border-none shadow-sm bg-green-50/50 dark:bg-green-900/10"
              onClick={() => handleContactClick("phone")}
            >
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-[10px] font-medium text-green-700 dark:text-green-300">Aloqa</p>
            </Card>
            <Card
              className="p-3 text-center cursor-pointer hover:bg-secondary/50 transition-colors border-none shadow-sm bg-orange-50/50 dark:bg-orange-900/10"
              onClick={() => handleContactClick("email")}
            >
              <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-[10px] font-medium text-orange-700 dark:text-orange-300">Email</p>
            </Card>
          </motion.div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {searchQuery ? (
            // Search Results View
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-muted-foreground px-1">
                Qidiruv natijalari ({filteredItems.length})
              </h3>

              {filteredItems.length === 0 ? (
                <div className="text-center py-10">
                  <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Hech narsa topilmadi</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="border rounded-xl px-3 bg-card shadow-sm">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="text-left">
                          <div className="text-[10px] text-primary font-medium mb-1 uppercase tracking-wider">
                            {item.category}
                          </div>
                          <span className="text-sm font-medium">{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-3 text-sm leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </motion.div>
          ) : (
            // Categories Tab View
            <motion.div
              key="tabs-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full h-auto flex-wrap justify-start gap-2 bg-transparent p-0 mb-6">
                  {helpCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeTab === category.id;
                    return (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                                    data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary
                                    ${!isActive ? 'bg-card border-border hover:bg-secondary' : ''}
                                `}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{category.title}</span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {helpCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="space-y-4 mt-0">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-4 px-1">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                          {category.title}
                          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {category.items.length} ta mavzu
                          </span>
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="space-y-2">
                        {category.items.map((item) => (
                          <AccordionItem key={item.id} value={item.id} className="border rounded-xl px-4 bg-card shadow-sm">
                            <AccordionTrigger className="hover:no-underline py-4 text-sm font-medium text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Links */}
        <div className="pt-8 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-3 justify-start px-4" onClick={() => toast.info("Foydalanish shartlari")}>
              <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-xs">Foydalanish shartlari</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 justify-start px-4" onClick={() => toast.info("Maxfiylik siyosati")}>
              <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-xs">Maxfiylik siyosati</span>
            </Button>
          </div>
          <div className="text-center mt-6">
            <p className="text-[10px] text-muted-foreground/50">BeautyFind v1.2.0 (Beta)</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HelpPage;
