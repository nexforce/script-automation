import os
import json
import requests
import time
from datetime import datetime, timedelta, timezone


SYMPLA_TOKEN = ''
HUBSPOT_TOKEN = ''

HEADERS_SYMPLA = {'s_token': SYMPLA_TOKEN}
HEADERS_HUBSPOT = {
    'Authorization': f'Bearer {HUBSPOT_TOKEN}',
    'Content-Type': 'application/json'
}


SYMPLA_EVENTS_URL = 'https://api.sympla.com.br/public/v3/events'
HUBSPOT_BATCH_UPSERT_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert'


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
    'first_name': 'nome',
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
    'Cidade': 'city',
    'Estado': 'estado',
    'Escolaridade': 'escolaridade_sympla',
    'Você é aluno IPOG': 'voce_e_aluno_ipog_',
    'Empresa em que trabalha': 'company',
    'Função na empresa': 'hs_role',
    'LI E CONCORDO COM O AVISO DE PRIVACIDADE': 'aceite_termo_de_uso___sympla'
}

def get_paginated_data(url, headers, params=None):
    all_data = []
    page = 1
    
    while True:
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
                time.sleep(0.5)  # Respeita rate limit
            else:
                break
                
        except requests.exceptions.RequestException as e:
            print(f'Erro na requisição: {str(e)}')
            break
            
    return all_data

def get_event_orders(event_id):
    orders_url = f"{SYMPLA_EVENTS_URL}/{event_id}/orders"
    orders = get_paginated_data(orders_url, HEADERS_SYMPLA)
    
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

    # Enriquecer participante com dados do pedido
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

    if estado_nome := next((f['value'] for f in participant.get('custom_form', []) 
                          if f.get('name') == 'Estado'), None):
        properties['estado'] = ESTADOS_MAP.get(estado_nome, '')

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

    properties.update({
        'nome_do_evento_sympla': event.get('name'),
        'id_do_evento': str(event.get('id')),
        'identificador': participant.get('ticket_num_qr_code')
    })

    if unmapped:
        try:
            properties['unmapped_sympla_data'] = json.dumps(
                unmapped, 
                ensure_ascii=False, 
                separators=(',', ':')
            )
        except Exception as e:
            print(f"Erro ao serializar dados não mapeados: {str(e)}")

    return {
        'properties': {k: v for k, v in properties.items() if v not in [None, '']}
    }

def process_batch(batch):
    seen_emails = set()
    unique_batch = []
    
    for contact in batch:
        email = contact['properties'].get('email')
        if email and email not in seen_emails:
            seen_emails.add(email)
            unique_batch.append(contact)
        elif email:
            print(f"Email duplicado removido do lote: {email}")
    
    payload = {
        "inputs": [{
            "id": contact['properties'].get('email'),
            "idProperty": "email",
            "properties": contact['properties']
        } for contact in unique_batch]
    }

    for item in payload["inputs"]:
        item["properties"] = {k: v for k, v in item["properties"].items() if v not in [None, ""]}
    
    #print("Payload enviado:", json.dumps(payload, indent=2))
    
    try:
        response = requests.post(
            HUBSPOT_BATCH_UPSERT_URL,
            json=payload,
            headers=HEADERS_HUBSPOT
        )
        
        if response.status_code == 200:
            return handle_batch_response(response.json())
        else:
            print(f'Erro no batch: {response.status_code} - {response.text}')
            return False
            
    except Exception as e:
        print(f'Falha no batch: {str(e)}')
        return False

def handle_batch_response(response_data):
    success_count = 0
    for result in response_data.get('results', []):
        if result.get('status') == 'ERROR':
            print(f"Erro em {result.get('properties', {}).get('email')}: {result.get('message')}")
        else:
            success_count += 1
    print(f"Batch processado: {success_count} sucessos, {len(response_data.get('results', [])) - success_count} erros")
    return success_count > 0

def main():
    events = get_paginated_data(
        SYMPLA_EVENTS_URL,
        HEADERS_SYMPLA,
        params={
            'status': 'true',
            #'from': (datetime.now() - timedelta(days=30)).isoformat()
            'from': '2025-03-19T14:41:01.394740'
        }
    )
    
    print(f"Encontrados {len(events)} eventos")
    
    for event in events:
        event_id = event['id']
        print(f"\nProcessando evento: {event['name']} (ID: {event_id})")
        
        orders_data = get_event_orders(event_id)
        
        participants = get_paginated_data(
            f"{SYMPLA_EVENTS_URL}/{event_id}/participants",
            HEADERS_SYMPLA
        )
        
        print(f"Encontrados {len(participants)} participantes")
        
        print("Mapeando dados para estrutura HubSpot...")
        contacts = [map_sympla_to_hubspot(p, event, orders_data) for p in participants]
        
        batch_size = 100
        batch_count = (len(contacts) + batch_size - 1) // batch_size 
        
        print(f"Processando {len(contacts)} contatos em {batch_count} lotes")
        
        for i in range(0, len(contacts), batch_size):
            batch = contacts[i:i+batch_size]
            print(f"Processando lote {i//batch_size + 1}/{batch_count} com {len(batch)} contatos")
            if process_batch(batch):
                print(f"Lote {i//batch_size + 1} processado com sucesso")
            else:
                print(f"Falha no processamento do lote {i//batch_size + 1}")
            
            if i + batch_size < len(contacts):
                time.sleep(1)

if __name__ == '__main__':
    main()