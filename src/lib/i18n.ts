export type LangCode =
  | 'en' | 'de' | 'fr' | 'it' | 'uk' | 'pl' | 'zh' | 'ja' | 'es' | 'ru' | 'hi';

export const languages: { code: LangCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

type Dict = {
  nav_pricing: string;
  nav_docs: string;
  nav_cabinet: string;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  hero_docs: string;
  pricing_title: string;
  pricing_subtitle: string;
  requests: string;
  buy: string;
  popular: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  features_title: string;
  f_speed_t: string;
  f_speed_d: string;
  f_key_t: string;
  f_key_d: string;
  f_secure_t: string;
  f_secure_d: string;
  support_title: string;
  support_text: string;
  footer_rights: string;
};

export const t: Record<LangCode, Dict> = {
  en: {
    nav_pricing: 'Pricing', nav_docs: 'Docs', nav_cabinet: 'Account',
    hero_badge: 'Powered by DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'AI content management with built-in DeepSeek assistant. Buy a license, get your key, integrate in minutes.',
    hero_cta: 'View Plans', hero_docs: 'Documentation',
    pricing_title: 'Choose your license', pricing_subtitle: 'Pay in USDT. Key is delivered to your email instantly.',
    requests: 'DeepSeek AI requests', buy: 'Add to cart', popular: 'Popular',
    feature_1: 'Instant key activation', feature_2: 'Email delivery', feature_3: 'API access',
    features_title: 'Why Laevatein',
    f_speed_t: 'Instant activation', f_speed_d: 'Your key works right after payment — no waiting.',
    f_key_t: 'Unique license key', f_key_d: 'Each key is unique and sent straight to your inbox.',
    f_secure_t: 'Request control', f_secure_d: 'Track remaining requests and key status anytime.',
    support_title: 'Support & contacts', support_text: 'Questions? We are here for you around the clock.',
    footer_rights: 'All rights reserved.',
  },
  de: {
    nav_pricing: 'Preise', nav_docs: 'Doku', nav_cabinet: 'Konto',
    hero_badge: 'Angetrieben von DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'KI-Content-Management mit DeepSeek-Assistent. Lizenz kaufen, Schlüssel erhalten, in Minuten integrieren.',
    hero_cta: 'Tarife ansehen', hero_docs: 'Dokumentation',
    pricing_title: 'Wählen Sie Ihre Lizenz', pricing_subtitle: 'Zahlung in USDT. Schlüssel sofort per E-Mail.',
    requests: 'DeepSeek-KI-Anfragen', buy: 'In den Warenkorb', popular: 'Beliebt',
    feature_1: 'Sofortige Aktivierung', feature_2: 'E-Mail-Versand', feature_3: 'API-Zugang',
    features_title: 'Warum Laevatein',
    f_speed_t: 'Sofortaktivierung', f_speed_d: 'Ihr Schlüssel funktioniert direkt nach der Zahlung.',
    f_key_t: 'Einzigartiger Schlüssel', f_key_d: 'Jeder Schlüssel ist einzigartig und kommt per E-Mail.',
    f_secure_t: 'Anfragenkontrolle', f_secure_d: 'Verbleibende Anfragen und Status jederzeit sehen.',
    support_title: 'Support & Kontakte', support_text: 'Fragen? Wir sind rund um die Uhr für Sie da.',
    footer_rights: 'Alle Rechte vorbehalten.',
  },
  fr: {
    nav_pricing: 'Tarifs', nav_docs: 'Docs', nav_cabinet: 'Compte',
    hero_badge: 'Propulsé par DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'Gestion de contenu IA avec assistant DeepSeek. Achetez une licence, recevez votre clé, intégrez en quelques minutes.',
    hero_cta: 'Voir les offres', hero_docs: 'Documentation',
    pricing_title: 'Choisissez votre licence', pricing_subtitle: 'Paiement en USDT. Clé envoyée par e-mail instantanément.',
    requests: 'requêtes DeepSeek AI', buy: 'Ajouter au panier', popular: 'Populaire',
    feature_1: 'Activation instantanée', feature_2: 'Envoi par e-mail', feature_3: 'Accès API',
    features_title: 'Pourquoi Laevatein',
    f_speed_t: 'Activation instantanée', f_speed_d: 'Votre clé fonctionne juste après le paiement.',
    f_key_t: 'Clé de licence unique', f_key_d: 'Chaque clé est unique et envoyée dans votre boîte mail.',
    f_secure_t: 'Contrôle des requêtes', f_secure_d: 'Suivez les requêtes restantes et le statut à tout moment.',
    support_title: 'Support & contacts', support_text: 'Des questions ? Nous sommes là 24h/24.',
    footer_rights: 'Tous droits réservés.',
  },
  it: {
    nav_pricing: 'Prezzi', nav_docs: 'Docs', nav_cabinet: 'Account',
    hero_badge: 'Basato su DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'Gestione contenuti AI con assistente DeepSeek. Acquista una licenza, ottieni la chiave, integra in minuti.',
    hero_cta: 'Vedi i piani', hero_docs: 'Documentazione',
    pricing_title: 'Scegli la tua licenza', pricing_subtitle: 'Pagamento in USDT. Chiave inviata via email all’istante.',
    requests: 'richieste DeepSeek AI', buy: 'Aggiungi al carrello', popular: 'Popolare',
    feature_1: 'Attivazione istantanea', feature_2: 'Invio via email', feature_3: 'Accesso API',
    features_title: 'Perché Laevatein',
    f_speed_t: 'Attivazione istantanea', f_speed_d: 'La chiave funziona subito dopo il pagamento.',
    f_key_t: 'Chiave di licenza unica', f_key_d: 'Ogni chiave è unica e arriva nella tua email.',
    f_secure_t: 'Controllo richieste', f_secure_d: 'Monitora richieste rimanenti e stato in qualsiasi momento.',
    support_title: 'Supporto e contatti', support_text: 'Domande? Siamo qui per te 24 ore su 24.',
    footer_rights: 'Tutti i diritti riservati.',
  },
  uk: {
    nav_pricing: 'Тарифи', nav_docs: 'Докум.', nav_cabinet: 'Кабінет',
    hero_badge: 'На базі DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'Керування контентом з ШІ-асистентом DeepSeek. Купіть ліцензію, отримайте ключ, інтегруйте за хвилини.',
    hero_cta: 'Переглянути тарифи', hero_docs: 'Документація',
    pricing_title: 'Оберіть ліцензію', pricing_subtitle: 'Оплата в USDT. Ключ надходить на пошту миттєво.',
    requests: 'запитів до DeepSeek AI', buy: 'Додати в кошик', popular: 'Популярний',
    feature_1: 'Миттєва активація', feature_2: 'Доставка на пошту', feature_3: 'Доступ до API',
    features_title: 'Чому Laevatein',
    f_speed_t: 'Миттєва активація', f_speed_d: 'Ваш ключ працює одразу після оплати.',
    f_key_t: 'Унікальний ключ', f_key_d: 'Кожен ключ унікальний і надходить на вашу пошту.',
    f_secure_t: 'Контроль запитів', f_secure_d: 'Стежте за залишком запитів і статусом будь-коли.',
    support_title: 'Підтримка та контакти', support_text: 'Питання? Ми поруч цілодобово.',
    footer_rights: 'Усі права захищені.',
  },
  pl: {
    nav_pricing: 'Cennik', nav_docs: 'Dokumenty', nav_cabinet: 'Konto',
    hero_badge: 'Napędzane przez DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'Zarządzanie treścią z asystentem DeepSeek AI. Kup licencję, odbierz klucz, zintegruj w kilka minut.',
    hero_cta: 'Zobacz plany', hero_docs: 'Dokumentacja',
    pricing_title: 'Wybierz licencję', pricing_subtitle: 'Płatność w USDT. Klucz wysyłany na e-mail natychmiast.',
    requests: 'zapytań do DeepSeek AI', buy: 'Do koszyka', popular: 'Popularny',
    feature_1: 'Natychmiastowa aktywacja', feature_2: 'Wysyłka e-mail', feature_3: 'Dostęp API',
    features_title: 'Dlaczego Laevatein',
    f_speed_t: 'Natychmiastowa aktywacja', f_speed_d: 'Klucz działa zaraz po płatności.',
    f_key_t: 'Unikalny klucz', f_key_d: 'Każdy klucz jest unikalny i trafia na Twój e-mail.',
    f_secure_t: 'Kontrola zapytań', f_secure_d: 'Śledź pozostałe zapytania i status w każdej chwili.',
    support_title: 'Wsparcie i kontakt', support_text: 'Pytania? Jesteśmy dostępni całą dobę.',
    footer_rights: 'Wszelkie prawa zastrzeżone.',
  },
  zh: {
    nav_pricing: '价格', nav_docs: '文档', nav_cabinet: '账户',
    hero_badge: '由 DeepSeek AI 驱动',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: '内置 DeepSeek 助手的 AI 内容管理系统。购买许可证，获取密钥，几分钟内集成。',
    hero_cta: '查看套餐', hero_docs: '文档',
    pricing_title: '选择您的许可证', pricing_subtitle: '使用 USDT 付款，密钥即时发送到您的邮箱。',
    requests: '次 DeepSeek AI 请求', buy: '加入购物车', popular: '热门',
    feature_1: '即时激活', feature_2: '邮件发送', feature_3: 'API 访问',
    features_title: '为什么选择 Laevatein',
    f_speed_t: '即时激活', f_speed_d: '付款后密钥立即生效，无需等待。',
    f_key_t: '唯一许可密钥', f_key_d: '每个密钥都是唯一的，直接发送到您的邮箱。',
    f_secure_t: '请求控制', f_secure_d: '随时查看剩余请求数和密钥状态。',
    support_title: '支持与联系', support_text: '有疑问？我们全天候为您服务。',
    footer_rights: '版权所有。',
  },
  ja: {
    nav_pricing: '料金', nav_docs: 'ドキュメント', nav_cabinet: 'アカウント',
    hero_badge: 'DeepSeek AI 搭載',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'DeepSeek アシスタント内蔵の AI コンテンツ管理。ライセンスを購入し、キーを取得、数分で統合。',
    hero_cta: 'プランを見る', hero_docs: 'ドキュメント',
    pricing_title: 'ライセンスを選択', pricing_subtitle: 'USDT で支払い。キーは即座にメールへ届きます。',
    requests: '回の DeepSeek AI リクエスト', buy: 'カートに追加', popular: '人気',
    feature_1: '即時アクティベーション', feature_2: 'メール配信', feature_3: 'API アクセス',
    features_title: 'Laevatein を選ぶ理由',
    f_speed_t: '即時有効化', f_speed_d: '支払い後すぐにキーが有効になります。',
    f_key_t: '固有のライセンスキー', f_key_d: '各キーは固有で、メールに直接届きます。',
    f_secure_t: 'リクエスト管理', f_secure_d: '残りリクエスト数とキーの状態をいつでも確認。',
    support_title: 'サポートと連絡先', support_text: 'ご質問は？24時間体制で対応します。',
    footer_rights: '無断複写・転載を禁じます。',
  },
  es: {
    nav_pricing: 'Precios', nav_docs: 'Docs', nav_cabinet: 'Cuenta',
    hero_badge: 'Impulsado por DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'Gestión de contenido con IA y asistente DeepSeek. Compra una licencia, obtén tu clave, integra en minutos.',
    hero_cta: 'Ver planes', hero_docs: 'Documentación',
    pricing_title: 'Elige tu licencia', pricing_subtitle: 'Pago en USDT. La clave llega a tu correo al instante.',
    requests: 'solicitudes a DeepSeek AI', buy: 'Añadir al carrito', popular: 'Popular',
    feature_1: 'Activación instantánea', feature_2: 'Envío por correo', feature_3: 'Acceso API',
    features_title: 'Por qué Laevatein',
    f_speed_t: 'Activación instantánea', f_speed_d: 'Tu clave funciona justo después del pago.',
    f_key_t: 'Clave de licencia única', f_key_d: 'Cada clave es única y se envía a tu correo.',
    f_secure_t: 'Control de solicitudes', f_secure_d: 'Consulta las solicitudes restantes y el estado cuando quieras.',
    support_title: 'Soporte y contactos', support_text: '¿Preguntas? Estamos contigo las 24 horas.',
    footer_rights: 'Todos los derechos reservados.',
  },
  ru: {
    nav_pricing: 'Тарифы', nav_docs: 'Документация', nav_cabinet: 'Кабинет',
    hero_badge: 'На базе DeepSeek AI',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'Управление контентом с ИИ-ассистентом DeepSeek. Купите лицензию, получите ключ и подключите за минуты.',
    hero_cta: 'Смотреть тарифы', hero_docs: 'Документация',
    pricing_title: 'Выберите лицензию', pricing_subtitle: 'Оплата в USDT. Ключ приходит на почту мгновенно.',
    requests: 'запросов к DeepSeek AI', buy: 'В корзину', popular: 'Популярный',
    feature_1: 'Мгновенная активация', feature_2: 'Доставка на почту', feature_3: 'Доступ к API',
    features_title: 'Почему Laevatein',
    f_speed_t: 'Мгновенная активация', f_speed_d: 'Ваш ключ работает сразу после оплаты — без ожидания.',
    f_key_t: 'Уникальный ключ', f_key_d: 'Каждый ключ уникален и приходит прямо на вашу почту.',
    f_secure_t: 'Контроль запросов', f_secure_d: 'Следите за остатком запросов и статусом ключа в любой момент.',
    support_title: 'Поддержка и контакты', support_text: 'Вопросы? Мы на связи круглосуточно.',
    footer_rights: 'Все права защищены.',
  },
  hi: {
    nav_pricing: 'मूल्य', nav_docs: 'दस्तावेज़', nav_cabinet: 'खाता',
    hero_badge: 'DeepSeek AI द्वारा संचालित',
    hero_title: 'Laevatein-CMS',
    hero_subtitle: 'DeepSeek सहायक के साथ AI कंटेंट प्रबंधन। लाइसेंस खरीदें, अपनी कुंजी पाएं, मिनटों में जोड़ें।',
    hero_cta: 'योजनाएँ देखें', hero_docs: 'दस्तावेज़',
    pricing_title: 'अपना लाइसेंस चुनें', pricing_subtitle: 'USDT में भुगतान करें। कुंजी तुरंत आपके ईमेल पर।',
    requests: 'DeepSeek AI अनुरोध', buy: 'कार्ट में डालें', popular: 'लोकप्रिय',
    feature_1: 'तुरंत सक्रियण', feature_2: 'ईमेल डिलीवरी', feature_3: 'API पहुँच',
    features_title: 'Laevatein क्यों',
    f_speed_t: 'तुरंत सक्रियण', f_speed_d: 'भुगतान के तुरंत बाद आपकी कुंजी काम करती है।',
    f_key_t: 'अद्वितीय लाइसेंस कुंजी', f_key_d: 'हर कुंजी अद्वितीय है और सीधे आपके ईमेल पर आती है।',
    f_secure_t: 'अनुरोध नियंत्रण', f_secure_d: 'शेष अनुरोध और कुंजी की स्थिति कभी भी देखें।',
    support_title: 'सहायता और संपर्क', support_text: 'प्रश्न? हम चौबीसों घंटे आपके साथ हैं।',
    footer_rights: 'सर्वाधिकार सुरक्षित।',
  },
};

export const plans = [
  { id: 'free', name: 'FREE', price: 10, requests: 300, popular: false },
  { id: 'basic', name: 'БАЗОВЫЙ', price: 30, requests: 1000, popular: false },
  { id: 'premium', name: 'ПРЕМИУМ', price: 60, requests: 5000, popular: true },
  { id: 'enterprise', name: 'ЭНТЕРПРАЙЗ', price: 100, requests: 50000, popular: false },
];
