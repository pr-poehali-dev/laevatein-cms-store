import { useEffect, useState } from 'react';
import { getUser, clearUser } from '@/lib/auth';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface License {
  key: string;
  plan: string;
  requests_total: number;
  requests_left: number;
  status: string;
  created_at: string;
}

export default function Cabinet() {
  const user = getUser();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { window.location.href = '/login'; return; }
    api.getLicenses(user.id).then((r) => {
      setLicenses(r.licenses || []);
      setLoading(false);
    });
  }, []);

  const copy = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const logout = () => { clearUser(); window.location.href = '/'; };

  const statusColor = (s: string) =>
    s === 'active' ? 'text-green-400' : s === 'blocked' ? 'text-red-400' : 'text-yellow-400';
  const statusLabel = (s: string) =>
    s === 'active' ? 'Активна' : s === 'blocked' ? 'Заблокирована' : 'Истекла';

  if (!user) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="starfield"><div className="stars"/><div className="stars2"/><div className="stars3"/></div>
      <div className="nebula" style={{width:400,height:400,top:'-5%',right:'-5%',background:'rgba(180,20,40,0.15)'}}/>

      {/* Шапка */}
      <header className="glass-strong sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary box-glow">
              <Icon name="Flame" size={18} className="text-primary-foreground"/>
            </div>
            <span className="font-display text-base font-bold tracking-wider text-glow text-primary">LAEVATEIN</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <a href="/downloads">
              <Button variant="outline" size="sm" className="glass">
                <Icon name="Download" size={15} className="mr-1"/> Скачать
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-primary">
              <Icon name="LogOut" size={15} className="mr-1"/> Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Приветствие */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Привет, <span className="text-glow text-primary">{user.name || user.email}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Личный кабинет — ваши лицензии и ключи</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Icon name="Loader2" size={28} className="animate-spin mr-3 text-primary"/> Загрузка...
          </div>
        ) : licenses.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl glass p-10 text-center">
            <div className="mb-4 grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-primary/10">
              <Icon name="KeyRound" size={32} className="text-primary"/>
            </div>
            <h2 className="font-display text-xl font-bold mb-2">Лицензий пока нет</h2>
            <p className="text-muted-foreground mb-6 text-sm">После покупки все ключи появятся здесь и придут на вашу почту</p>
            <Button asChild className="box-glow">
              <a href="/#pricing">Выбрать тариф</a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {licenses.map((lic) => {
              const pct = Math.round((lic.requests_left / lic.requests_total) * 100);
              return (
                <div key={lic.key} className="rounded-2xl glass p-6 transition hover:box-glow flex flex-col gap-4">
                  {/* Шапка карточки */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-display text-lg font-bold">{lic.plan}</span>
                      <div className={`text-xs font-semibold mt-0.5 flex items-center gap-1 ${statusColor(lic.status)}`}>
                        <Icon name="Circle" size={8}/> {statusLabel(lic.status)}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(lic.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  {/* Ключ */}
                  <div className="rounded-xl bg-black/40 px-4 py-3 flex items-center justify-between gap-3">
                    <code className="font-mono text-sm text-primary tracking-widest truncate">{lic.key}</code>
                    <button
                      onClick={() => copy(lic.key)}
                      className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
                    >
                      {copied === lic.key
                        ? <><Icon name="Check" size={14} className="text-green-400"/> Скопировано</>
                        : <><Icon name="Copy" size={14}/> Копировать</>
                      }
                    </button>
                  </div>

                  {/* Прогресс запросов */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Запросов к AI</span>
                      <span className="font-semibold">
                        <span className="text-primary">{lic.requests_left.toLocaleString()}</span>
                        <span className="text-muted-foreground"> / {lic.requests_total.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{width:`${pct}%`, boxShadow:'0 0 8px rgba(255,45,45,0.6)'}}
                      />
                    </div>
                    <div className="text-right text-xs text-muted-foreground mt-1">{pct}% осталось</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Как использовать ключ */}
        {licenses.length > 0 && (
          <div className="mt-10 rounded-2xl glass-strong p-7">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Icon name="BookOpen" size={20} className="text-primary"/> Как использовать ключ
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Отправьте запрос к AI через наш API:</p>
            <pre className="rounded-xl bg-black/50 p-4 text-xs text-blue-300 overflow-x-auto">{`POST /api/ask

{
  "api_key": "ВАШ_КЛЮЧ_LAE-XXXX-XXXX-XXXX",
  "prompt": "Ваш вопрос к AI"
}

// Ответ:
{
  "success": true,
  "response": "Ответ DeepSeek...",
  "requests_left": 299
}`}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
