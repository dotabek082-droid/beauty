import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, MoreVertical, Phone, Headphones, User, CheckCheck, Loader2, Search, Video, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// --- Types ---

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: Date;
    status: 'sent' | 'read';
}

interface Conversation {
    id: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    unreadCount: number;
    lastActive: string;
    messages: Message[];
}

// --- Mock Data ---

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: "c1",
        userName: "Malika Karimova",
        userAvatar: "/avatars/malika.jpg",
        lastMessage: "Rahmat, tushunarli.",
        unreadCount: 0,
        lastActive: "Online",
        messages: [
            {
                id: 'm1-1',
                text: "Assalomu alaykum! Menga to'lov bo'yicha yordam kerak edi.",
                sender: 'user',
                timestamp: new Date(Date.now() - 7200000), // 2 hours ago
                status: 'read'
            },
            {
                id: 'm1-2',
                text: "Va alaykum assalom, Malika! Qanday muammo yuzaga keldi?",
                sender: 'admin',
                timestamp: new Date(Date.now() - 7100000),
                status: 'read'
            },
            {
                id: 'm1-3',
                text: "Payme orqali to'lov qildim, lekin balansimga tushmadi.",
                sender: 'user',
                timestamp: new Date(Date.now() - 7000000),
                status: 'read'
            },
            {
                id: 'm1-4',
                text: "Tekshirib ko'ramiz. Iltimos chek raqamini yuboring.",
                sender: 'admin',
                timestamp: new Date(Date.now() - 6900000),
                status: 'read'
            },
            {
                id: 'm1-5',
                text: "Rahmat, tushunarli.",
                sender: 'user',
                timestamp: new Date(Date.now() - 600000), // 10 mins ago
                status: 'read'
            }
        ]
    },
    {
        id: "c2",
        userName: "Aziz Rahimov",
        userAvatar: "/avatars/aziz.jpg",
        lastMessage: "Ilovada xatolik chiqdi...",
        unreadCount: 2,
        lastActive: "5 daqiqa oldin",
        messages: [
            {
                id: 'm2-1',
                text: "Salom admin!",
                sender: 'user',
                timestamp: new Date(Date.now() - 1800000),
                status: 'read'
            },
            {
                id: 'm2-2',
                text: "Ilovada xatolik chiqdi, bron qilolmayapman.",
                sender: 'user',
                timestamp: new Date(Date.now() - 1750000),
                status: 'sent'
            }
        ]
    },
    {
        id: "c3",
        userName: "Guli Shop",
        userAvatar: "/avatars/guli.jpg",
        lastMessage: "Biznes akkaunt ochmoqchi edim.",
        unreadCount: 1,
        lastActive: "1 soat oldin",
        messages: [
            {
                id: 'm3-1',
                text: "Biznes akkaunt ochmoqchi edim. Shartlari qanday?",
                sender: 'user',
                timestamp: new Date(Date.now() - 36000000),
                status: 'sent'
            }
        ]
    }
];

const SupportChatPage = () => {
    const navigate = useNavigate();
    const { userRole } = useAuth(); // In real app, use this. For now, we simulate with local state.
    const [currentRole, setCurrentRole] = useState<'user' | 'admin'>('user'); // Manual toggle for demo

    // Admin State
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Client State (single view)
    const [clientMessages, setClientMessages] = useState<Message[]>([
        {
            id: 'demo-1',
            text: "Assalomu alaykum! BeautyFind qo'llab-quvvatlash xizmatiga xush kelibsiz. Sizga qanday yordam bera olamiz?",
            sender: 'admin',
            timestamp: new Date(Date.now() - 3600000),
            status: 'read'
        }
    ]);

    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial effect to handle role from context if needed, defaulting to manual toggle for this walkthrough
    useEffect(() => {
        // If userRole is actually set in context, sync it (optional for this demo as we want manual toggle)
        if (userRole === 'admin') setCurrentRole('admin');
    }, [userRole]);

    useEffect(() => {
        scrollToBottom();
    }, [clientMessages, selectedConvId, conversations, isTyping]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const formatTime = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // --- Actions ---

    const handleSelectConversation = (id: string) => {
        setSelectedConvId(id);
        setIsSidebarCollapsed(true);
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        if (currentRole === 'user') {
            // Client sending message
            const newMessage: Message = {
                id: `m-${Date.now()}`,
                text: inputText,
                sender: 'user',
                timestamp: new Date(),
                status: 'sent'
            };
            setClientMessages(prev => [...prev, newMessage]);
            setInputText("");

            // Auto-reply simulation for Client view
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const reply: Message = {
                    id: `r-${Date.now()}`,
                    text: "Murojaatingiz qabul qilindi. Tez orada operator javob beradi.",
                    sender: 'admin',
                    timestamp: new Date(),
                    status: 'read'
                };
                setClientMessages(prev => [...prev, reply]);
            }, 2000);

        } else {
            // Admin sending message
            if (!selectedConvId) return;

            const newMessage: Message = {
                id: `adm-${Date.now()}`,
                text: inputText,
                sender: 'admin',
                timestamp: new Date(),
                status: 'read'
            };

            setConversations(prev => prev.map(conv => {
                if (conv.id === selectedConvId) {
                    return {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        lastMessage: newMessage.text,
                        unreadCount: 0 // Admin replied, so it's read by definition (or logic can vary)
                    };
                }
                return conv;
            }));
            setInputText("");
        }
    };

    // Helper to get active messages list
    const activeMessages = currentRole === 'user'
        ? clientMessages
        : (conversations.find(c => c.id === selectedConvId)?.messages || []);

    const activeUser = currentRole === 'admin'
        ? conversations.find(c => c.id === selectedConvId)
        : null;

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header / Admin Sidebar Layout */}
            {currentRole === 'admin' ? (
                // ADMIN VIEW LAYOUT
                <div className="flex h-full">
                    {/* Sidebar List */}
                    <div className={`${isSidebarCollapsed ? 'w-20' : 'w-80'} border-r border-border bg-white flex flex-col hidden md:flex transition-all duration-300`}>
                        <div className={`border-b border-border bg-gray-50 flex items-center h-16 ${isSidebarCollapsed ? 'justify-center p-0' : 'justify-between p-4'}`}>
                            {!isSidebarCollapsed ? (
                                <>
                                    <h2 className="font-bold text-lg">Murojaatlar</h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(true)}>
                                        <ArrowLeft className="w-4 h-4 text-gray-500" />
                                    </Button>
                                </>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(false)}>
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </Button>
                            )}
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="px-4 py-2 border-b border-border bg-white">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input placeholder="Qidirish..." className="pl-9 bg-gray-50 border-gray-100" />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv.id)}
                                    className={`
                                        cursor-pointer hover:bg-gray-50 transition-colors 
                                        ${selectedConvId === conv.id ? 'bg-blue-50/60' : ''}
                                        ${isSidebarCollapsed ? 'p-3 flex justify-center py-4 border-b border-transparent' : 'p-4 flex gap-3 border-b border-gray-100'}
                                    `}
                                >
                                    <div className="relative">
                                        <Avatar className={`${isSidebarCollapsed ? 'h-10 w-10' : 'h-10 w-10'}`}>
                                            <AvatarImage src={conv.userAvatar} />
                                            <AvatarFallback>{conv.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {conv.unreadCount > 0 && isSidebarCollapsed && (
                                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    {!isSidebarCollapsed && (
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? 'text-black' : 'text-gray-700'}`}>
                                                    {conv.userName}
                                                </h4>
                                                {conv.unreadCount > 0 && (
                                                    <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Toggle Role Button for Demo */}
                        <div className="p-4 border-t border-border flex justify-center">
                            {!isSidebarCollapsed ? (
                                <Button variant="outline" className="w-full text-xs" onClick={() => setCurrentRole('user')}>
                                    <User className="w-3 h-3 mr-2" /> Switch to Client View
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={() => setCurrentRole('user')} title="Switch to Client View">
                                    <User className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Chat Area (Admin side) */}
                    <div className="flex-1 flex flex-col bg-gray-50/50">
                        {selectedConvId ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-16 border-b border-border bg-white px-4 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={activeUser?.userAvatar} />
                                            <AvatarFallback>{activeUser?.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-sm text-gray-900">{activeUser?.userName}</h3>
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                {activeUser?.lastActive}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-gray-500">
                                            <Phone className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                                    {activeMessages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm text-sm relative ${msg.sender === 'admin'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                                    }`}
                                            >
                                                <p className="leading-relaxed">{msg.text}</p>
                                                <span className={`text-[10px] mt-1 block text-right ${msg.sender === 'admin' ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-border">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                        <Input
                                            className="flex-1 bg-gray-50 border-gray-200"
                                            placeholder="Javob yozing..."
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                        />
                                        <Button type="submit" size="icon" disabled={!inputText.trim()}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <Headphones className="w-16 h-16 mb-4 opacity-20" />
                                <p>Suhbatni tanlang</p>
                            </div>
                        )}
                    </div>
                </div>

            ) : (
                // CLIENT VIEW LAYOUT (Original + Toggle)
                <>
                    <div className="flex items-center justify-between p-3 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-border">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            <Headphones className="w-5 h-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                                </div>
                                <div>
                                    <h1 className="text-sm font-bold text-foreground leading-none">Qo'llab-quvvatlash</h1>
                                    <p className="text-[10px] text-green-500 font-medium mt-1">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Demo Toggle */}
                        <Button variant="ghost" size="sm" className="text-xs text-primary bg-primary/10 hover:bg-primary/20 mr-2" onClick={() => setCurrentRole('admin')}>
                            Admin View
                        </Button>

                        <div className="flex gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                                        <MoreVertical className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setClientMessages([])}>Chatni tozalash</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Client Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30" ref={scrollRef}>
                        <div className="flex justify-center my-4">
                            <span className="text-[10px] bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">Bugun</span>
                        </div>
                        {clientMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-sm relative group ${msg.sender === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-card text-card-foreground rounded-tl-none border border-border/50'
                                        }`}
                                >
                                    <p className="leading-relaxed">{msg.text}</p>
                                    <div
                                        className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {formatTime(msg.timestamp)}
                                        {msg.sender === 'user' && (
                                            <span className={msg.status === 'read' ? 'text-blue-200' : ''}>
                                                <CheckCheck className="w-3 h-3" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Client Input */}
                    <div className="p-3 bg-card border-t border-border mb-[60px] md:mb-0">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground shrink-0 rounded-full hover:bg-muted">
                                <Paperclip className="w-5 h-5" />
                            </Button>
                            <Input
                                className="flex-1 bg-secondary/50 border-transparent focus-visible:bg-secondary focus-visible:ring-0 rounded-full px-4 h-10"
                                placeholder="Xabar yozing..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <Button type="submit" size="icon" disabled={!inputText.trim()} className="h-10 w-10 rounded-full shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                    <div className="md:hidden"><BottomNav /></div>
                </>
            )}
        </div>
    );
};

export default SupportChatPage;
