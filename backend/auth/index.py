import json
import os
import hashlib
import secrets
import psycopg2


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _hash(password: str) -> str:
    return hashlib.sha256(('laevatein_salt_' + password).encode()).hexdigest()


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body), 'isBase64Encoded': False}


def handler(event: dict, context) -> dict:
    '''Регистрация, вход и восстановление пароля для Laevatein-CMS Store.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', '')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    try:
        if action == 'register':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            name = (body.get('name') or '').strip()
            if not email or not password:
                return _resp(400, {'error': 'email_password_required'})
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return _resp(409, {'error': 'email_exists'})
            cur.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id",
                (email, _hash(password), name),
            )
            uid = cur.fetchone()[0]
            conn.commit()
            return _resp(200, {'success': True, 'user': {'id': uid, 'email': email, 'name': name}})

        if action == 'login':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            cur.execute("SELECT id, email, name, password_hash FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            if not row or row[3] != _hash(password):
                return _resp(401, {'error': 'invalid_credentials'})
            return _resp(200, {'success': True, 'user': {'id': row[0], 'email': row[1], 'name': row[2]}})

        if action == 'reset_request':
            email = (body.get('email') or '').strip().lower()
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            row = cur.fetchone()
            if row:
                token = secrets.token_urlsafe(24)
                cur.execute(
                    "UPDATE users SET reset_token = %s, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE id = %s",
                    (token, row[0]),
                )
                conn.commit()
                return _resp(200, {'success': True, 'reset_token': token})
            return _resp(200, {'success': True})

        if action == 'reset_confirm':
            token = body.get('token') or ''
            password = body.get('password') or ''
            cur.execute(
                "SELECT id FROM users WHERE reset_token = %s AND reset_token_expires > NOW()",
                (token,),
            )
            row = cur.fetchone()
            if not row:
                return _resp(400, {'error': 'invalid_token'})
            cur.execute(
                "UPDATE users SET password_hash = %s, reset_token = NULL, reset_token_expires = NULL WHERE id = %s",
                (_hash(password), row[0]),
            )
            conn.commit()
            return _resp(200, {'success': True})

        return _resp(400, {'error': 'unknown_action'})
    finally:
        cur.close()
        conn.close()
