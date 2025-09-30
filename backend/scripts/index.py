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

def escape_sql_string(value):
    if value is None:
        return 'NULL'
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"

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
        
        query_params = event.get('queryStringParameters') or {}
        script_id = query_params.get('id')
        
        if method == 'GET':
            if script_id:
                query = f"SELECT * FROM t_p10328449_roblox_scripts_porta.scripts WHERE id = {escape_sql_string(script_id)}"
                cursor.execute(query)
                script = cursor.fetchone()
                
                if script:
                    reviews_query = f"SELECT * FROM t_p10328449_roblox_scripts_porta.reviews WHERE script_id = {escape_sql_string(script_id)} ORDER BY created_at DESC"
                    cursor.execute(reviews_query)
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
                
                if category and category != 'All':
                    query += f" AND category = {escape_sql_string(category)}"
                
                if game and game != 'All Games':
                    query += f" AND game = {escape_sql_string(game)}"
                
                if search:
                    search_escaped = escape_sql_string(f'%{search}%')
                    query += f" AND (name ILIKE {search_escaped} OR description ILIKE {search_escaped})"
                
                query += " ORDER BY downloads DESC, rating DESC"
                
                cursor.execute(query)
                scripts = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(s) for s in scripts], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            query = f"""INSERT INTO t_p10328449_roblox_scripts_porta.scripts 
            (name, description, script_content, category, game, author, verified) 
            VALUES (
                {escape_sql_string(body_data.get('name'))},
                {escape_sql_string(body_data.get('description'))},
                {escape_sql_string(body_data.get('script_content'))},
                {escape_sql_string(body_data.get('category'))},
                {escape_sql_string(body_data.get('game'))},
                {escape_sql_string(body_data.get('author', 'Anonymous'))},
                {escape_sql_string(body_data.get('verified', False))}
            ) 
            RETURNING *"""
            
            cursor.execute(query)
            new_script = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(new_script), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            if not script_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Script ID required'}),
                    'isBase64Encoded': False
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            update_fields = []
            
            for field in ['name', 'description', 'script_content', 'category', 'game', 'author', 'verified']:
                if field in body_data:
                    update_fields.append(f"{field} = {escape_sql_string(body_data[field])}")
            
            if update_fields:
                update_fields.append("updated_at = CURRENT_TIMESTAMP")
                
                query = f"UPDATE t_p10328449_roblox_scripts_porta.scripts SET {', '.join(update_fields)} WHERE id = {escape_sql_string(script_id)} RETURNING *"
                cursor.execute(query)
                
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
            if not script_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Script ID required'}),
                    'isBase64Encoded': False
                }
            
            query = f"DELETE FROM t_p10328449_roblox_scripts_porta.scripts WHERE id = {escape_sql_string(script_id)} RETURNING id"
            cursor.execute(query)
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