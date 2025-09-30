'''
Business: API для управления скриптами Roblox (CRUD операции)
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными скриптов
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
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
            path_params = event.get('pathParams') or {}
            script_id = path_params.get('id')
            
            if script_id:
                cursor.execute(
                    "SELECT * FROM t_p10328449_roblox_scripts_porta.scripts WHERE id = %s",
                    (script_id,)
                )
                script = cursor.fetchone()
                
                if script:
                    cursor.execute(
                        "SELECT * FROM t_p10328449_roblox_scripts_porta.reviews WHERE script_id = %s ORDER BY created_at DESC",
                        (script_id,)
                    )
                    reviews = cursor.fetchall()
                    
                    result = dict(script)
                    result['reviews'] = [dict(r) for r in reviews]
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(result, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Script not found'}),
                        'isBase64Encoded': False
                    }
            else:
                category = query_params.get('category')
                game = query_params.get('game')
                search = query_params.get('search')
                
                query = "SELECT * FROM t_p10328449_roblox_scripts_porta.scripts WHERE 1=1"
                params = []
                
                if category and category != 'All':
                    query += " AND category = %s"
                    params.append(category)
                
                if game and game != 'All Games':
                    query += " AND game = %s"
                    params.append(game)
                
                if search:
                    query += " AND (name ILIKE %s OR description ILIKE %s)"
                    search_pattern = f'%{search}%'
                    params.extend([search_pattern, search_pattern])
                
                query += " ORDER BY downloads DESC, rating DESC"
                
                cursor.execute(query, params)
                scripts = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(s) for s in scripts], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cursor.execute(
                """INSERT INTO t_p10328449_roblox_scripts_porta.scripts 
                (name, description, script_content, category, game, author, verified) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) 
                RETURNING *""",
                (
                    body_data.get('name'),
                    body_data.get('description'),
                    body_data.get('script_content'),
                    body_data.get('category'),
                    body_data.get('game'),
                    body_data.get('author', 'Anonymous'),
                    body_data.get('verified', False)
                )
            )
            
            new_script = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_script), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            path_params = event.get('pathParams') or {}
            script_id = path_params.get('id')
            
            if not script_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Script ID required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            update_fields = []
            params = []
            
            for field in ['name', 'description', 'script_content', 'category', 'game', 'author', 'verified']:
                if field in body_data:
                    update_fields.append(f"{field} = %s")
                    params.append(body_data[field])
            
            if update_fields:
                update_fields.append("updated_at = CURRENT_TIMESTAMP")
                params.append(script_id)
                
                query = f"UPDATE t_p10328449_roblox_scripts_porta.scripts SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
                cursor.execute(query, params)
                
                updated_script = cursor.fetchone()
                conn.commit()
                
                if updated_script:
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(dict(updated_script), default=str),
                        'isBase64Encoded': False
                    }
            
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Script not found'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            path_params = event.get('pathParams') or {}
            script_id = path_params.get('id')
            
            if not script_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Script ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("DELETE FROM t_p10328449_roblox_scripts_porta.scripts WHERE id = %s RETURNING id", (script_id,))
            deleted = cursor.fetchone()
            conn.commit()
            
            if deleted:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Script deleted', 'id': deleted['id']}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Script not found'}),
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