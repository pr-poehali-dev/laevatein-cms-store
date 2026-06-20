import json
import os
import hashlib
import psycopg2

ADMIN_LOGIN = 'arx8'
ADMIN_PASSWORD_HASH = hashlib.sha256('admin_salt_Laevatein2026'.encode()).hexdigest()


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body, default=str, ensure_ascii=False)}


def _check_auth(event):
    token = (event.get('headers') or {}).get('X-Admin-Token', '')
    return token == ADMIN_PASSWORD_HASH


def handler(event: dict, context) -> dict:
    '''Защищённая админ-панель: пользователи, заказы, лицензии, логи, управление.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    body = json.loads(event.get('body') or '{}')
    params = event.get('queryStringParameters') or {}
    action = params.get('action') or body.get('action', '')

    # Авторизация
    if action == 'login':
        login = body.get('login', '')
        password = body.get('password', '')
        ph = hashlib.sha256(('admin_salt_' + password).encode()).hexdigest()
        if login == ADMIN_LOGIN and ph == ADMIN_PASSWORD_HASH:
            return _resp(200, {'success': True, 'token': ADMIN_PASSWORD_HASH})
        return _resp(401, {'error': 'Invalid credentials'})

    if not _check_auth(event):
        return _resp(401, {'error': 'Unauthorized'})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        # Список пользователей
        if action == 'users':
            cur.execute("SELECT id, email, name, created_at FROM users ORDER BY created_at DESC LIMIT 200")
            rows = cur.fetchall()
            return _resp(200, {'users': [{'id': r[0], 'email': r[1], 'name': r[2], 'created_at': r[3]} for r in rows]})

        # Список заказов
        if action == 'orders':
            cur.execute("""
                SELECT o.id, o.email, o.total_usdt, o.status, o.created_at, u.name
                FROM orders o LEFT JOIN users u ON u.id = o.user_id
                ORDER BY o.created_at DESC LIMIT 200
            """)
            rows = cur.fetchall()
            return _resp(200, {'orders': [
                {'id': r[0], 'email': r[1], 'total': r[2], 'status': r[3], 'created_at': r[4], 'user_name': r[5]}
                for r in rows
            ]})

        # Изменить статус заказа
        if action == 'set_order_status':
            order_id = body.get('order_id')
            status = body.get('status')
            if order_id and status in ('paid', 'pending', 'cancelled'):
                cur.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
                conn.commit()
                return _resp(200, {'success': True})
            return _resp(400, {'error': 'invalid params'})

        # Список лицензий
        if action == 'licenses':
            cur.execute("""
                SELECT l.id, l.license_key, l.plan_name, l.requests_total, l.requests_left,
                       l.status, l.created_at, u.email
                FROM licenses l LEFT JOIN users u ON u.id = l.user_id
                ORDER BY l.created_at DESC LIMIT 500
            """)
            rows = cur.fetchall()
            return _resp(200, {'licenses': [
                {'id': r[0], 'key': r[1], 'plan': r[2], 'requests_total': r[3],
                 'requests_left': r[4], 'status': r[5], 'created_at': r[6], 'email': r[7]}
                for r in rows
            ]})

        # Изменить статус лицензии
        if action == 'set_license_status':
            lic_id = body.get('license_id')
            status = body.get('status')
            if lic_id and status in ('active', 'blocked', 'expired'):
                cur.execute("UPDATE licenses SET status = %s WHERE id = %s", (status, lic_id))
                conn.commit()
                return _resp(200, {'success': True})
            return _resp(400, {'error': 'invalid params'})

        # Удалить лицензию
        if action == 'delete_license':
            lic_id = body.get('license_id')
            if lic_id:
                cur.execute("DELETE FROM licenses WHERE id = %s", (lic_id,))
                conn.commit()
                return _resp(200, {'success': True})
            return _resp(400, {'error': 'license_id required'})

        # Логи запросов к AI
        if action == 'logs':
            limit = min(int(params.get('limit', 100)), 500)
            cur.execute("""
                SELECT r.id, r.license_key, u.email, r.prompt_tokens, r.completion_tokens,
                       r.total_tokens, r.prompt_preview, r.created_at
                FROM requests_log r LEFT JOIN users u ON u.id = r.user_id
                ORDER BY r.created_at DESC LIMIT %s
            """, (limit,))
            rows = cur.fetchall()
            return _resp(200, {'logs': [
                {'id': r[0], 'key': r[1], 'email': r[2], 'prompt_tokens': r[3],
                 'completion_tokens': r[4], 'total_tokens': r[5], 'preview': r[6], 'created_at': r[7]}
                for r in rows
            ]})

        # Статистика
        if action == 'stats':
            cur.execute("SELECT COUNT(*) FROM users")
            users_count = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'paid'")
            orders_count = cur.fetchone()[0]
            cur.execute("SELECT COALESCE(SUM(total_usdt), 0) FROM orders WHERE status = 'paid'")
            revenue = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM licenses WHERE status = 'active'")
            active_licenses = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM requests_log")
            total_requests = cur.fetchone()[0]
            return _resp(200, {
                'users': users_count,
                'orders': orders_count,
                'revenue_usdt': float(revenue),
                'active_licenses': active_licenses,
                'total_ai_requests': total_requests,
            })

        return _resp(400, {'error': 'unknown action'})
    finally:
        cur.close()
        conn.close()
