import json
import os
import psycopg2

# Имена файлов инсталляторов в S3 (папка installers/).
# Загрузите свои файлы в бакет 'files' с этими ключами:
#   installers/Laevatein-CMS.dmg
#   installers/Laevatein-CMS.deb
#   installers/Laevatein-CMS-Setup.exe
INSTALLERS = [
    {'os': 'macOS', 'icon': 'Apple', 'ext': 'dmg', 'file': 'installers/Laevatein-CMS.dmg', 'label': 'macOS (.dmg)'},
    {'os': 'Linux', 'icon': 'Terminal', 'ext': 'deb', 'file': 'installers/Laevatein-CMS.deb', 'label': 'Linux (.deb)'},
    {'os': 'Windows', 'icon': 'Monitor', 'ext': 'exe', 'file': 'installers/Laevatein-CMS-Setup.exe', 'label': 'Windows (.exe)'},
]


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body), 'isBase64Encoded': False}


def handler(event: dict, context) -> dict:
    '''Выдаёт ссылки на инсталляторы только пользователям с активной лицензией.'''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    params = event.get('queryStringParameters') or {}
    user_id = params.get('user_id')
    if not user_id:
        return _resp(401, {'error': 'auth_required', 'allowed': False})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT COUNT(*) FROM licenses WHERE user_id = %s AND status = 'active'",
            (user_id,),
        )
        count = cur.fetchone()[0]
        if not count:
            return _resp(403, {'error': 'no_active_license', 'allowed': False})

        bucket_key = os.environ.get('AWS_ACCESS_KEY_ID', '')
        base = f"https://cdn.poehali.dev/projects/{bucket_key}/bucket"
        files = [{
            'os': i['os'], 'icon': i['icon'], 'ext': i['ext'], 'label': i['label'],
            'url': f"{base}/{i['file']}",
        } for i in INSTALLERS]
        return _resp(200, {'allowed': True, 'installers': files})
    finally:
        cur.close()
        conn.close()
