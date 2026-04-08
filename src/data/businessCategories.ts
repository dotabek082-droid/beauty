
export const BUSINESS_CATEGORIES = [
    {
        id: "beauty",
        label: "Go'zallik Saloni",
        subcategories: [
            { id: "hair_salon", label: "Hair Salons", specializations: ["Ayollar sochi", "Erkaklar sochi", "Bo'yash", "Keratin", "Baleraj", "Soch turmaklash"] },
            { id: "nail_salon", label: "Nail Salons", specializations: ["Manikyur", "Pedikyur", "Gel-lak", "Tirnoq o'stirish", "Dizayn"] },
            { id: "barbers", label: "Barbers", specializations: ["Soch olish", "Soqol olish", "Barbering", "Fading", "Black Mask"] },
            { id: "spas", label: "Spas", specializations: ["Massaj", "Yuz parvarishi", "Aromaterapiya", "Sauna", "Hammam"] },
            { id: "massage", label: "Massage", specializations: ["Klassik massaj", "Davolovchi massaj", "Sport massaji", "Relax"] },
        ]
    },
    {
        id: "gym",
        label: "Sport Zal",
        subcategories: [
            { id: "gyms", label: "Gyms" },
            { id: "yoga_pilates", label: "Yoga & Pilates" },
            { id: "sports_clubs", label: "Sports Clubs" },
        ]
    },
    {
        id: "spa_wellness",
        label: "SPA & Wellness",
        subcategories: [
            { id: "day_spas", label: "Day Spas" },
            { id: "wellness_centers", label: "Wellness Centers" },
            { id: "med_spas", label: "Medical Spas" },
        ]
    },
    {
        id: "clinic",
        label: "Klinika",
        subcategories: [
            { id: "dentists", label: "Dentists" },
            { id: "doctors", label: "Doctors" },
            { id: "dermatologists", label: "Dermatologists" },
            { id: "optometrists", label: "Optometrists" },
            { id: "physical_therapy", label: "Physical Therapy" },
        ]
    },
    {
        id: "restaurants",
        label: "Restaurants",
        subcategories: [
            { id: "takeout", label: "Takeout" },
            { id: "delivery", label: "Delivery" },
            { id: "hot_trendy", label: "Hot & Trendy" },
            { id: "new_restaurants", label: "New Restaurants" },
            { id: "breakfast_brunch", label: "Breakfast & Brunch" },
            { id: "lunch", label: "Lunch" },
            { id: "dinner", label: "Dinner" },
            { id: "coffee_cafes", label: "Coffee & Cafes" },
            { id: "pizza", label: "Pizza" },
            { id: "chinese", label: "Chinese" },
            { id: "mexican", label: "Mexican" },
            { id: "bakeries", label: "Bakeries" },
            { id: "italian", label: "Italian" },
            { id: "food_trucks", label: "Food Trucks" },
            { id: "sports_bars", label: "Sports Bars & Pubs" },
        ]
    },
    {
        id: "home_garden",
        label: "Home & Garden",
        subcategories: [
            { id: "contractors", label: "Contractors & Handymen" },
            { id: "plumbers", label: "Plumbers" },
            { id: "electricians", label: "Electricians" },
            { id: "heating_ac", label: "Heating & Air Conditioning" },
            { id: "appliances", label: "Appliances and Repair" },
            { id: "roofing", label: "Roofing" },
            { id: "locksmiths", label: "Locksmiths" },
            { id: "painters", label: "Painters" },
            { id: "landscaping", label: "Landscaping" },
            { id: "nurseries", label: "Nurseries & Gardening" },
            { id: "florists", label: "Florists" },
            { id: "tree_services", label: "Tree Services" },
            { id: "home_cleaning", label: "Home Cleaning" },
            { id: "furniture_stores", label: "Furniture Stores" },
            { id: "movers", label: "Movers" },
        ]
    },
    {
        id: "auto_services",
        label: "Auto Services",
        subcategories: [
            { id: "auto_repair", label: "Auto Repair" },
            { id: "body_shops", label: "Body Shops" },
            { id: "oil_change", label: "Oil Change" },
            { id: "tires", label: "Tires" },
            { id: "towing", label: "Towing" },
            { id: "car_wash", label: "Car Wash" },
            { id: "auto_detailing", label: "Auto Detailing" },
            { id: "parking", label: "Parking" },
            { id: "car_dealers", label: "Car Dealers" },
            { id: "junkyards", label: "Junkyards" },
        ]
    },
    {
        id: "health_beauty",
        label: "Health & Beauty",
        subcategories: [
            { id: "dentists", label: "Dentists" },
            { id: "doctors", label: "Doctors" },
            { id: "chiropractors", label: "Chiropractors" },
            { id: "optometrists", label: "Optometrists" },
            { id: "dermatologists", label: "Dermatologists" },
            { id: "podiatrists", label: "Podiatrists" },
            { id: "massage", label: "Massage" },
            { id: "hair_salons", label: "Hair Salons" },
            { id: "nail_salons", label: "Nail Salons" },
            { id: "barbers", label: "Barbers" },
            { id: "spas", label: "Spas" },
            { id: "physical_therapy", label: "Physical Therapy" },
        ]
    },
    {
        id: "travel_activities",
        label: "Travel & Activities",
        subcategories: [
            { id: "things_to_do", label: "Things to Do" },
            { id: "kids_activities", label: "Kids Activities & Camps" },
            { id: "venues_events", label: "Venues & Events" },
            { id: "churches", label: "Churches" },
            { id: "shopping_malls", label: "Shopping Malls" },
            { id: "bookstores", label: "Bookstores" },
            { id: "mini_golf", label: "Mini Golf" },
            { id: "bowling", label: "Bowling" },
            { id: "hotels", label: "Hotels" },
            { id: "taxis", label: "Taxis" },
            { id: "bike_rentals", label: "Bike Rentals" },
            { id: "campgrounds", label: "Campgrounds" },
            { id: "beaches", label: "Beaches" },
            { id: "swimming_pools", label: "Swimming Pools" },
            { id: "bars_nightlife", label: "Bars & Nightlife" },
        ]
    },
    {
        id: "more",
        label: "More",
        subcategories: [
            { id: "dry_cleaning", label: "Dry Cleaning" },
            { id: "laundromats", label: "Laundromats" },
            { id: "thrift_stores", label: "Thrift Stores" },
            { id: "tailors", label: "Tailors & Alterations" },
            { id: "apartments", label: "Apartments" },
            { id: "junk_removal", label: "Junk Removal" },
            { id: "gyms", label: "Gyms" },
            { id: "yoga_pilates", label: "Yoga & Pilates" },
            { id: "pet_groomers", label: "Pet Groomers" },
            { id: "banks", label: "Banks & Credit Unions" },
            { id: "real_estate", label: "Real Estate Agents" },
            { id: "parking", label: "Parking" },
        ]
    }
];
