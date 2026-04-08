export interface GiftCertificate {
    id: string;
    code: string;
    amount: number;
    purchasedBy: string;
    purchasedByName: string;
    purchasedAt: Date;
    redeemedBy?: string;
    redeemedByName?: string;
    redeemedAt?: Date;
    status: 'active' | 'redeemed' | 'expired';
    expiresAt: Date;
    message?: string;
}

// Generate unique gift code
export function generateGiftCode(): string {
    const prefix = 'BEAUTY';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars
    let code = '';

    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${prefix}${code}`;
}

// Get all gift certificates from storage
function getAllCertificates(): GiftCertificate[] {
    const stored = localStorage.getItem('giftCertificates');
    if (!stored) return [];

    try {
        const certificates = JSON.parse(stored);
        // Convert date strings back to Date objects
        return certificates.map((cert: any) => ({
            ...cert,
            purchasedAt: new Date(cert.purchasedAt),
            redeemedAt: cert.redeemedAt ? new Date(cert.redeemedAt) : undefined,
            expiresAt: new Date(cert.expiresAt)
        }));
    } catch {
        return [];
    }
}

// Save all certificates to storage
function saveCertificates(certificates: GiftCertificate[]): void {
    localStorage.setItem('giftCertificates', JSON.stringify(certificates));
}

// Check if code already exists
function codeExists(code: string): boolean {
    const certificates = getAllCertificates();
    return certificates.some(cert => cert.code === code);
}

// Generate unique code (ensure no collisions)
export function generateUniqueGiftCode(): string {
    let code = generateGiftCode();
    let attempts = 0;

    while (codeExists(code) && attempts < 10) {
        code = generateGiftCode();
        attempts++;
    }

    if (attempts >= 10) {
        throw new Error('Failed to generate unique gift code');
    }

    return code;
}

// Purchase gift certificate
export function purchaseGiftCertificate(
    userId: string,
    userName: string,
    amount: number,
    message?: string
): GiftCertificate {
    const code = generateUniqueGiftCode();
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 90); // 90 days expiration

    const certificate: GiftCertificate = {
        id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        code,
        amount,
        purchasedBy: userId,
        purchasedByName: userName,
        purchasedAt: now,
        status: 'active',
        expiresAt,
        message
    };

    const certificates = getAllCertificates();
    certificates.push(certificate);
    saveCertificates(certificates);

    return certificate;
}

// Validate gift code
export function validateGiftCode(code: string): { valid: boolean; error?: string; certificate?: GiftCertificate } {
    const certificates = getAllCertificates();
    const certificate = certificates.find(cert => cert.code.toUpperCase() === code.toUpperCase());

    if (!certificate) {
        return { valid: false, error: 'Noto\'g\'ri kod. Iltimos, qaytadan tekshiring.' };
    }

    if (certificate.status === 'redeemed') {
        return { valid: false, error: 'Bu kod allaqachon ishlatilgan.' };
    }

    if (certificate.status === 'expired' || new Date() > certificate.expiresAt) {
        return { valid: false, error: 'Bu kodning amal qilish muddati tugagan.' };
    }

    return { valid: true, certificate };
}

// Redeem gift certificate
export function redeemGiftCertificate(
    code: string,
    userId: string,
    userName: string
): { success: boolean; error?: string; amount?: number; message?: string } {
    const validation = validateGiftCode(code);

    if (!validation.valid || !validation.certificate) {
        return { success: false, error: validation.error };
    }

    const certificate = validation.certificate;

    // Cannot redeem your own gift
    if (certificate.purchasedBy === userId) {
        return { success: false, error: 'O\'zingiz sotib olgan sovg\'ani ishlatib bo\'lmaydi.' };
    }

    // Update certificate status
    const certificates = getAllCertificates();
    const index = certificates.findIndex(cert => cert.id === certificate.id);

    if (index === -1) {
        return { success: false, error: 'Xatolik yuz berdi.' };
    }

    certificates[index] = {
        ...certificate,
        status: 'redeemed',
        redeemedBy: userId,
        redeemedByName: userName,
        redeemedAt: new Date()
    };

    saveCertificates(certificates);

    return {
        success: true,
        amount: certificate.amount,
        message: certificate.message
    };
}

// Get user's purchased certificates
export function getPurchasedCertificates(userId: string): GiftCertificate[] {
    const certificates = getAllCertificates();
    return certificates
        .filter(cert => cert.purchasedBy === userId)
        .sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime());
}

// Get user's redeemed certificates
export function getRedeemedCertificates(userId: string): GiftCertificate[] {
    const certificates = getAllCertificates();
    return certificates
        .filter(cert => cert.redeemedBy === userId)
        .sort((a, b) => (b.redeemedAt?.getTime() || 0) - (a.redeemedAt?.getTime() || 0));
}

// Check and update expired certificates
export function checkExpiredCertificates(): void {
    const certificates = getAllCertificates();
    const now = new Date();
    let updated = false;

    const updatedCertificates = certificates.map(cert => {
        if (cert.status === 'active' && now > cert.expiresAt) {
            updated = true;
            return { ...cert, status: 'expired' as const };
        }
        return cert;
    });

    if (updated) {
        saveCertificates(updatedCertificates);
    }
}

// Get certificate by code
export function getCertificateByCode(code: string): GiftCertificate | null {
    const certificates = getAllCertificates();
    return certificates.find(cert => cert.code.toUpperCase() === code.toUpperCase()) || null;
}
