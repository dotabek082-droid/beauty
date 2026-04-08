
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Users, Mail, Phone } from "lucide-react";

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link to="/landing" className="inline-flex items-center text-white/80 hover:text-white mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Orqaga
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Maxfiylik Siyosati</h1>
                            <p className="text-white/80">Oxirgi yangilangan: 1 Fevral 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-purple-600" />
                            Kirish
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            UzService ("biz", "bizning" yoki "Kompaniya") foydalanuvchilarimizning maxfiyligini muhim deb biladi.
                            Ushbu Maxfiylik Siyosati biz qanday ma'lumotlarni to'plashimiz, ulardan qanday foydalanishimiz va
                            ularni qanday himoya qilishimiz haqida tushuntiradi. Ilovamizdan foydalanish orqali siz ushbu
                            siyosatga rozilik bildirasiz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Database className="w-6 h-6 text-purple-600" />
                            To'planadigan Ma'lumotlar
                        </h2>
                        <div className="space-y-4 text-slate-600">
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-2">Shaxsiy ma'lumotlar:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>To'liq ism va familiya</li>
                                    <li>Telefon raqami</li>
                                    <li>Elektron pochta manzili</li>
                                    <li>Tug'ilgan sana</li>
                                    <li>Profil rasmi (ixtiyoriy)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-2">Texnik ma'lumotlar:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Qurilma turi va modeli</li>
                                    <li>Operatsion tizim versiyasi</li>
                                    <li>IP manzil</li>
                                    <li>Joylashuv ma'lumotlari (ruxsat bilan)</li>
                                    <li>Ilova foydalanish statistikasi</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-2">Tranzaksiya ma'lumotlari:</h3>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Bron qilish tarixi</li>
                                    <li>To'lov ma'lumotlari (oxirgi 4 raqam)</li>
                                    <li>Xizmat tarixi</li>
                                    <li>Sharhlar va baholar</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-purple-600" />
                            Ma'lumotlardan Foydalanish
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Biz to'plangan ma'lumotlardan quyidagi maqsadlarda foydalanamiz:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Xizmatlarimizni taqdim etish va yaxshilash</li>
                            <li>Foydalanuvchi hisobini boshqarish</li>
                            <li>Bron qilish va to'lovlarni qayta ishlash</li>
                            <li>Mijozlarga xizmat ko'rsatish</li>
                            <li>Shaxsiylashtirilgan tavsiyalar berish</li>
                            <li>Xavfsizlik va firibgarlikning oldini olish</li>
                            <li>Qonuniy talablarni bajarish</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-purple-600" />
                            Ma'lumotlarni Ulashish
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Biz shaxsiy ma'lumotlaringizni quyidagi hollarda ulashishimiz mumkin:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li><strong>Xizmat ko'rsatuvchilar bilan:</strong> Siz bron qilgan xizmatlarni bajarish uchun</li>
                            <li><strong>To'lov provayderlari bilan:</strong> Xavfsiz to'lovlarni amalga oshirish uchun</li>
                            <li><strong>Qonun talabi bo'yicha:</strong> Huquqiy majburiyatlarni bajarish uchun</li>
                            <li><strong>Sizning roziliğingiz bilan:</strong> Boshqa maqsadlar uchun faqat sizning roziliğingiz bilan</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Bell className="w-6 h-6 text-purple-600" />
                            Bildirishnomalar
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Biz sizga quyidagi bildirishnomalarni yuborishimiz mumkin: bron tasdiqlari, eslatmalar,
                            aksiya va chegirmalar, xizmat yangilanishlari. Siz ilovaning sozlamalar bo'limidan
                            bildirishnomalarni boshqarishingiz mumkin.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-purple-600" />
                            Ma'lumotlar Xavfsizligi
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Biz ma'lumotlaringizni himoya qilish uchun sanoat standartlariga mos keluvchi
                            xavfsizlik choralarini qo'llaymiz: SSL shifrlash, xavfsiz serverlar, muntazam
                            xavfsizlik tekshiruvlari va xodimlarning kirish huquqlarini cheklash.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Sizning Huquqlaringiz</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Siz quyidagi huquqlarga egasiz:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                            <li>Ma'lumotlaringizga kirish huquqi</li>
                            <li>Ma'lumotlarni tuzatish huquqi</li>
                            <li>Ma'lumotlarni o'chirish huquqi</li>
                            <li>Ma'lumotlarni ko'chirish huquqi</li>
                            <li>Rozilikni qaytarib olish huquqi</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Bolalar Maxfiyligi</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Ilovamiz 16 yoshdan kichik bolalar uchun mo'ljallanmagan. Biz bila turib
                            16 yoshdan kichik bolalardan shaxsiy ma'lumotlarni to'plamaymiz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">O'zgarishlar</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Biz ushbu Maxfiylik Siyosatini vaqti-vaqti bilan yangilashimiz mumkin.
                            Muhim o'zgarishlar haqida sizga ilova orqali xabar beramiz.
                        </p>
                    </section>

                    <section className="bg-purple-50 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Bog'lanish</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Maxfiylik siyosati bo'yicha savollaringiz bo'lsa, biz bilan bog'laning:
                        </p>
                        <div className="space-y-2 text-slate-600">
                            <p className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-600" />
                                privacy@uzservice.uz
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-purple-600" />
                                +998 71 200 00 00
                            </p>
                        </div>
                    </section>
                </div>

                <div className="text-center mt-8">
                    <Link to="/landing">
                        <Button variant="outline" className="rounded-full">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Bosh sahifaga qaytish
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
