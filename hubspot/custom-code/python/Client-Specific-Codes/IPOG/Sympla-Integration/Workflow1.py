import json
import os
import requests
import time
from datetime import datetime, timedelta, timezone

def get_paginated_data(url, headers, params=None, max_pages=1):
    all_data = []
    page = 1
    
    while page <= max_pages:
        current_params = {'page': page, 'page_size': 200}
        if params:
            current_params.update(params)
        
        response = requests.get(url, headers=headers, params=current_params)
        if response.status_code != 200:
            break
            
        data = response.json()

        for event in data.get('data', []):
            all_data.append({
                'id': event.get('id'),
                'name': event.get('name')
            })
        
        if data.get('pagination', {}).get('has_next'):
            page += 1
        else:
            break
            
    return all_data

def main(event):
    try:
        SYMPLA_TOKEN = os.environ.get('SYMPLA_TOKEN')
        HEADERS_SYMPLA = {'s_token': SYMPLA_TOKEN}
        SYMPLA_EVENTS_URL = 'https://api.sympla.com.br/public/v3/events'
        
        # Receber parâmetros de entrada (se houver)
        #specific_event_id = event.inputFields.get('specific_event_id')
        specific_event_id = False
        
        if specific_event_id:
            events_response = requests.get(
                f"{SYMPLA_EVENTS_URL}/{specific_event_id}",
                headers=HEADERS_SYMPLA
            )
            
            if events_response.status_code == 200:
                event_data = events_response.json()
                events = [{
                    'id': event_data.get('id'),
                    'name': event_data.get('name')
                }]
            else:
                events = []
        else:
            events = get_paginated_data(
                SYMPLA_EVENTS_URL,
                HEADERS_SYMPLA,
                params={
                    'status': 'true',
                    'from': (datetime.now() - timedelta(days=1)).isoformat()
                },
                max_pages=2
            )
        
        if len(events) > 100:
            events = events[:100]
        
        return {
            "outputFields": {
                "events": events,
                "eventCount": len(events),
                "event_index": 0,  
                "status": "success" if events else "no_events"
            }
        }
        
    except Exception as e:
        return {
            "outputFields": {
                "status": "error",
                "message": str(e)
            }
        }