import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { saveUser } from '@/lib/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register(email, password, name);
      if (res.ok && res.user) {
        saveUser(res.user);
        window.location.href = '/cabinet';
      } else {
        setError(res.error || 'Не удалось создать аккаунт');
      }
    } catch {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Starfield */}
      <div className="starfield">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
      </div>

      {/* Nebula accents */}
      <div
        className="nebula w-80 h-80 top-[-60px] left-[-60px]"
        style={{ background: 'rgba(160, 15, 15, 0.13)' }}
      />
      <div
        className="nebula w-64 h-64 bottom-[-30px] right-[-30px]"
        style={{ background: 'rgba(100, 10, 35, 0.1)' }}
      />

      {/* Card */}
      <div className="glass box-glow rounded-2xl w-full max-w-md p-8 flex flex-col gap-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full glass-strong box-glow">
            <Icon name="UserPlus" size={26} className="text-primary text-glow" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest text-primary text-glow uppercase">
            Laevatein
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider uppercase">
            CMS — Регистрация
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Icon name="User" size={14} className="text-primary" />
              Имя
            </label>
            <Input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-transparent border-border/60 focus-visible:ring-primary/60 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Icon name="Lock" size={14} className="text-primary" />
              Пароль
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Минимум 6 символов"
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

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Icon name="ShieldCheck" size={14} className="text-primary" />
              Повтор пароля
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Повторите пароль"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className={[
                  'bg-transparent focus-visible:ring-primary/60 placeholder:text-muted-foreground/50 pr-10',
                  passwordsMismatch
                    ? 'border-red-500/70'
                    : passwordsMatch
                      ? 'border-green-500/60'
                      : 'border-border/60',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                <Icon name={showConfirm ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-0.5">
                <Icon name="X" size={12} />
                Пароли не совпадают
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                <Icon name="Check" size={12} />
                Пароли совпадают
              </p>
            )}
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
                Создаём аккаунт...
              </>
            ) : (
              <>
                <Icon name="Rocket" size={16} />
                Зарегистрироваться
              </>
            )}
          </Button>
        </form>

        {/* Link */}
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground pt-1 border-t border-border/30">
          Уже есть аккаунт?
          <a
            href="/login"
            className="text-primary hover:underline transition-colors ml-1"
          >
            Войти
          </a>
        </div>
      </div>
    </div>
  );
}
