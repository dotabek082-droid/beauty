
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, CreditCard, Shield, AlertTriangle, Scale, Phone, Mail } from "lucide-react";

const TermsOfServicePage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link to="/landing" className="inline-flex items-center text-white/80 hover:text-white mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Orqaga
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">Foydalanish Shartlari</h1>
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
                            <FileText className="w-6 h-6 text-indigo-600" />
                            1. Umumiy Qoidalar
                        </h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p>
                                Ushbu Foydalanish Shartlari ("Shartlar") UzService mobil ilovasi va veb-sayti
                                ("Platforma") dan foydalanish qoidalarini belgilaydi. Platformadan foydalanish
                                orqali siz ushbu Shartlarga rozilik bildirasiz.
                            </p>
                            <p>
                                UzService - O'zbekiston Respublikasi qonunlariga muvofiq ro'yxatdan o'tgan
                                "UzService Solutions" MChJ tomonidan boshqariladigan xizmatlar platformasi.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-indigo-600" />
                            2. Hisob Qaydnomasi
                        </h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>2.1.</strong> Platformadan foydalanish uchun siz 16 yoshdan katta bo'lishingiz kerak.</p>
                            <p><strong>2.2.</strong> Ro'yxatdan o'tishda to'g'ri va to'liq ma'lumotlarni taqdim etishingiz shart.</p>
                            <p><strong>2.3.</strong> Hisobingiz xavfsizligi uchun siz javobgarsiz. Parolingizni boshqalar bilan ulashmang.</p>
                            <p><strong>2.4.</strong> Hisobingizda shubhali faoliyat sezilsa, darhol bizga xabar bering.</p>
                            <p><strong>2.5.</strong> Bir shaxs faqat bitta hisob yaratishi mumkin.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-6 h-6 text-indigo-600" />
                            3. Xizmatlar va To'lovlar
                        </h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>3.1.</strong> Platforma orqali siz turli xizmat ko'rsatuvchilarning xizmatlarini bron qilishingiz mumkin.</p>
                            <p><strong>3.2.</strong> Xizmat narxlari xizmat ko'rsatuvchilar tomonidan belgilanadi va o'zgarishi mumkin.</p>
                            <p><strong>3.3.</strong> To'lovlar Payme, Click yoki boshqa tasdiqlanganolish to'lov tizimlari orqali amalga oshiriladi.</p>
                            <p><strong>3.4.</strong> Bron qilish tasdiqlangandan so'ng, bekor qilish siyosatiga muvofiq to'lov qaytariladi yoki qaytarilmaydi.</p>
                            <p><strong>3.5.</strong> Premium obuna avtomatik ravishda yangilanadi. Istasangiz, sozlamalardan bekor qilishingiz mumkin.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-indigo-600" />
                            4. Bekor Qilish Siyosati
                        </h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>4.1.</strong> Bronni xizmat vaqtidan 24 soat oldin bekor qilsangiz, to'liq to'lov qaytariladi.</p>
                            <p><strong>4.2.</strong> 12-24 soat orasida bekor qilsangiz, to'lovning 50% qaytariladi.</p>
                            <p><strong>4.3.</strong> 12 soatdan kam vaqt qolganda bekor qilsangiz, to'lov qaytarilmaydi.</p>
                            <p><strong>4.4.</strong> Xizmat ko'rsatuvchi tomonidan bekor qilingan bronlar uchun to'liq to'lov qaytariladi.</p>
                            <p><strong>4.5.</strong> Fors-major holatlarda alohida ko'rib chiqiladi.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-indigo-600" />
                            5. Foydalanuvchi Majburiyatlari
                        </h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p>Platformadan foydalanishda siz quyidagilarga rioya qilishingiz kerak:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>O'zbekiston Respublikasi qonunlariga rioya qilish</li>
                                <li>Boshqa foydalanuvchilar huquqlarini hurmat qilish</li>
                                <li>Noto'g'ri yoki yolg'on ma'lumot bermaslik</li>
                                <li>Platformani buzish yoki zarar yetkazish harakatlaridan tiyilish</li>
                                <li>Spam yoki keraksiz xabarlar yubormaslik</li>
                                <li>Xizmat ko'rsatuvchilarning mulkiga zarar yetkazmaslik</li>
                                <li>Kelishilgan vaqtda xizmatga kelish</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Xizmat Ko'rsatuvchilar</h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>6.1.</strong> Xizmat ko'rsatuvchilar mustaqil sub'yektlar bo'lib, UzService xodimlari emas.</p>
                            <p><strong>6.2.</strong> Biz xizmat sifatini nazorat qilishga harakat qilamiz, lekin xizmat ko'rsatuvchilarning harakatlari uchun to'liq javobgar emasmiz.</p>
                            <p><strong>6.3.</strong> Xizmat sifati bo'yicha shikoyatlar 48 soat ichida ko'rib chiqiladi.</p>
                            <p><strong>6.4.</strong> Qoidabuzar xizmat ko'rsatuvchilar platformadan chiqariladi.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Sharhlar va Reytinglar</h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>7.1.</strong> Faqat xizmatdan foydalangan foydalanuvchilar sharh qoldirishi mumkin.</p>
                            <p><strong>7.2.</strong> Sharhlar haqiqiy va adolatli bo'lishi kerak.</p>
                            <p><strong>7.3.</strong> Haqoratli, soxta yoki reklama xarakteridagi sharhlar o'chiriladi.</p>
                            <p><strong>7.4.</strong> Xizmat ko'rsatuvchilar sharhlarga javob berishi mumkin.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Tangalar va Keshbek</h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>8.1.</strong> Tangalar platforma ichida ishlatilishi mumkin va naqd pulga almashtirish mumkin emas.</p>
                            <p><strong>8.2.</strong> Keshbek faqat Premium obunachilarga beriladi.</p>
                            <p><strong>8.3.</strong> Foydalanilmagan tangalar 12 oy davomida amal qiladi.</p>
                            <p><strong>8.4.</strong> Firibgarlik orqali olingan tangalar bekor qilinadi.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Scale className="w-6 h-6 text-indigo-600" />
                            9. Javobgarlikni Cheklash
                        </h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>9.1.</strong> Platforma "boricha" taqdim etiladi. Biz xizmatning uzluksiz ishlashiga kafolat bermaymiz.</p>
                            <p><strong>9.2.</strong> Uchinchi shaxslar tomonidan yetkazilgan zarar uchun biz javobgar emasmiz.</p>
                            <p><strong>9.3.</strong> Bizning maksimal javobgarligimiz oxirgi 12 oy davomida siz to'lagan summadan oshmaydi.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Hisobni To'xtatish</h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>10.1.</strong> Biz quyidagi hollarda hisobingizni to'xtatish yoki o'chirish huquqiga egamiz:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Ushbu Shartlarni buzish</li>
                                <li>Firibgarlik harakatlari</li>
                                <li>Boshqa foydalanuvchilarga zarar yetkazish</li>
                                <li>Qonunga zid harakatlar</li>
                            </ul>
                            <p><strong>10.2.</strong> Siz istalgan vaqtda hisobingizni o'chirishingiz mumkin.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Nizolarni Hal Qilish</h2>
                        <div className="text-slate-600 leading-relaxed space-y-4">
                            <p><strong>11.1.</strong> Barcha nizolar avval muzokaralar orqali hal qilinishga harakat qilinadi.</p>
                            <p><strong>11.2.</strong> Hal bo'lmagan nizolar O'zbekiston Respublikasi sudlarida ko'rib chiqiladi.</p>
                            <p><strong>11.3.</strong> Ushbu Shartlarga O'zbekiston Respublikasi qonunlari qo'llaniladi.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. O'zgarishlar</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Biz ushbu Shartlarni istalgan vaqtda o'zgartirish huquqiga egamiz. Muhim o'zgarishlar
                            haqida sizga ilova orqali va elektron pochta orqali xabar beramiz. O'zgarishlardan
                            so'ng platformadan foydalanishni davom ettirsangiz, yangi shartlarga rozilik bildirgan
                            hisoblanasiz.
                        </p>
                    </section>

                    <section className="bg-indigo-50 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Bog'lanish</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Foydalanish shartlari bo'yicha savollaringiz bo'lsa, biz bilan bog'laning:
                        </p>
                        <div className="space-y-2 text-slate-600">
                            <p className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-indigo-600" />
                                legal@uzservice.uz
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-indigo-600" />
                                +998 71 200 00 00
                            </p>
                        </div>
                    </section>

                    <section className="border-t pt-6">
                        <p className="text-slate-500 text-sm text-center">
                            Ushbu Foydalanish Shartlarini qabul qilish orqali siz yuqoridagi barcha
                            qoidalarni o'qib chiqqaningizni va ularga rozilik bildirganingizni tasdiqlaysiz.
                        </p>
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

export default TermsOfServicePage;
