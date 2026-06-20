import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Tab = 'stats' | 'users' | 'orders' | 'licenses' | 'logs';

const ADMIN_TOKEN_KEY = 'laevatein_admin';

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('stats');
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setLoginError('');
    const r = await api.adminLogin(loginForm.login, loginForm.password);
    if (r.success) {
      localStorage.setItem(ADMIN_TOKEN_KEY, r.token);
      setToken(r.token);
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  const logout = () => { localStorage.removeItem(ADMIN_TOKEN_KEY); setToken(''); };

  const load = async (t: Tab) => {
    setLoading(true);
    const r = await api.adminGet(t, token, t === 'logs' ? { limit: '100' } : undefined);
    setData(r);
    setLoading(false);
  };

  useEffect(() => { if (token) load(tab); }, [tab, token]);

  const setLicenseStatus = async (id: number, status: string) => {
    await api.adminPost('set_license_status', token, { license_id: id, status });
    load('licenses');
  };

  const deleteLicense = async (id: number) => {
    if (!confirm('Удалить лицензию?')) return;
    await api.adminPost('delete_license', token, { license_id: id });
    load('licenses');
  };

  const setOrderStatus = async (id: number, status: string) => {
    await api.adminPost('set_order_status', token, { order_id: id, status });
    load('orders');
  };

  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="starfield"><div className="stars"/><div className="stars2"/><div className="stars3"/></div>
        <div className="w-full max-w-sm glass-strong rounded-2xl p-8 mx-4">
          <div className="text-center mb-7">
            <Icon name="ShieldCheck" size={36} className="text-primary mx-auto mb-3"/>
            <div className="font-display text-2xl font-bold text-glow text-primary">ADMIN</div>
            <div className="text-xs text-muted-foreground mt-1">Laevatein-CMS · Панель управления</div>
          </div>
          {loginError && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{loginError}</div>
          )}
          <div className="space-y-3">
            <Input placeholder="Логин" value={loginForm.login}
              onChange={(e) => setLoginForm(f => ({ ...f, login: e.target.value }))}
              className="glass border-border bg-transparent" />
            <Input type="password" placeholder="Пароль" value={loginForm.password}
              onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
              className="glass border-border bg-transparent" />
            <Button onClick={doLogin} className="w-full box-glow">Войти</Button>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'stats', label: 'Обзор', icon: 'BarChart2' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
    { id: 'orders', label: 'Заказы', icon: 'ShoppingBag' },
    { id: 'licenses', label: 'Лицензии', icon: 'KeyRound' },
    { id: 'logs', label: 'Логи AI', icon: 'Terminal' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="starfield"><div className="stars"/><div className="stars2"/><div className="stars3"/></div>

      <header className="glass-strong sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Icon name="ShieldCheck" size={20} className="text-primary"/>
            <span className="font-display font-bold text-sm tracking-wider text-primary">LAEVATEIN ADMIN</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-primary text-xs">
            <Icon name="LogOut" size={14} className="mr-1"/> Выйти
          </Button>
        </div>
      </header>

      {/* Навигация */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === t.id ? 'bg-primary text-primary-foreground box-glow' : 'glass text-muted-foreground hover:text-primary'
              }`}>
              <Icon name={t.icon} size={15}/> {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Icon name="Loader2" size={24} className="animate-spin mr-2 text-primary"/> Загрузка...
          </div>
        ) : (
          <>
            {/* Статистика */}
            {tab === 'stats' && data.users !== undefined && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Пользователей', value: data.users as number, icon: 'Users' },
                  { label: 'Оплаченных заказов', value: data.orders as number, icon: 'ShoppingBag' },
                  { label: 'Выручка USDT', value: `$${data.revenue_usdt}`, icon: 'DollarSign' },
                  { label: 'Активных лицензий', value: data.active_licenses as number, icon: 'KeyRound' },
                  { label: 'AI-запросов', value: data.total_ai_requests as number, icon: 'Zap' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl glass p-5">
                    <Icon name={s.icon} size={20} className="text-primary mb-2"/>
                    <div className="font-display text-2xl font-bold text-glow text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Пользователи */}
            {tab === 'users' && (
              <div className="rounded-2xl glass overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3">ID</th><th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Имя</th><th className="px-4 py-3">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((data.users as unknown[]) || []).map((u: unknown) => {
                      const row = u as {id:number;email:string;name:string;created_at:string};
                      return (
                        <tr key={row.id} className="border-b border-border/20 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-muted-foreground">#{row.id}</td>
                          <td className="px-4 py-3 font-mono text-xs">{row.email}</td>
                          <td className="px-4 py-3">{row.name || '—'}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(row.created_at).toLocaleDateString('ru-RU')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Заказы */}
            {tab === 'orders' && (
              <div className="rounded-2xl glass overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="border-b border-border/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3">ID</th><th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Сумма</th><th className="px-4 py-3">Статус</th>
                      <th className="px-4 py-3">Дата</th><th className="px-4 py-3">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((data.orders as unknown[]) || []).map((o: unknown) => {
                      const row = o as {id:number;email:string;total:number;status:string;created_at:string};
                      return (
                        <tr key={row.id} className="border-b border-border/20 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-muted-foreground">#{row.id}</td>
                          <td className="px-4 py-3 font-mono text-xs">{row.email}</td>
                          <td className="px-4 py-3 text-primary font-bold">{row.total} USDT</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              row.status === 'paid' ? 'bg-green-500/15 text-green-400' :
                              row.status === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                              'bg-yellow-500/15 text-yellow-400'
                            }`}>{row.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleDateString('ru-RU')}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {['paid','pending','cancelled'].filter(s => s !== row.status).map(s => (
                                <button key={s} onClick={() => setOrderStatus(row.id, s)}
                                  className="text-xs glass px-2 py-1 rounded hover:text-primary transition">{s}</button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Лицензии */}
            {tab === 'licenses' && (
              <div className="rounded-2xl glass overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="border-b border-border/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3">Ключ</th><th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Тариф</th><th className="px-4 py-3">Запросы</th>
                      <th className="px-4 py-3">Статус</th><th className="px-4 py-3">Управление</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((data.licenses as unknown[]) || []).map((l: unknown) => {
                      const row = l as {id:number;key:string;email:string;plan:string;requests_total:number;requests_left:number;status:string};
                      return (
                        <tr key={row.id} className="border-b border-border/20 hover:bg-white/5 transition">
                          <td className="px-4 py-3 font-mono text-xs text-primary">{row.key}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{row.email}</td>
                          <td className="px-4 py-3 font-semibold">{row.plan}</td>
                          <td className="px-4 py-3 text-xs">
                            <span className="text-primary">{row.requests_left}</span>
                            <span className="text-muted-foreground">/{row.requests_total}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              row.status === 'active' ? 'bg-green-500/15 text-green-400' :
                              row.status === 'blocked' ? 'bg-red-500/15 text-red-400' :
                              'bg-yellow-500/15 text-yellow-400'
                            }`}>{row.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {row.status !== 'active' && (
                                <button onClick={() => setLicenseStatus(row.id, 'active')}
                                  className="text-xs bg-green-500/15 text-green-400 px-2 py-1 rounded hover:bg-green-500/25 transition">
                                  Активировать
                                </button>
                              )}
                              {row.status !== 'blocked' && (
                                <button onClick={() => setLicenseStatus(row.id, 'blocked')}
                                  className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-500/25 transition">
                                  Блок
                                </button>
                              )}
                              <button onClick={() => deleteLicense(row.id)}
                                className="text-xs bg-red-500/15 text-red-400 px-2 py-1 rounded hover:bg-red-500/25 transition">
                                Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Логи */}
            {tab === 'logs' && (
              <div className="rounded-2xl glass overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="border-b border-border/50">
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3">Время</th><th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Ключ</th><th className="px-4 py-3">Токены</th>
                      <th className="px-4 py-3">Запрос (превью)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {((data.logs as unknown[]) || []).map((l: unknown) => {
                      const row = l as {id:number;created_at:string;email:string;key:string;total_tokens:number;preview:string};
                      return (
                        <tr key={row.id} className="border-b border-border/20 hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(row.created_at).toLocaleString('ru-RU')}
                          </td>
                          <td className="px-4 py-3 text-xs">{row.email || '—'}</td>
                          <td className="px-4 py-3 font-mono text-xs text-primary truncate max-w-[120px]">{row.key}</td>
                          <td className="px-4 py-3 text-xs"><span className="text-primary font-bold">{row.total_tokens}</span></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[200px]">{row.preview}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
