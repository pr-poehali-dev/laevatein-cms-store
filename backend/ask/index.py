import json
import os
import urllib.request
import psycopg2


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body, ensure_ascii=False), 'isBase64Encoded': False}


def handler(event: dict, context) -> dict:
    '''Публичный API: принимает api_key + prompt, проксирует в DeepSeek, логирует расход запросов.'''
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    body = json.loads(event.get('body') or '{}')
    api_key = (body.get('api_key') or '').strip()
    prompt = (body.get('prompt') or '').strip()

    if not api_key:
        return _resp(400, {'success': False, 'error': 'api_key is required'})
    if not prompt:
        return _resp(400, {'success': False, 'error': 'prompt is required'})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    try:
        # Проверяем ключ
        cur.execute(
            "SELECT id, user_id, requests_left, status FROM licenses WHERE license_key = %s",
            (api_key,),
        )
        row = cur.fetchone()
        if not row:
            return _resp(403, {'success': False, 'error': 'Invalid API key'})

        lic_id, user_id, requests_left, status = row

        if status != 'active':
            return _resp(403, {'success': False, 'error': 'License is not active'})

        if requests_left <= 0:
            return _resp(429, {'success': False, 'error': 'No requests left. Please purchase a new license.'})

        # Запрос в DeepSeek
        deepseek_key = os.environ.get('DEEPSEEK_API_KEY', '')
        req_data = json.dumps({
            'model': 'deepseek-chat',
            'messages': [{'role': 'user', 'content': prompt}],
            'stream': False,
        }).encode('utf-8')

        req = urllib.request.Request(
            'https://api.deepseek.com/chat/completions',
            data=req_data,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {deepseek_key}',
            },
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=25) as r:
            ds_data = json.loads(r.read().decode())

        answer = ds_data['choices'][0]['message']['content']
        usage = ds_data.get('usage', {})
        prompt_tokens = usage.get('prompt_tokens', 0)
        completion_tokens = usage.get('completion_tokens', 0)
        total_tokens = usage.get('total_tokens', 0)

        # Уменьшаем счётчик и логируем
        cur.execute(
            "UPDATE licenses SET requests_left = requests_left - 1 WHERE id = %s RETURNING requests_left",
            (lic_id,),
        )
        new_left = cur.fetchone()[0]

        cur.execute(
            "INSERT INTO requests_log (license_key, user_id, prompt_tokens, completion_tokens, total_tokens, prompt_preview) "
            "VALUES (%s, %s, %s, %s, %s, %s)",
            (api_key, user_id, prompt_tokens, completion_tokens, total_tokens, prompt[:200]),
        )
        conn.commit()

        return _resp(200, {
            'success': True,
            'response': answer,
            'requests_left': new_left,
        })

    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        return _resp(502, {'success': False, 'error': f'DeepSeek error: {err_body[:300]}'})
    finally:
        cur.close()
        conn.close()
