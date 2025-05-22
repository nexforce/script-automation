import os
import json
import requests

def main(event):
    token = os.getenv('HUBSPOT_TOKEN_NX_LINE_ITEMS')
    if not token:
        raise ValueError("Token de acesso da HubSpot não encontrado")
    
    deal_id = event.get('object', {}).get('objectId')
    
    itens_estruturados_json = event.get('inputFields', {}).get('itens_estruturados')
    if not itens_estruturados_json:
        raise ValueError("Lista de itens estruturados não fornecida")
    

    tempo_locacao = event.get('inputFields', {}).get('qual_o_tempo_de_locacao_')
    recurring_billing_period = None
    if tempo_locacao:
        mapping = {
            "Abaixo de 1 mês": "P1M",
            "1 mês": "P1M",
            "2 meses": "P2M",
            "3 meses": "P3M",
            "4 meses": "P4M",
            "5 meses": "P5M",
            "6 meses": "P6M",
            "7 meses": "P7M",
            "8 meses": "P8M",
            "9 meses": "P9M"
        }
        recurring_billing_period = mapping.get(tempo_locacao, None)
    
    try:
        itens_estruturados = json.loads(itens_estruturados_json)
    except json.JSONDecodeError:
        raise ValueError("Formato inválido para itens_estruturados")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    resultados = []
    total_criados = 0
    
    for item in itens_estruturados:
        equipamento = item.get('equipamento')
        quantidade = item.get('quantidade', 1)
        
        if not equipamento:
            continue
        
        print(f"Processando equipamento: {equipamento}, quantidade: {quantidade}")
        
        produto = buscar_produto(equipamento, headers)
        
        if not produto:
            print(f"Produto não encontrado: {equipamento}")
            resultados.append({
                "equipamento": equipamento,
                "quantidade": quantidade,
                "status": "produto_nao_encontrado"
            })
            continue
        
        produto_id = produto.get('id')
        produto_nome = produto.get('properties', {}).get('name')
        print(f"Produto encontrado: {produto_nome} (ID: {produto_id})")
        
        success, line_item = criar_line_item_com_associacao(
            produto_id, quantidade, produto_nome, deal_id, headers, recurring_billing_period
        )
        
        if success:
            line_item_id = line_item.get('id')
            print(f"Line item criado e associado com sucesso: {line_item_id}")
            total_criados += 1
            status = "criado_e_associado"
        else:
            print(f"Erro ao criar/associar line item para {equipamento}")
            status = "erro_criacao"
        
        resultados.append({
            "equipamento": equipamento,
            "quantidade": quantidade,
            "produto_id": produto_id,
            "line_item_id": line_item.get('id') if success else None,
            "status": status
        })
    
    return {
        "outputFields": {
            "resultados": json.dumps(resultados),
            "total_processados": len(resultados),
            "total_criados": total_criados
        }
    }

def buscar_produto(nome_produto, headers):
    url = "https://api.hubapi.com/crm/v3/objects/products/search"
    
    payload = {
        "filterGroups": [
            {
                "filters": [
                    {
                        "propertyName": "name",
                        "operator": "EQ",
                        "value": nome_produto
                    }
                ]
            }
        ],
        "properties": ["name", "price", "description"],
        "limit": 1
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        results = response.json().get("results", [])
        return results[0] if results else None
        
    except Exception as e:
        print(f"Erro ao buscar produto {nome_produto}: {e}")
        return None

def criar_line_item_com_associacao(produto_id, quantidade, nome_produto, deal_id, headers, recurring_billing_period=None):
    url = "https://api.hubapi.com/crm/v3/objects/line_items"
    
    properties = {
        "quantity": str(quantidade),
        "hs_product_id": produto_id,
      	"franquia_de_horas": "200",
      	"periodo_de_cobranca": "Mensal",
        "name": f"{nome_produto}"
    }
    if recurring_billing_period:
        properties["hs_recurring_billing_period"] = recurring_billing_period

    payload = {
        "properties": properties,
        "associations": [
            {
                "to": {
                    "id": deal_id
                },
                "types": [
                    {
                        "associationCategory": "HUBSPOT_DEFINED",
                        "associationTypeId": 20
                    }
                ]
            }
        ]
    }
    
    try:
        print(f"Enviando requisição para criar line item com associação ao deal {deal_id}")
        response = requests.post(url, headers=headers, json=payload)
        
        print(f"Status de resposta: {response.status_code}")
        if response.status_code >= 400:
            print(f"Erro na resposta: {response.text}")
        
        if response.status_code in [200, 201, 202]:
            return True, response.json()
        
        alt_payload = {
            "properties": properties
        }
        
        alt_response = requests.post(url, headers=headers, json=alt_payload)
        
        if alt_response.status_code in [200, 201, 202]:
            line_item = alt_response.json()
            line_item_id = line_item.get('id')
            
            assoc_url = f"https://api.hubapi.com/crm/v4/objects/line_items/{line_item_id}/associations/deals/{deal_id}"
            assoc_payload = {
                "types": [
                    {
                        "associationCategory": "HUBSPOT_DEFINED",
                        "associationTypeId": 20
                    }
                ]
            }
            
            assoc_response = requests.put(assoc_url, headers=headers, json=assoc_payload)
            
            if assoc_response.status_code in [200, 201, 202, 204]:
                print(f"Associação criada com sucesso em operação separada")
                return True, line_item
        
        return False, None
        
    except Exception as e:
        print(f"Erro ao criar line item com associação: {e}")
        return False, None