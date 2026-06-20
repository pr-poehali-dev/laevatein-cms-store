import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { saveUser } from '@/lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.ok && res.user) {
        saveUser(res.user);
        window.location.href = '/cabinet';
      } else {
        setError(res.error || 'Неверный email или пароль');
      }
    } catch {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Starfield */}
      <div className="starfield">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>

      {/* Nebula accents */}
      <div
        className="nebula w-96 h-96 top-[-80px] right-[-60px]"
        style={{ background: 'rgba(180, 20, 20, 0.12)' }}
      />
      <div
        className="nebula w-72 h-72 bottom-[-40px] left-[-40px]"
        style={{ background: 'rgba(120, 10, 40, 0.1)' }}
      />

      {/* Card */}
      <div className="glass box-glow rounded-2xl w-full max-w-md p-8 flex flex-col gap-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full glass-strong box-glow">
            <Icon name="Sword" size={28} className="text-primary text-glow" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest text-primary text-glow uppercase">
            Laevatein
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider uppercase">
            CMS — Вход в систему
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Icon name="Mail" size={14} className="text-primary" />
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-border/60 focus-visible:ring-primary/60 placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Icon name="Lock" size={14} className="text-primary" />
              Пароль
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-border/60 focus-visible:ring-primary/60 placeholder:text-muted-foreground/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 glass-strong rounded-lg px-3 py-2 border border-red-500/30">
              <Icon name="AlertCircle" size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-1 font-display tracking-widest uppercase text-sm"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Входим...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={16} />
                Войти
              </>
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="flex flex-col gap-2 items-center pt-1 border-t border-border/30">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            Нет аккаунта?
            <a
              href="/register"
              className="text-primary hover:text-glow hover:underline transition-colors ml-1"
            >
              Зарегистрироваться
            </a>
          </div>
          <a
            href="/reset"
            className="text-xs text-muted-foreground/70 hover:text-primary transition-colors"
          >
            Забыли пароль?
          </a>
        </div>
      </div>
    </div>
  );
}
