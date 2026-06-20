import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

const token = new URLSearchParams(window.location.search).get('token');

export default function Reset() {
  // Step 1 — request reset
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Step 2 — confirm new password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestLoading(true);
    try {
      const res = await api.resetRequest(email);
      if (res.ok) {
        setRequestSent(true);
      } else {
        setRequestError(res.error || 'Не удалось отправить письмо');
      }
    } catch {
      setRequestError('Ошибка соединения с сервером');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError('');

    if (newPassword !== confirmPassword) {
      setConfirmError('Пароли не совпадают');
      return;
    }
    if (newPassword.length < 6) {
      setConfirmError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setConfirmLoading(true);
    try {
      const res = await api.resetConfirm(token!, newPassword);
      if (res.ok) {
        setConfirmSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2500);
      } else {
        setConfirmError(res.error || 'Не удалось сменить пароль. Ссылка могла устареть.');
      }
    } catch {
      setConfirmError('Ошибка соединения с сервером');
    } finally {
      setConfirmLoading(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

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
        className="nebula w-80 h-80 top-[-50px] right-[-50px]"
        style={{ background: 'rgba(150, 10, 10, 0.12)' }}
      />
      <div
        className="nebula w-60 h-60 bottom-[-20px] left-[-40px]"
        style={{ background: 'rgba(90, 10, 30, 0.1)' }}
      />

      {/* Card */}
      <div className="glass box-glow rounded-2xl w-full max-w-md p-8 flex flex-col gap-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full glass-strong box-glow">
            <Icon name="KeyRound" size={26} className="text-primary text-glow" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest text-primary text-glow uppercase">
            Laevatein
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider uppercase">
            {token ? 'CMS — Новый пароль' : 'CMS — Сброс пароля'}
          </p>
        </div>

        {/* ===== STEP 2: token in URL — set new password ===== */}
        {token ? (
          confirmSuccess ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full glass-strong border border-green-500/40">
                <Icon name="CheckCircle2" size={32} className="text-green-400" />
              </div>
              <div>
                <p className="text-foreground font-medium">Пароль успешно изменён</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Перенаправляем на страницу входа...
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                <Icon name="Loader2" size={12} className="animate-spin" />
                Секунду...
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center -mt-2">
                Придумайте новый пароль для вашего аккаунта
              </p>

              {/* New password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Icon name="Lock" size={14} className="text-primary" />
                  Новый пароль
                </label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Минимум 6 символов"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-transparent border-border/60 focus-visible:ring-primary/60 placeholder:text-muted-foreground/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    <Icon name={showNew ? 'EyeOff' : 'Eye'} size={16} />
                  </button>
                </div>
              </div>

              {/* Confirm new password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Icon name="ShieldCheck" size={14} className="text-primary" />
                  Повтор пароля
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Повторите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              {confirmError && (
                <div className="flex items-center gap-2 text-sm text-red-400 glass-strong rounded-lg px-3 py-2 border border-red-500/30">
                  <Icon name="AlertCircle" size={15} className="shrink-0" />
                  {confirmError}
                </div>
              )}

              <Button
                type="submit"
                disabled={confirmLoading}
                className="w-full mt-1 font-display tracking-widest uppercase text-sm"
              >
                {confirmLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Сохраняем...
                  </>
                ) : (
                  <>
                    <Icon name="ShieldCheck" size={16} />
                    Сохранить новый пароль
                  </>
                )}
              </Button>
            </form>
          )
        ) : (
          /* ===== STEP 1: no token — request reset link ===== */
          requestSent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full glass-strong border border-primary/40">
                <Icon name="MailCheck" size={30} className="text-primary text-glow" />
              </div>
              <div>
                <p className="text-foreground font-medium">Письмо отправлено</p>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  Проверьте почту{' '}
                  <span className="text-primary">{email}</span>.
                  <br />
                  Там будет ссылка вида:
                </p>
                <code className="block mt-2 text-xs glass-strong rounded-lg px-3 py-2 text-muted-foreground border border-border/40 break-all">
                  /reset?token=XXXXXXXX
                </code>
              </div>
              <p className="text-xs text-muted-foreground/60">
                Ссылка действует ограниченное время. Не нашли письмо? Проверьте папку «Спам».
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center -mt-2">
                Укажите email вашего аккаунта — мы отправим ссылку для сброса пароля
              </p>

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

              {requestError && (
                <div className="flex items-center gap-2 text-sm text-red-400 glass-strong rounded-lg px-3 py-2 border border-red-500/30">
                  <Icon name="AlertCircle" size={15} className="shrink-0" />
                  {requestError}
                </div>
              )}

              <Button
                type="submit"
                disabled={requestLoading}
                className="w-full mt-1 font-display tracking-widest uppercase text-sm"
              >
                {requestLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    Отправить ссылку
                  </>
                )}
              </Button>
            </form>
          )
        )}

        {/* Back link */}
        <div className="flex items-center justify-center pt-1 border-t border-border/30">
          <a
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Icon name="ArrowLeft" size={14} />
            Вернуться ко входу
          </a>
        </div>
      </div>
    </div>
  );
}
