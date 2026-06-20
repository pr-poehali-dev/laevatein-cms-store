import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { t, languages, plans, LangCode } from '@/lib/i18n';
import { getUser } from '@/lib/auth';

const WALLETS = [
  {
    network: 'Solana (SOL)',
    token: 'USDT',
    address: 'TFAXzVD1hevM6Ch9WDPpUeELwZ75P5MgY4zEBZemtGD',
    icon: '◎',
    color: '#9945FF',
  },
  {
    network: 'TRON (TRX)',
    token: 'USDT TRC-20',
    address: 'TLgiRKp1jHM55zdTb63ojpZdKpU29f1ixd',
    icon: '◈',
    color: '#EF3A3A',
  },
];

const Index = () => {
  const user = getUser();
  const [lang, setLang] = useState<LangCode>('ru');
  const [cart, setCart] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const tr = t[lang];
  const current = languages.find((l) => l.code === lang)!;

  const addToCart = (id: string) => setCart((c) => [...c, id]);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(addr);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const features = [
    { icon: 'Zap', title: tr.f_speed_t, desc: tr.f_speed_d },
    { icon: 'KeyRound', title: tr.f_key_t, desc: tr.f_key_d },
    { icon: 'ShieldCheck', title: tr.f_secure_t, desc: tr.f_secure_d },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground">
      {/* Звёздное небо */}
      <div className="starfield">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>
      <div className="nebula" style={{ width: 500, height: 500, top: '-10%', left: '-5%', background: 'rgba(200,30,40,0.18)' }} />
      <div className="nebula" style={{ width: 420, height: 420, bottom: '5%', right: '-8%', background: 'rgba(120,20,60,0.16)' }} />

      {/* Шапка */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary box-glow">
              <Icon name="Flame" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider text-glow text-primary">
              LAEVATEIN
            </span>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#pricing" className="text-sm text-muted-foreground transition hover:text-primary">{tr.nav_pricing}</a>
            <a href="#features" className="text-sm text-muted-foreground transition hover:text-primary">{tr.nav_docs}</a>
            <a href="#support" className="text-sm text-muted-foreground transition hover:text-primary">{tr.nav_cabinet}</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg glass transition hover:box-glow">
              <Icon name="ShoppingCart" size={18} className="text-primary" />
              {cart.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <a href="/cabinet">
                <Button size="sm" variant="outline" className="glass hidden sm:flex">
                  <Icon name="LayoutDashboard" size={15} className="mr-1" /> {tr.nav_cabinet}
                </Button>
              </a>
            ) : (
              <a href="/login">
                <Button size="sm" className="box-glow hidden sm:flex">
                  <Icon name="LogIn" size={15} className="mr-1" /> Войти
                </Button>
              </a>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm transition hover:box-glow">
                  <span>{current.flag}</span>
                  <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
                  <Icon name="ChevronDown" size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong max-h-80 overflow-y-auto">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className="cursor-pointer gap-2"
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pb-20 pt-20 text-center md:pt-32">
        <div className="animate-fade-in mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs">
          <Icon name="Sparkles" size={14} className="text-primary" />
          <span className="text-muted-foreground">{tr.hero_badge}</span>
        </div>

        <h1 className="animate-fade-in font-display mx-auto mt-8 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          <span className="text-glow text-primary">{tr.hero_title}</span>
        </h1>

        <p className="animate-fade-in mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          {tr.hero_subtitle}
        </p>

        <div className="animate-fade-in mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="box-glow box-glow-hover px-8 text-base">
            <a href="#pricing">
              {tr.hero_cta}
              <Icon name="ArrowRight" size={18} className="ml-1" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="glass border-border px-8 text-base">
            <a href="#features">{tr.hero_docs}</a>
          </Button>
        </div>
      </section>

      {/* Тарифы */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl text-glow text-primary">{tr.pricing_title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{tr.pricing_subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl glass p-6 transition duration-300 hover:-translate-y-1 box-glow-hover ${
                plan.popular ? 'box-glow ring-1 ring-primary/50' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                  {tr.popular}
                </span>
              )}

              <h3 className="font-display text-lg font-bold tracking-wide">{plan.name}</h3>

              <div className="mt-4 flex items-end gap-1.5">
                <span className="font-display text-4xl font-extrabold text-glow text-primary">{plan.price}</span>
                <span className="mb-1 text-sm font-semibold text-muted-foreground">USDT</span>
              </div>

              <div className="my-6 h-px bg-border" />

              <ul className="flex-1 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="shrink-0 text-primary" />
                  <span>
                    <b className="text-foreground">{plan.requests.toLocaleString()}</b>{' '}
                    <span className="text-muted-foreground">{tr.requests}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Check" size={16} className="shrink-0 text-primary" />
                  {tr.feature_1}
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Check" size={16} className="shrink-0 text-primary" />
                  {tr.feature_2}
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Check" size={16} className="shrink-0 text-primary" />
                  {tr.feature_3}
                </li>
              </ul>

              <Button
                onClick={() => addToCart(plan.id)}
                className={`mt-6 w-full ${plan.popular ? 'box-glow' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                <Icon name="ShoppingCart" size={16} className="mr-1" />
                {tr.buy}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* USDT кошельки */}
      <section className="container mx-auto px-4 pb-10">
        <div className="mx-auto max-w-3xl rounded-2xl glass-strong p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 box-glow">
              <Icon name="Wallet" size={22} className="text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Оплата в USDT</h3>
              <p className="text-sm text-muted-foreground">Переведите точную сумму на один из кошельков</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {WALLETS.map((w) => (
              <div key={w.address} className="rounded-xl glass p-5 transition hover:box-glow">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ color: w.color }}>{w.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{w.network}</div>
                      <div className="text-xs text-muted-foreground">{w.token}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyAddress(w.address)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/25"
                  >
                    {copied === w.address ? (
                      <><Icon name="Check" size={13} /> Скопировано</>
                    ) : (
                      <><Icon name="Copy" size={13} /> Копировать</>
                    )}
                  </button>
                </div>
                <div className="break-all rounded-lg bg-black/30 px-3 py-2.5 font-mono text-xs text-foreground/80">
                  {w.address}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            После оплаты напишите нам в{' '}
            <a href="https://t.me/LaevateinSupportCMS_bot" target="_blank" rel="noreferrer" className="text-primary underline">
              Telegram
            </a>
            {' '}или на{' '}
            <a href="mailto:laevateincmssupport@gmail.com" className="text-primary underline">
              email
            </a>
            {' '}— мы активируем вашу лицензию вручную.
          </p>
        </div>
      </section>

      {/* Преимущества */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl text-glow text-primary">
          {tr.features_title}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.icon} className="rounded-2xl glass p-7 transition hover:box-glow">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 box-glow">
                <Icon name={f.icon} size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Поддержка */}
      <section id="support" className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl glass-strong p-10 text-center box-glow">
          <h2 className="font-display text-2xl font-bold md:text-3xl text-glow text-primary">{tr.support_title}</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">{tr.support_text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:laevateincmssupport@gmail.com"
              className="flex items-center gap-2 rounded-lg glass px-5 py-3 text-sm transition hover:box-glow"
            >
              <Icon name="Mail" size={18} className="text-primary" />
              laevateincmssupport@gmail.com
            </a>
            <a
              href="https://t.me/LaevateinSupportCMS_bot"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition box-glow-hover"
            >
              <Icon name="Send" size={18} />
              Telegram Support
            </a>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <Icon name="Flame" size={18} className="text-primary" />
            <span className="font-display text-sm font-bold tracking-wider text-primary">LAEVATEIN-CMS</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            <a href="mailto:laevateincmssupport@gmail.com" className="flex items-center gap-1.5 transition hover:text-primary">
              <Icon name="Mail" size={15} /> laevateincmssupport@gmail.com
            </a>
            <a href="https://t.me/LaevateinSupportCMS_bot" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition hover:text-primary">
              <Icon name="Send" size={15} /> Telegram
            </a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Laevatein-CMS. {tr.footer_rights}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;