import {
    Gift,
    Calendar,
    Coins,
    Star,
    User,
    Shield,
    CreditCard,
    HelpCircle
} from "lucide-react";

export interface HelpCategory {
    id: string;
    title: string;
    icon: any;
    description: string;
    items: HelpItem[];
}

export interface HelpItem {
    id: string;
    question: string;
    answer: string;
}

export const helpCategories: HelpCategory[] = [
    {
        id: "promotions",
        title: "Aksiyalar",
        icon: Gift,
        description: "Yutuqli o'yinlar, chegirmalar va 1+1 aksiyalar bo'yicha qo'llanma",
        items: [
            {
                id: "p1",
                question: "Aksiyada qanday ishtirok etish mumkin?",
                answer: "Bosh sahifadagi 'Aksiyalar' bo'limiga o'ting, o'zingizga yoqqan aksiyani tanlang va 'Ishtirok etish' yoki 'Band qilish' tugmasini bosing. Shundan so'ng, ko'rsatmalarga amal qiling."
            },
            {
                id: "p2",
                question: "Lotereya o'yinlarida g'olib qanday aniqlanadi?",
                answer: "Lotereya g'oliblari maxsus algoritm yordamida tasodifiy tarzda aniqlanadi. O'yin tugaganidan so'ng, tizim avtomatik ravishda g'olibni e'lon qiladi va xabarnoma yuboradi."
            },
            {
                id: "p3",
                question: "Chegirmali aksiyalardan qanday foydalaniladi?",
                answer: "Chegirmali aksiya uchun ro'yxatdan o'tganingizda, sizga maxsus QR kod yoki ID raqam beriladi. Xizmatdan foydalanish vaqtida ushbu kodni salon administratoriga ko'rsatishingiz kerak."
            },
            {
                id: "p4",
                question: "1+1 aksiyasi nima degani?",
                answer: "1+1 aksiyasi shuni anglatadiki, siz bitta xizmat uchun to'lov qilasiz va ikkinchisini bepul yoki katta chegirma bilan olasiz. Bu odatda do'stingiz bilan kelganingizda amal qiladi."
            },
            {
                id: "p5",
                question: "Bepul xizmatlarni qanday olsa bo'ladi?",
                answer: "Ba'zi salonlar 'Bepul' turidagi aksiyalarni e'lon qilishi mumkin (masalan, model sifatida). Bunday aksiyalarga tezroq ro'yxatdan o'tish tavsiya etiladi, chunki joylar soni cheklangan bo'ladi."
            },
            {
                id: "p6",
                question: "Aksiya muddatini qayerdan ko'rish mumkin?",
                answer: "Har bir aksiya kartasida uning tugash vahti ko'rsatilgan. Muddat tugagandan so'ng, ushbu aksiyaga qo'shilish imkoniyati yopiladi."
            },
            {
                id: "p7",
                question: "Bir vaqtning o'zida nechta aksiyada qatnashish mumkin?",
                answer: "Siz xohlagancha aksiyada ishtirok etishingiz mumkin, lekin bir vaqtning o'zida bir xil vaqtga to'g'ri keladigan xizmatlarni band qila olmaysiz."
            },
            {
                id: "p8",
                question: "Yutgan sovg'amni qanday qilib olaman?",
                answer: "Agar siz yutuqli o'yinda g'olib bo'lsangiz, 'Mening yutuqlarim' bo'limida maxsus vaucher paydo bo'ladi. Shu vaucher bilan salon ma'muriyatiga murojaat qilasiz."
            },
            {
                id: "p9",
                question: "Aksiyada ishtirok etish bepulmi?",
                answer: "Ko'pchilik aksiyalarda ishtirok etish bepul. Faqatgina xizmat ko'rsatilgandan so'ng (agar u pullik bo'lsa) to'lov qilasiz. Lotereya ishtiroki shartlari har bir aksiya uchun alohida ko'rsatiladi."
            },
            {
                id: "p10",
                question: "Aksiyaga yozildim, lekin bora olmayman. Nima qilishim kerak?",
                answer: "'Mening buyurtmalarim' bo'limiga kirib, iloji boricha tezroq buyurtmani bekor qiling. Bu boshqa foydalanuvchilarga imkoniyat beradi va sizning ishonch reytingingizni saqlab qoladi."
            }
        ]
    },
    {
        id: "bookings",
        title: "Buyurtmalar",
        icon: Calendar,
        description: "Onlayn navbat, bekor qilish va tarix",
        items: [
            {
                id: "b1",
                question: "Qanday qilib navbatga yozilish mumkin?",
                answer: "Kerakli xizmatni yoki ustani toping, 'Band qilish' tugmasini bosing, taqvimdan bo'sh vaqtni tanlang va tasdiqlang."
            },
            {
                id: "b2",
                question: "Buyurtmani o'zgartirish yoki bekor qilish",
                answer: "Buyurtmalar bo'limida tegishli buyurtmani tanlab, 'Bekor qilish' yoki 'Vaqtni o'zgartirish' tugmasini bosishingiz mumkin. Eslatma: Jarima qoidalari qo'llanilishi mumkin."
            },
            {
                id: "b3",
                question: "Bekor qilish uchun jarima bormi?",
                answer: "Ha, agar buyurtmani belgilangan vaqtdan juda kech bekor qilsangiz, ishonch reytingingiz pasayishi yoki tangalaringizdan jarima yechib olinishi mumkin (-5 tanga)."
            },
            {
                id: "b4",
                question: "O'tmishdagi buyurtmalarni qanday ko'rish mumkin?",
                answer: "'Mening buyurtmalarim' sahifasida 'Tarix' yoki 'Yakunlangan' tabini tanlab, barcha eski buyurtmalaringizni ko'rishingiz mumkin."
            }
        ]
    },
    {
        id: "coins",
        title: "Tangalar",
        icon: Coins,
        description: "Keshbek, bonuslar va ularni ishlatish",
        items: [
            {
                id: "c1",
                question: "Tangalar nima va ular qanday ishlaydi?",
                answer: "Tangalar - bu ilova ichidagi bonus valyutasi. 1 Tanga = 1 So'm (yoki belgilangan kurs). Ularni yig'ib, xizmatlar uchun chegirma sifatida ishlatishingiz mumkin."
            },
            {
                id: "c2",
                question: "Tangalarni qanday ishlash mumkin?",
                answer: "Tangalarni har kuni ilovaga kirish (+1), xizmatlardan foydalanish (+0.5% keshbek), sharh qoldirish (+5) va do'stlarni taklif qilish orqali ishlashingiz mumkin."
            },
            {
                id: "c3",
                question: "Tangalarni pulga almashtirsa bo'ladimi?",
                answer: "Yo'q, tangalarni naqd pulga almashtirib bo'lmaydi. Ular faqat ilova hamkorlari xizmatlari uchun chegirma sifatida ishlatiladi."
            },
            {
                id: "c4",
                question: "Tangalarning amal qilish muddati bormi?",
                answer: "Odatda tangalar muddatsiz, lekin maxsus aksiyalar doirasida berilgan bonus tangalar ma'lum muddatdan keyin kuyishi mumkin."
            }
        ]
    },
    {
        id: "reviews",
        title: "Sharhlar",
        icon: Star,
        description: "Fikr bildirish va reyting tizimi",
        items: [
            {
                id: "r1",
                question: "Sharh qoldirish majburiy-mi?",
                answer: "Yo'q, lekin har bir sharh uchun sizga bonus tangalar beriladi va bu sizning ishonch reytingingizni oshiradi."
            },
            {
                id: "r2",
                question: "Salbiy sharhni o'chirish mumkinmi?",
                answer: "Sharhlar haqiqiy bo'lishi kerak. Agar sharh haqoratli bo'lmasa yoki qoidalarni buzmasa, u o'chirilmaydi. Biznes egasi sizning sharhingizga javob berishi mumkin."
            },
            {
                id: "r3",
                question: "Surat yuklash mumkinmi?",
                answer: "Ha, sharhingizga xizmat natijasi aks etgan suratlarni yuklashingiz mumkin. Bu boshqa foydalanuvchilar uchun juda foydali."
            }
        ]
    },
    {
        id: "profile",
        title: "Profil",
        icon: User,
        description: "Sozlamalar va shaxsiy ma'lumotlar",
        items: [
            {
                id: "pr1",
                question: "Ism yoki telefon raqamni o'zgartirish",
                answer: "Profil sozlamalariga kirib, 'Tahrirlash' tugmasi orqali shaxsiy ma'lumotlaringizni yangilashingiz mumkin."
            },
            {
                id: "pr2",
                question: "Tilni o'zgartirish",
                answer: "Sozlamalar bo'limida ilova tilini o'zbek, rus yoki ingliz tiliga o'zgartirish imkoniyati mavjud."
            },
            {
                id: "pr3",
                question: "Hisobni o'chirish",
                answer: "Agar hisobingizni butunlay o'chirmoqchi bo'lsangiz, 'Xavfsizlik' bo'limidan buni amalga oshirishingiz mumkin. Barcha ma'lumotlaringiz o'chib ketadi."
            }
        ]
    }
];
