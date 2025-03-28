import os
import json
import requests
import time
from datetime import datetime, timedelta, timezone


ESTADOS_MAP = {
    'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
    'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 
    'Espírito Santo': 'ES', 'Goiás': 'GO', 'Maranhão': 'MA',
    'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS', 'Minas Gerais': 'MG',
    'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR', 'Pernambuco': 'PE',
    'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR',
    'Santa Catarina': 'SC', 'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO'
}

DE_PARA_MAIN = {
    'order_id': 'ordem_de_inscricao',
    'ticket_number': 'n__do_ingresso',
    'first_name': 'firstname',
    'last_name': 'lastname',
    'ticket_name': 'tipo_de_ingresso',
    'ticket_sale_price': 'valor_do_ingresso',
    'order_date': 'onboarding_complete_date',
    'order_status': 'estado_de_pagamento',
    'email': 'email',
    'checkin_date': 'data_check_in_sympla',
    'discount_code': 'codigo_desconto___sympla',
    'payment_method': 'metodo_de_pagamento_sympla',
    'utm_source': 'utm_source',
    'utm_medium': 'utm_medium',
    'utm_campaign': 'utm_campaign',
    'utm_term': 'utm_term',
    'utm_content': 'utm_content',
    'user_agent': 'user_agent_sympla',
    'referrer': 'reffer_sympla',
    'pdv': 'pdv_sympla'
}

DE_PARA_CUSTOM_FORMS = {
    'Telefone': 'phone',
    'Celular': 'phone',
    'Telefone/Celular': 'phone',
    'Cidade': 'city',
    'Estado': 'estado',
    'Escolaridade': 'escolaridade_sympla',
    'Você é aluno IPOG': 'voce_e_aluno_ipog_',
    'Você é Aluno IPOG?': 'voce_e_aluno_ipog_',
  	'Você é Aluno IPOG': 'voce_e_aluno_ipog_',
  	'"Você é Aluno IPOG"': 'voce_e_aluno_ipog_',
  	'Voce é Aluno IPOG?': 'voce_e_aluno_ipog_',
    'Empresa em que Trabalha': 'company',
  	'Área de Atuação': 'area_de_atuacao',
    'Função na empresa': 'hs_role',
    'LI E CONCORDO COM O AVISO DE PRIVACIDADE': 'aceite_termo_de_uso___sympla',
 	'“LI E CONCORDO COM O AVISO DE PRIVACIDADE”': 'aceite_termo_de_uso___sympla'
}

def get_paginated_data(url, headers, params=None, time_limit=15):
    all_data = []
    page = 1
    start_time = time.time()
    
    while True:
        if time.time() - start_time > time_limit:
            print(f"Limite de tempo atingido após página {page-1}.")
            break
            
        try:
            current_params = {'page': page, 'page_size': 200}
            if params:
                current_params.update(params)
            
            response = requests.get(url, headers=headers, params=current_params)
            response.raise_for_status()
            
            data = response.json()
            all_data.extend(data.get('data', []))
            
            if data.get('pagination', {}).get('has_next'):
                page += 1
                time.sleep(0.2)
            else:
                break
                
        except requests.exceptions.RequestException as e:
            print(f'Erro na requisição: {str(e)}')
            break
            
    return all_data

def get_event_orders(event_id, headers, time_limit=5):
    orders_url = f"https://api.sympla.com.br/public/v3/events/{event_id}/orders"
    orders = get_paginated_data(orders_url, headers, time_limit=time_limit)
    
    orders_dict = {}
    for order in orders:
        orders_dict[order['id']] = order
    
    print(f"Recuperados {len(orders)} pedidos para o evento {event_id}")
    return orders_dict

def extract_utm_data(order):
    utm_data = {}
    
    if utm := order.get('utm', {}):
        utm_data = {
            'utm_source': utm.get('utm_source'),
            'utm_medium': utm.get('utm_medium'),
            'utm_campaign': utm.get('utm_campaign'),
            'utm_term': utm.get('utm_term'),
            'utm_content': utm.get('utm_content'),
            'user_agent': utm.get('user_agent'),
            'referrer': utm.get('referrer')
        }
    else:
        utm_data = {
            'utm_source': order.get('utm_source'),
            'utm_medium': order.get('utm_medium'),
            'utm_campaign': order.get('utm_campaign'),
            'utm_term': order.get('utm_term'),
            'utm_content': order.get('utm_content'),
            'user_agent': order.get('user_agent'),
            'referrer': order.get('referrer')
        }
        
    return utm_data

def map_sympla_to_hubspot(participant, event, orders_data):
    properties = {}
    unmapped = {}

    order_id = participant.get('order_id')
    if order_id and order_id in orders_data:
        order = orders_data[order_id]
        
        participant['discount_code'] = order.get('discount_code')
        participant['payment_method'] = order.get('transaction_type')
        
        utm_data = extract_utm_data(order)
        participant.update(utm_data)

    for sympla_field, hubspot_field in DE_PARA_MAIN.items():
        if value := participant.get(sympla_field):
            properties[hubspot_field] = value

    for field in participant.get('custom_form', []):
        field_name = field.get('name', '').strip()
        if hubspot_field := DE_PARA_CUSTOM_FORMS.get(field_name):
            properties[hubspot_field] = field.get('value', '')
        else:
            unmapped[field_name] = field.get('value', '')


    if estado_valor := next((f['value'] for f in participant.get('custom_form', []) 
                            if f.get('name') == 'Estado'), None):
        if estado_valor and len(estado_valor) == 2 and estado_valor.upper() in ESTADOS_MAP.values():
            properties['estado'] = estado_valor.upper()
        else:
            properties['estado'] = ESTADOS_MAP.get(estado_valor, '')

    if data_str := event.get('start_date'):
        try:
            date_part = data_str.split()[0]
            data_obj = datetime.strptime(date_part, "%Y-%m-%d")
            data_obj_utc = data_obj.replace(tzinfo=timezone.utc)
            properties['last_sympla_event_date'] = int(data_obj_utc.timestamp() * 1000)
        except Exception as e:
            print(f"Erro na data: {str(e)}")
            properties['last_sympla_event_date'] = None

    if onboarding_date_str := properties.get('onboarding_complete_date'):
        try:
            data_obj = datetime.strptime(onboarding_date_str, "%Y-%m-%d %H:%M:%S")
            data_obj = data_obj.replace(hour=0, minute=0, second=0, microsecond=0)
            data_obj = data_obj.replace(tzinfo=timezone.utc)
            properties['onboarding_complete_date'] = int(data_obj.timestamp() * 1000)
        except Exception as e:
            print(f"Erro ao converter onboarding_complete_date: {str(e)}")
            properties.pop('onboarding_complete_date', None)

    event_name = event.get('name')
    event_id = event.get('id')
    print(f"Valores encontrados - Nome: '{event_name}', ID: '{event_id}'")
    
    properties['nome_do_evento_sympla'] = event_name
    properties['id_do_evento'] = str(event_id) if event_id else ""
    properties['identificador'] = participant.get('ticket_num_qr_code')

    if unmapped:
        try:
            json_str = json.dumps(unmapped, ensure_ascii=False, separators=(',', ':'))
            
            if len(json_str) > 5000:
                json_str = json_str[:4990] + '...'
                print(f"JSON truncado devido ao tamanho: {len(json_str)} caracteres")
            
            properties['unmapped_sympla_data'] = json_str
            print(f"Dados não mapeados: {json_str[:100]}...")
        except Exception as e:
            print(f"Erro ao serializar dados não mapeados: {str(e)}")
            properties['unmapped_sympla_data'] = str(unmapped)[:1000]


    return {
        'properties': {k: v for k, v in properties.items() if v not in [None, '']}
    }

def process_batch(batch, hubspot_headers, batch_upsert_url):
    seen_emails = set()
    unique_batch = []
    
    for contact in batch:
        email = contact['properties'].get('email')
        if email and email not in seen_emails:
            seen_emails.add(email)
            unique_batch.append(contact)
    
    if not unique_batch:
        return True 
    
    payload = {
        "inputs": [{
            "id": contact['properties'].get('email'),
            "idProperty": "email",
            "properties": contact['properties']
        } for contact in unique_batch if contact['properties'].get('email')]
    }

    if not payload["inputs"]:
        return True 
    
    try:
        response = requests.post(
            batch_upsert_url,
            json=payload,
            headers=hubspot_headers
        )
        #print(payload)
        
        if response.status_code == 200:
            results = response.json().get('results', [])
            success_count = sum(1 for r in results if r.get('status') != 'ERROR')
            print(f"Batch processado: {success_count} sucessos, {len(results) - success_count} erros")
            return True
        else:
            print(f'Erro no batch: {response.status_code}')
            return False
            
    except Exception as e:
        print(f'Falha no batch: {str(e)}')
        return False

def main(event):
    try:
        SYMPLA_TOKEN = os.environ.get('SYMPLA_TOKEN')
        HUBSPOT_TOKEN = os.environ.get('HUBSPOT_TOKEN_SYMPLA')
        
        HEADERS_SYMPLA = {'s_token': SYMPLA_TOKEN}
        HEADERS_HUBSPOT = {
            'Authorization': f'Bearer {HUBSPOT_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        HUBSPOT_BATCH_UPSERT_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert'
        SYMPLA_EVENTS_URL = 'https://api.sympla.com.br/public/v3/events'
        
        if isinstance(event, dict) and 'inputFields' in event:
            events_raw = event['inputFields'].get('events', [])
            current_index_raw = event['inputFields'].get('event_index', 0)
        else:
            events_raw = event.get('events', [])
            current_index_raw = event.get('event_index', 0)
        
        events = []
        if isinstance(events_raw, list):
            for evt in events_raw:
                if isinstance(evt, dict):
                    events.append(evt)
                elif isinstance(evt, str):
                    try:
                        evt_dict = json.loads(evt)
                        if isinstance(evt_dict, dict):
                            events.append(evt_dict)
                    except:
                        print(f"Evento ignorado - formato inválido: {evt}")
        elif isinstance(events_raw, str):
            try:
                events_parsed = json.loads(events_raw)
                if isinstance(events_parsed, list):
                    for evt in events_parsed:
                        if isinstance(evt, dict):
                            events.append(evt)
            except:
                print(f"Não foi possível interpretar eventos como JSON: {events_raw[:100]}...")
        
        print(f"Eventos processados: {len(events)}")
        
        try:
            current_index = int(current_index_raw)
        except (ValueError, TypeError):
            current_index = 0
        
        if not events or current_index >= len(events):
            return {
                "outputFields": {
                    "status1": "complete",
                    "message": "Todos os eventos foram processados com sucesso."
                }
            }
        
        start_time = time.time()
        max_execution_time = 18  
        
        processed_events = []
        remaining_events = []
        
        for i in range(current_index, len(events)):
            if time.time() - start_time > max_execution_time:
                remaining_events = events[i:]
                break
                
            current_event = events[i]
            
            if not isinstance(current_event, dict):
                print(f"Ignorando evento inválido no índice {i}: {current_event}")
                continue
                
            event_id = current_event.get('id')
            event_name = current_event.get('name')
            
            if not event_id:
                print(f"Ignorando evento sem ID no índice {i}")
                continue
                
            print(f"\nProcessando evento: {event_name} (ID: {event_id})")
      
            event_details_response = requests.get(
                f"{SYMPLA_EVENTS_URL}/{event_id}",
                headers=HEADERS_SYMPLA
            )

            if event_details_response.status_code != 200:
                print(f"Erro ao obter detalhes do evento {event_id}")
                processed_events.append({
                    "id": event_id,
                    "name": event_name,
                    "status1": "error",
                    "message": "Falha ao obter detalhes do evento"
                })
                continue

            
            event_details_raw = event_details_response.json()
            print(f"Recebido da API: {json.dumps({k: type(v).__name__ for k, v in event_details_raw.items()})}")

            if isinstance(event_details_raw, dict) and 'data' in event_details_raw:
                event_details = event_details_raw['data']
            else:
                event_details = event_details_raw

            if not event_details.get('name'):
                event_details['name'] = current_event.get('name', "Nome não disponível")

            if not event_details.get('id'):
                event_details['id'] = event_id

            print(f"Usando evento com Nome: '{event_details.get('name')}', ID: '{event_details.get('id')}'")
            
            orders_data = get_event_orders(event_id, HEADERS_SYMPLA, time_limit=3)
            
            participants = get_paginated_data(
                f"{SYMPLA_EVENTS_URL}/{event_id}/participants",
                HEADERS_SYMPLA,
                time_limit=5
            )
            
            if not participants:
                processed_events.append({
                    "id": event_id,
                    "name": event_name,
                    "status": "processed",
                    "participants_count": 0,
                    "message": "Nenhum participante encontrado"
                })
                continue
                
            contacts = [map_sympla_to_hubspot(p, event_details, orders_data) for p in participants]
            
            batch_size = 50
            batches_processed = 0
            contacts_processed = 0
            
            for j in range(0, len(contacts), batch_size):
                # Verificar tempo restante
                if time.time() - start_time > max_execution_time:
                    remaining_events = events[i:]
                    break
                    
                batch = contacts[j:j+batch_size]
                if process_batch(batch, HEADERS_HUBSPOT, HUBSPOT_BATCH_UPSERT_URL):
                    batches_processed += 1
                    contacts_processed += len(batch)
                
            processed_events.append({
                "id": event_id,
                "name": event_name,
                "status": "processed",
                "participants_count": contacts_processed,
                "batches_processed": batches_processed
            })
        
        if remaining_events:
            status = "incomplete"
            next_index = len(events) - len(remaining_events)
        else:
            status = "complete"
            next_index = len(events)
        
        return {
            "outputFields": {
                "status1": status,
                "events": events,  
                "event_index": next_index, 
                "processed_events": processed_events,
                "processed_count": len(processed_events),
                "remaining_count": len(remaining_events)
            }
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        
        return {
            "outputFields": {
                "status1": "error",
                "message": str(e),
                "error_details": error_details,
                "events": events if 'events' in locals() else [],
                "event_index": current_index if 'current_index' in locals() else 0
            }
        }