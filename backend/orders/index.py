import json
import os
import secrets
import smtplib
import urllib.request
import urllib.parse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import psycopg2

TELEGRAM_CHAT_ID = '8530959160'

PLANS = {
    'free': {'name': 'FREE', 'price': 10, 'requests': 300},
    'basic': {'name': 'БАЗОВЫЙ', 'price': 30, 'requests': 1000},
    'premium': {'name': 'ПРЕМИУМ', 'price': 60, 'requests': 5000},
    'enterprise': {'name': 'ЭНТЕРПРАЙЗ', 'price': 100, 'requests': 50000},
}


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body, default=str, ensure_ascii=False), 'isBase64Encoded': False}


def _gen_key():
    raw = secrets.token_hex(12).upper()
    return f"LAE-{raw[0:4]}-{raw[4:8]}-{raw[8:12]}-{raw[12:16]}"


def _notify_telegram(text):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not token:
        return
    try:
        data = urllib.parse.urlencode({
            'chat_id': TELEGRAM_CHAT_ID,
            'text': text,
            'parse_mode': 'HTML',
        }).encode()
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=5)
    except Exception:
        pass


def _send_email(to_email: str, order_id: int, licenses: list):
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')
    if not smtp_host or not smtp_user:
        return

    keys_html = ''.join([
        f"""
        <div style="background:#1a0a1a;border:1px solid #c0392b;border-radius:12px;padding:20px;margin:12px 0;">
          <div style="color:#aaa;font-size:12px;margin-bottom:6px;">{lic['plan']} &middot; {lic['requests']:,} запросов</div>
          <div style="font-family:monospace;font-size:18px;color:#ff4444;letter-spacing:2px;font-weight:bold;">{lic['key']}</div>
        </div>
        """
        for lic in licenses
    ])

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0a0612;margin:0;padding:0;font-family:'Segoe UI',sans-serif;color:#e0e0e0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:900;color:#ff3333;letter-spacing:3px;">LAEVATEIN-CMS</span>
      <p style="color:#aaa;margin:8px 0 0;">Ваш лицензионный ключ готов</p>
    </div>
    <div style="background:#110a1a;border:1px solid #3a1a2a;border-radius:16px;padding:28px;">
      <p style="margin:0 0 16px;">Спасибо за покупку! <b>Заказ #{order_id}</b> успешно оформлен.</p>
      <p style="margin:0 0 20px;color:#aaa;">Ваши лицензионные ключи:</p>
      {keys_html}
      <hr style="border:none;border-top:1px solid #2a1a2a;margin:24px 0;">
      <h3 style="color:#ff4444;margin:0 0 16px;">Как использовать ключ</h3>
      <p style="margin:0 0 10px;"><b>1. Через API (для разработчиков)</b></p>
      <div style="background:#0d0d1a;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;color:#7ec8e3;white-space:pre-wrap;">POST /api/ask

{{
  "api_key": "ВАШ_КЛЮЧ",
  "prompt": "Ваш запрос к AI"
}}</div>
      <p style="margin:16px 0 10px;"><b>2. Через личный кабинет</b></p>
      <p style="color:#aaa;margin:0 0 20px;">Войдите на сайт &rarr; Личный кабинет &rarr; скопируйте ключ и вставьте в CMS.</p>
      <p style="margin:0 0 10px;"><b>3. Остаток запросов</b></p>
      <p style="color:#aaa;margin:0;">В личном кабинете видно сколько запросов осталось. Когда закончатся — купите новую лицензию.</p>
    </div>
    <div style="text-align:center;margin-top:28px;color:#666;font-size:13px;">
      <p>Вопросы? Пишите нам:<br>
      <a href="mailto:laevateincmssupport@gmail.com" style="color:#ff4444;">laevateincmssupport@gmail.com</a> &nbsp;|&nbsp;
      <a href="https://t.me/LaevateinSupportCMS_bot" style="color:#ff4444;">Telegram Support</a></p>
      <p style="margin-top:20px;color:#444;">&copy; 2026 Laevatein-CMS. Все права защищены.</p>
    </div>
  </div>
</body></html>"""

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Laevatein-CMS — Ваш лицензионный ключ (Заказ #{order_id})'
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg.attach(MIMEText(html, 'html', 'utf-8'))
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, msg.as_string())
    except Exception:
        pass


def handler(event: dict, context) -> dict:
    '''Создание заказа, генерация лицензий LAE-XXXX-XXXX-XXXX, email с ключом и Telegram-уведомление.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            if not user_id:
                return _resp(400, {'error': 'user_id_required'})
            cur.execute(
                "SELECT license_key, plan_name, requests_total, requests_left, status, created_at "
                "FROM licenses WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,),
            )
            rows = cur.fetchall()
            licenses = [{
                'key': r[0], 'plan': r[1], 'requests_total': r[2],
                'requests_left': r[3], 'status': r[4], 'created_at': r[5],
            } for r in rows]
            return _resp(200, {'licenses': licenses})

        body = json.loads(event.get('body') or '{}')
        user_id = body.get('user_id')
        email = (body.get('email') or '').strip().lower()
        items = body.get('items') or []

        if not user_id or not email or not items:
            return _resp(400, {'error': 'user_email_items_required'})

        total = 0
        valid_items = []
        for it in items:
            p = PLANS.get(it)
            if p:
                total += p['price']
                valid_items.append((it, p))
        if not valid_items:
            return _resp(400, {'error': 'no_valid_items'})

        cur.execute(
            "INSERT INTO orders (user_id, email, total_usdt, status) VALUES (%s, %s, %s, 'paid') RETURNING id",
            (user_id, email, total),
        )
        order_id = cur.fetchone()[0]

        issued = []
        for plan_id, p in valid_items:
            key = _gen_key()
            cur.execute(
                "INSERT INTO licenses (user_id, order_id, license_key, plan_id, plan_name, requests_total, requests_left, status) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, 'active')",
                (user_id, order_id, key, plan_id, p['name'], p['requests'], p['requests']),
            )
            issued.append({'plan': p['name'], 'key': key, 'requests': p['requests']})
        conn.commit()

        _send_email(email, order_id, issued)

        keys_text = '\n'.join([f"• {i['plan']}: <code>{i['key']}</code> ({i['requests']:,} запр.)" for i in issued])
        _notify_telegram(
            f"🔥 <b>Новый заказ Laevatein-CMS</b>\n\n"
            f"📧 {email}\n💰 {total} USDT\n🆔 Заказ #{order_id}\n\n"
            f"🔑 Выданные ключи:\n{keys_text}"
        )

        return _resp(200, {'success': True, 'order_id': order_id, 'total': total, 'licenses': issued})
    finally:
        cur.close()
        conn.close()
