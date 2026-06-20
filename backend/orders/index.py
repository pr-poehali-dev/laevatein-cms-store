import json
import os
import secrets
import urllib.request
import urllib.parse
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
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body, default=str), 'isBase64Encoded': False}


def _gen_key():
    raw = secrets.token_hex(12).upper()
    return f"LAEV-{raw[0:4]}-{raw[4:8]}-{raw[8:12]}-{raw[12:16]}"


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


def handler(event: dict, context) -> dict:
    '''Создание заказа, генерация лицензий и Telegram-уведомление о покупке.'''
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

        keys_text = '\n'.join([f"• {i['plan']}: <code>{i['key']}</code> ({i['requests']} запросов)" for i in issued])
        _notify_telegram(
            f"🔥 <b>Новый заказ Laevatein-CMS</b>\n\n"
            f"📧 {email}\n💰 {total} USDT\n🆔 Заказ #{order_id}\n\n"
            f"🔑 Выданные ключи:\n{keys_text}"
        )

        return _resp(200, {'success': True, 'order_id': order_id, 'total': total, 'licenses': issued})
    finally:
        cur.close()
        conn.close()
