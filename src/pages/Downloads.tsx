import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface Installer {
  os: string;
  icon: string;
  ext: string;
  label: string;
  url: string;
}

const OS_ICONS: Record<string, string> = {
  macOS: 'Apple',
  Linux: 'Terminal',
  Windows: 'Monitor',
};

export default function Downloads() {
  const user = getUser();
  const [installers, setInstallers] = useState<Installer[]>([]);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { window.location.href = '/login'; return; }
    api.getDownloads(user.id).then((r) => {
      setAllowed(r.allowed === true);
      setInstallers(r.installers || []);
      setLoading(false);
    });
  }, []);

  if (!user) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="starfield"><div className="stars"/><div className="stars2"/><div className="stars3"/></div>
      <div className="nebula" style={{width:450,height:450,top:'-8%',left:'-8%',background:'rgba(180,20,40,0.12)'}}/>

      <header className="glass-strong sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary box-glow">
              <Icon name="Flame" size={18} className="text-primary-foreground"/>
            </div>
            <span className="font-display text-base font-bold tracking-wider text-glow text-primary">LAEVATEIN</span>
          </a>
          <a href="/cabinet">
            <Button variant="outline" size="sm" className="glass">
              <Icon name="LayoutDashboard" size={15} className="mr-1"/> Кабинет
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Icon name="Loader2" size={28} className="animate-spin mr-3 text-primary"/> Проверяем лицензию...
          </div>
        ) : !allowed ? (
          <div className="rounded-2xl glass-strong p-12 text-center">
            <div className="mb-5 grid h-20 w-20 mx-auto place-items-center rounded-2xl bg-primary/10 box-glow">
              <Icon name="Lock" size={36} className="text-primary"/>
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Доступ закрыт</h1>
            <p className="text-muted-foreground mb-7 max-w-md mx-auto">
              Скачать инсталляторы могут только клиенты с активной лицензией. Приобретите тариф — и ссылки появятся здесь сразу после оплаты.
            </p>
            <Button asChild className="box-glow">
              <a href="/#pricing">Выбрать тариф</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs mb-6">
                <Icon name="ShieldCheck" size={14} className="text-green-400"/>
                <span className="text-muted-foreground">Лицензия активна — доступ открыт</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-glow text-primary mb-3">Download</h1>
              <p className="text-muted-foreground">Выберите версию для вашей операционной системы</p>
            </div>

            <div className="grid gap-5">
              {installers.map((inst) => (
                <div key={inst.ext} className="rounded-2xl glass p-6 flex items-center justify-between gap-4 transition hover:box-glow group">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/10 box-glow shrink-0">
                      <Icon name={OS_ICONS[inst.os] || 'Package'} size={28} className="text-primary"/>
                    </div>
                    <div>
                      <div className="font-display text-xl font-bold">{inst.os}</div>
                      <div className="text-sm text-muted-foreground">{inst.label}</div>
                    </div>
                  </div>
                  <a href={inst.url} download className="shrink-0">
                    <Button className="box-glow group-hover:scale-105 transition-transform">
                      <Icon name="Download" size={16} className="mr-2"/> Скачать
                    </Button>
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl glass p-5 text-sm text-muted-foreground text-center">
              <Icon name="Info" size={16} className="inline mr-1.5 text-primary"/>
              Возникли проблемы с установкой? Напишите нам в{' '}
              <a href="https://t.me/LaevateinSupportCMS_bot" target="_blank" rel="noreferrer" className="text-primary underline">Telegram</a>.
            </div>
          </>
        )}
      </main>
    </div>
  );
}
