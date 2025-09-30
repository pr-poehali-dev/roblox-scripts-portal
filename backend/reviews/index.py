'''
Business: API для управления отзывами к скриптам
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными отзывов
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            script_id = query_params.get('script_id')
            
            if script_id:
                cursor.execute(
                    "SELECT * FROM t_p10328449_roblox_scripts_porta.reviews WHERE script_id = %s ORDER BY created_at DESC",
                    (script_id,)
                )
                reviews = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(r) for r in reviews], default=str),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'script_id parameter required'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            script_id = body_data.get('script_id')
            user_name = body_data.get('user_name')
            rating = body_data.get('rating')
            comment = body_data.get('comment', '')
            
            if not all([script_id, user_name, rating]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'script_id, user_name, and rating are required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                """INSERT INTO t_p10328449_roblox_scripts_porta.reviews (script_id, author, rating, comment) 
                VALUES (%s, %s, %s, %s) RETURNING *""",
                (script_id, user_name, rating, comment)
            )
            
            new_review = cursor.fetchone()
            
            cursor.execute(
                """UPDATE t_p10328449_roblox_scripts_porta.scripts 
                SET rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM t_p10328449_roblox_scripts_porta.reviews WHERE script_id = %s)
                WHERE id = %s""",
                (script_id, script_id)
            )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_review), default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()