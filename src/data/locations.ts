
export interface Region {
  id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export interface District {
  id: number;
  region_id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export interface Street {
  id: number;
  district_id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export const REGIONS: Region[] = [
  { id: 1, name_uz: "Toshkent shahri", name_ru: "Ташкент город", name_en: "Tashkent city" },
  { id: 2, name_uz: "Toshkent viloyati", name_ru: "Ташкентская область", name_en: "Tashkent region" },
  { id: 3, name_uz: "Samarqand viloyati", name_ru: "Самаркандская область", name_en: "Samarkand region" },
  { id: 4, name_uz: "Buxoro viloyati", name_ru: "Бухарская область", name_en: "Bukhara region" },
  { id: 5, name_uz: "Andijon viloyati", name_ru: "Андижанская область", name_en: "Andijan region" },
  { id: 6, name_uz: "Farg'ona viloyati", name_ru: "Ферганская область", name_en: "Fergana region" },
  { id: 7, name_uz: "Namangan viloyati", name_ru: "Наманганская область", name_en: "Namangan region" },
  { id: 8, name_uz: "Qashqadaryo viloyati", name_ru: "Кашкадарьинская область", name_en: "Kashkadarya region" },
  { id: 9, name_uz: "Surxondaryo viloyati", name_ru: "Сурхандарьинская область", name_en: "Surkhandarya region" },
  { id: 10, name_uz: "Jizzax viloyati", name_ru: "Джизакская область", name_en: "Jizzakh region" },
  { id: 11, name_uz: "Sirdaryo viloyati", name_ru: "Сырдарьинская область", name_en: "Sirdarya region" },
  { id: 12, name_uz: "Xorazm viloyati", name_ru: "Хорезмская область", name_en: "Khorezm region" },
  { id: 13, name_uz: "Navoiy viloyati", name_ru: "Навоийская область", name_en: "Navoi region" },
  { id: 14, name_uz: "Qoraqalpog'iston Respublikasi", name_ru: "Республика Каракалпакстан", name_en: "Karakalpakstan" },
];

export const DISTRICTS: District[] = [
  // Toshkent shahri (region_id: 1)
  { id: 1, region_id: 1, name_uz: "Bektemir", name_ru: "Бектемир", name_en: "Bektemir" },
  { id: 2, region_id: 1, name_uz: "Chilonzor", name_ru: "Чиланзар", name_en: "Chilanzar" },
  { id: 3, region_id: 1, name_uz: "Yakkasaroy", name_ru: "Яккасарай", name_en: "Yakkasaray" },
  { id: 4, region_id: 1, name_uz: "Yunusobod", name_ru: "Юнусабад", name_en: "Yunusabad" },
  { id: 5, region_id: 1, name_uz: "Mirzo Ulug'bek", name_ru: "Мирзо Улугбек", name_en: "Mirzo Ulugbek" },
  { id: 6, region_id: 1, name_uz: "Mirobod", name_ru: "Мирабад", name_en: "Mirabad" },
  { id: 7, region_id: 1, name_uz: "Sirg'ali", name_ru: "Сергели", name_en: "Sergeli" },
  { id: 8, region_id: 1, name_uz: "Olmazor", name_ru: "Алмазар", name_en: "Almazar" },
  { id: 9, region_id: 1, name_uz: "Shayxontohur", name_ru: "Шайхантахур", name_en: "Shaykhantahur" },
  { id: 10, region_id: 1, name_uz: "Uchtepa", name_ru: "Учтепа", name_en: "Uchtepa" },
  { id: 11, region_id: 1, name_uz: "Yashnobod", name_ru: "Яшнабад", name_en: "Yashnabad" },
  { id: 12, region_id: 1, name_uz: "Yangihayot", name_ru: "Янгихаят", name_en: "Yangihayat" },

  // Toshkent viloyati (region_id: 2)
  { id: 13, region_id: 2, name_uz: "Angren", name_ru: "Ангрен", name_en: "Angren" },
  { id: 14, region_id: 2, name_uz: "Chirchiq", name_ru: "Чирчик", name_en: "Chirchik" },
  { id: 15, region_id: 2, name_uz: "Olmaliq", name_ru: "Алмалык", name_en: "Almalyk" },
  { id: 16, region_id: 2, name_uz: "Bekobod", name_ru: "Бекабад", name_en: "Bekabad" },
  { id: 17, region_id: 2, name_uz: "Zangiota", name_ru: "Зангиата", name_en: "Zangiata" },

  // Samarqand viloyati (region_id: 3)
  { id: 18, region_id: 3, name_uz: "Samarqand shahri", name_ru: "Самарканд город", name_en: "Samarkand city" },
  { id: 19, region_id: 3, name_uz: "Urgut", name_ru: "Ургут", name_en: "Urgut" },
  { id: 20, region_id: 3, name_uz: "Kattaqo'rg'on", name_ru: "Каттакурган", name_en: "Kattakurgan" },

  // Buxoro viloyati (region_id: 4)
  { id: 21, region_id: 4, name_uz: "Buxoro shahri", name_ru: "Бухара город", name_en: "Bukhara city" },
  { id: 22, region_id: 4, name_uz: "Kogon", name_ru: "Каган", name_en: "Kagan" },

  // Andijon viloyati (region_id: 5)
  { id: 23, region_id: 5, name_uz: "Andijon shahri", name_ru: "Андижан город", name_en: "Andijan city" },
  { id: 24, region_id: 5, name_uz: "Asaka", name_ru: "Асака", name_en: "Asaka" },
];

export const STREETS: Street[] = [
  // Chilonzor (district_id: 2)
  { id: 1, district_id: 2, name_uz: "Bunyodkor ko'chasi", name_ru: "Улица Бунёдкор", name_en: "Bunyodkor Street" },
  { id: 2, district_id: 2, name_uz: "Chilonzor ko'chasi", name_ru: "Улица Чиланзар", name_en: "Chilanzar Street" },
  { id: 3, district_id: 2, name_uz: "Qatortol ko'chasi", name_ru: "Улица Катартал", name_en: "Katartal Street" },

  // Yakkasaroy (district_id: 3)
  { id: 4, district_id: 3, name_uz: "Bobur ko'chasi", name_ru: "Улица Бабура", name_en: "Babur Street" },
  { id: 5, district_id: 3, name_uz: "Shota Rustaveli ko'chasi", name_ru: "Улица Шота Руставели", name_en: "Shota Rustaveli Street" },

  // Yunusobod (district_id: 4)
  { id: 6, district_id: 4, name_uz: "Amir Temur ko'chasi", name_ru: "Улица Амира Темура", name_en: "Amir Temur Street" },
  { id: 7, district_id: 4, name_uz: "Yunusobod ko'chasi", name_ru: "Улица Юнусабад", name_en: "Yunusabad Street" },
  { id: 8, district_id: 4, name_uz: "Bog'ishamol ko'chasi", name_ru: "Улица Богишамал", name_en: "Bogishamol Street" },

  // Mirzo Ulug'bek (district_id: 5)
  { id: 9, district_id: 5, name_uz: "Navoiy ko'chasi", name_ru: "Улица Навои", name_en: "Navoi Street" },
  { id: 10, district_id: 5, name_uz: "Buyuk Ipak Yo'li ko'chasi", name_ru: "Улица Великого Шелкового Пути", name_en: "Great Silk Road Street" },

  // Mirobod (district_id: 6)
  { id: 11, district_id: 6, name_uz: "Istiqbol ko'chasi", name_ru: "Улица Истикбол", name_en: "Istiqbol Street" },
  { id: 12, district_id: 6, name_uz: "Afrosiyob ko'chasi", name_ru: "Улица Афросиаб", name_en: "Afrosiyob Street" },

  // Bektemir (district_id: 1)
  { id: 13, district_id: 1, name_uz: "Bektemir ko'chasi", name_ru: "Улица Бектемир", name_en: "Bektemir Street" },

  // Sirg'ali (district_id: 7)
  { id: 14, district_id: 7, name_uz: "Sirg'ali ko'chasi", name_ru: "Улица Сергели", name_en: "Sergeli Street" },

  // Olmazor (district_id: 8)
  { id: 15, district_id: 8, name_uz: "Olmazor ko'chasi", name_ru: "Улица Алмазар", name_en: "Almazar Street" },

  // Shayxontohur (district_id: 9)
  { id: 16, district_id: 9, name_uz: "Navoi ko'chasi", name_ru: "Улица Навои", name_en: "Navoi Street" },
  { id: 17, district_id: 9, name_uz: "Zarqaynar ko'chasi", name_ru: "Улица Заркайнар", name_en: "Zarkaynar Street" },

  // Samarqand shahri (district_id: 18)
  { id: 18, district_id: 18, name_uz: "Registon ko'chasi", name_ru: "Улица Регистан", name_en: "Registan Street" },
  { id: 19, district_id: 18, name_uz: "Ulug'bek ko'chasi", name_ru: "Улица Улугбека", name_en: "Ulugbek Street" },

  // Buxoro shahri (district_id: 21)
  { id: 20, district_id: 21, name_uz: "Ismoil Somoniy ko'chasi", name_ru: "Улица Исмаила Самани", name_en: "Ismail Samani Street" },

  // Andijon shahri (district_id: 23)
  { id: 21, district_id: 23, name_uz: "Bobur ko'chasi", name_ru: "Улица Бабура", name_en: "Babur Street" },
];

// Helper functions to filter by parent
export const getDistrictsByRegion = (regionId: number): District[] =>
  DISTRICTS.filter(d => d.region_id === regionId);

export const getStreetsByDistrict = (districtId: number): Street[] =>
  STREETS.filter(s => s.district_id === districtId);
