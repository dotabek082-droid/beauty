import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Bell, Info, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNews, addNewsItem, deleteNewsItem, updateNewsItem, NewsItem } from "@/data/newsData";

const AdminNewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [type, setType] = useState<NewsItem['type']>('info');
    const [target, setTarget] = useState<NewsItem['target']>('all');
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = () => {
        setNews(getNews());
    };

    const handleOpenDialog = (item?: NewsItem) => {
        if (item) {
            setEditingItem(item);
            setTitle(item.title);
            setSummary(item.summary);
            setContent(item.content);
            setType(item.type);
            setTarget(item.target);
            setImageUrl(item.image_url || "");
        } else {
            setEditingItem(null);
            setTitle("");
            setSummary("");
            setContent("");
            setType('info');
            setTarget('all');
            setImageUrl("");
        }
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!title || !summary || !content) {
            toast.error("Iltimos, barcha maydonlarni to'ldiring");
            return;
        }

        const newsData = {
            title,
            summary,
            content,
            type,
            target,
            image_url: imageUrl || undefined
        };

        if (editingItem) {
            updateNewsItem(editingItem.id, newsData);
            toast.success("Yangilik yangilandi");
        } else {
            addNewsItem(newsData);
            toast.success("Yangilik qo'shildi");
        }

        setIsDialogOpen(false);
        loadNews();
    };

    const handleDelete = (id: string) => {
        if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
            deleteNewsItem(id);
            toast.success("Yangilik o'chirildi");
            loadNews();
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'feature': return <Sparkles className="w-4 h-4 text-purple-500" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tizim Yangiliklari</h1>
                    <p className="text-muted-foreground">Foydalanuvchilar uchun bildirishnomalar boshqaruvi</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yangilik qo'shish
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Barcha Yangiliklar</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sarlavha</TableHead>
                                <TableHead>Turi</TableHead>
                                <TableHead>Auditoriya</TableHead>
                                <TableHead>Sana</TableHead>
                                <TableHead className="text-right">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        Yangiliklar yo'q
                                    </TableCell>
                                </TableRow>
                            ) : (
                                news.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{item.title}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[300px]">{item.summary}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(item.type)}
                                                <span className="capitalize">{item.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {item.target === 'all' ? 'Barchaga' : item.target === 'business' ? 'Biznes' : 'Mijoz'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sarlavha</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yangilik sarlavhasi" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Turi</label>
                                <Select value={type} onValueChange={(val: any) => setType(val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Ma'lumot</SelectItem>
                                        <SelectItem value="warning">Ogohlantirish</SelectItem>
                                        <SelectItem value="success">Muvaffaqiyat</SelectItem>
                                        <SelectItem value="feature">Yangi imkoniyat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Auditoriya</label>
                                <Select value={target} onValueChange={(val: any) => setTarget(val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Barchaga</SelectItem>
                                        <SelectItem value="client">Mijozlarga</SelectItem>
                                        <SelectItem value="business">Bizneslarga</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Qisqacha mazmuni</label>
                            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Bildirishnomada ko'rinadigan qisqa matn" rows={2} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">To'liq matn</label>
                            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Batafsil ma'lumot (modal ichida ko'rinadi)" rows={5} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rasm URL (ixtiyoriy)</label>
                            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button>
                        <Button onClick={handleSave}>Saqlash</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminNewsPage;
