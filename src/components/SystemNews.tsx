import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getNews, NewsItem } from "@/data/newsData";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, ArrowRight, X } from "lucide-react";

/**
 * SystemNews component
 * Automatically shows a modal for "major" updates (type='feature') 
 * ensuring users see critical new features like the Gift System.
 */
const SystemNews = () => {
    const [open, setOpen] = useState(false);
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        // 1. Find the latest "feature" news
        const allNews = getNews();
        const latestFeature = allNews.find(n => n.type === 'feature');

        if (latestFeature) {
            // 2. Check if user has already seen this specific news item
            // In a real app, this would be stored in the DB (user_news_read table)
            // For demo, we use localStorage
            const seenNews = JSON.parse(localStorage.getItem('seen_system_news') || '[]');

            if (!seenNews.includes(latestFeature.id)) {
                // 3. Show modal
                setNewsItem(latestFeature);
                // Small delay for better UX
                const timer = setTimeout(() => setOpen(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        if (newsItem) {
            // Mark as seen
            const seenNews = JSON.parse(localStorage.getItem('seen_system_news') || '[]');
            if (!seenNews.includes(newsItem.id)) {
                seenNews.push(newsItem.id);
                localStorage.setItem('seen_system_news', JSON.stringify(seenNews));
            }
        }
    };

    if (!newsItem) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl">
                {/* Banner Image */}
                {newsItem.image_url && (
                    <div className="h-40 w-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img
                            src={newsItem.image_url}
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 z-20">
                            <span className="px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                Yangi
                            </span>
                            <h3 className="text-white font-bold text-xl leading-tight text-shadow">
                                {newsItem.title}
                            </h3>
                        </div>
                    </div>
                )}

                <div className={`p-6 ${!newsItem.image_url ? 'pt-10' : ''}`}>
                    {!newsItem.image_url && (
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                {newsItem.title}
                            </DialogTitle>
                        </DialogHeader>
                    )}

                    <DialogDescription className="text-base mt-2 text-foreground/80 leading-relaxed">
                        {newsItem.content}
                    </DialogDescription>

                    <div className="bg-muted/50 p-4 rounded-xl mt-4 border border-border">
                        <h4 className="font-semibold text-sm mb-1 text-foreground">Qisqacha:</h4>
                        <p className="text-sm text-muted-foreground">{newsItem.summary}</p>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-secondary/20 flex flex-row gap-2 justify-end">
                    <Button variant="ghost" onClick={handleClose}>
                        Yopish
                    </Button>
                    <Button onClick={handleClose} className="bg-primary hover:bg-primary/90 text-white gap-2">
                        Tushunarli <ArrowRight className="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SystemNews;
