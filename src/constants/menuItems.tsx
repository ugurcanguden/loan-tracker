import { Ionicons } from '@expo/vector-icons';

// Ana sekmeler (Alt Tab Menüsü)
export const MENU_ITEMS = [
  {
    key: 'home',
    name: 'home',
    icon: 'home-outline', // modern ve sade
    componentName: 'HomeScreen',
    description: "(Ana Sayfa) → Genel finans durumu",
  },
  {
    key : "payments",
    name: 'payments',
    icon: 'card-outline', // mevcut hali gayet uygun
    componentName: 'PaymentsScreen',
    description: "Payments (Ödemeler) → Kredi ve borç ödemeleri",
  },
  {
    key :"income",
    name: 'income',
    icon: 'cash-outline', // 'logo-alipay' yerine daha genel bir ikon
    componentName: 'IncomeScreen',
    description: "Income (Gelir Takibi) → Maaş, ek gelirler",
  },
  {
    key :"menu",
    name: 'menu',
    icon: 'menu', // sade ve anlaşılır
    componentName: 'MenuScreen',
    description: "Menü → Diğer sayfalara erişim",
  }
];

// Menü altındaki sayfalar (Menu Sekmesi İçindeki Ek Sayfalar)
export const MENU_PAGES = [
  {
    key : "settings",
    name: 'menu.settings',
    icon: 'settings-outline',
    componentName: 'Settings',
    description: "⚙️ Dil, tema ve genel ayarlar",
  },
  {
    key : "reports",
    name: 'menu.reports',
    icon: 'bar-chart-outline',
    componentName: 'Reports',
    description: "📊 Kredi analizleri, ödeme geçmişi",
  },
  {
    key : "profile",
    name: 'menu.profile',
    icon: 'person-outline',
    componentName: 'Reports',
    description: "👤 Kullanıcı bilgileri ve profil ayarları",
  }
];