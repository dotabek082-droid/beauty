import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, QrCode, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const BusinessQRScannerPage = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(true);
    const [scannedData, setScannedData] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);

    // Simulated camera effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScanning) {
            // Just a visual pulse effect for the scanner frame
            interval = setInterval(() => {
                // Animation logic handled by CSS usually
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isScanning]);

    const handleSimulateScan = () => {
        setIsProcessing(true);
        setIsScanning(false);

        // Simulate API delay
        setTimeout(() => {
            const mockBooking = {
                id: "bk-123456",
                clientName: "Malika Karimova",
                service: "Soch turmaklash",
                time: "14:30 Bugun",
                paymentStatus: "paid",
                paymentMethod: "click",
                price: 150000,
                status: "valid"
            };

            setScannedData(mockBooking);
            setIsProcessing(false);
        }, 1500);
    };

    const handleVerify = (isValid: boolean) => {
        setIsProcessing(true);
        setTimeout(() => {
            setVerificationStatus(isValid ? 'success' : 'error');
            setIsProcessing(false);
        }, 1000);
    };

    const resetScanner = () => {
        setVerificationStatus(null);
        setScannedData(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-black/50 backdrop-blur-sm fixed top-0 w-full z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => navigate('/profile')}
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="text-lg font-semibold">QR Kodni skanerlash</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Scanner View */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                {isScanning ? (
                    <>
                        <div className="relative w-72 h-72 border-2 border-white/50 rounded-lg overflow-hidden">
                            <div className="absolute inset-0 border-2 border-primary animate-pulse rounded-lg"></div>
                            {/* Scanning line animation */}
                            <div className="absolute w-full h-0.5 bg-primary top-0 animate-[scan_2s_ease-in-out_infinite]"></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <QrCode className="w-16 h-16 text-white/20" />
                            </div>
                        </div>
                        <p className="mt-8 text-white/70 text-center px-6">
                            Mijozning QR kodini kameraga yuting
                        </p>

                        <Button
                            className="mt-12 bg-white text-black hover:bg-white/90"
                            onClick={handleSimulateScan}
                        >
                            <Camera className="mr-2 w-4 h-4" />
                            Simulyatsiya qilish
                        </Button>
                    </>
                ) : (
                    /* This empty state is just placeholder while modal opens */
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="mt-4 text-sm">Ma'lumotlar tekshirilmoqda...</p>
                    </div>
                )}
            </div>

            {/* Result Dialog */}
            <Dialog open={!!scannedData} onOpenChange={(open) => !open && resetScanner()}>
                <DialogContent className="sm:max-w-md bg-white text-black border-none">
                    {!verificationStatus ? (
                        <div className="flex flex-col items-center pt-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <QrCode className="w-8 h-8 text-primary" />
                            </div>

                            <h2 className="text-xl font-bold mb-1">{scannedData?.clientName}</h2>
                            <p className="text-muted-foreground mb-6">Buyurtma topildi</p>

                            <div className="w-full space-y-3 bg-gray-50 p-4 rounded-xl mb-6">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground text-sm">Xizmat:</span>
                                    <span className="font-semibold">{scannedData?.service}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground text-sm">Vaqt:</span>
                                    <span className="font-semibold">{scannedData?.time}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-muted-foreground text-sm">Narx:</span>
                                    <span className="font-semibold">{scannedData?.price?.toLocaleString()} so'm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground text-sm">To'lov:</span>
                                    <span className="font-semibold text-green-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {scannedData?.paymentStatus === 'paid' ? "To'langan" : "Kutilmoqda"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full">
                                <Button
                                    variant="outline"
                                    className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                    onClick={() => handleVerify(false)}
                                    disabled={isProcessing}
                                >
                                    Bekor qilish
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleVerify(true)}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tasdiqlash"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-8 text-center animate-in zoom-in-95 duration-200">
                            {verificationStatus === 'success' ? (
                                <>
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-2">Tasdiqlandi!</h2>
                                    <p className="text-gray-500 mb-6">Mijoz kelishi muvaffaqiyatli qayd etildi.</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                        <XCircle className="w-12 h-12 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-red-700 mb-2">Rad etildi</h2>
                                    <p className="text-gray-500 mb-6">Buyurtma bekor qilindi yoki xatolik yuz berdi.</p>
                                </>
                            )}

                            <Button className="w-full" onClick={resetScanner}>
                                Yangi skanerlash
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default BusinessQRScannerPage;
