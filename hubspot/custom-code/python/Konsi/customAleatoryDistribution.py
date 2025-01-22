import os
import random
from hubspot import HubSpot
from hubspot.crm.objects import ApiException, SimplePublicObjectInput
from hubspot.crm.objects.models import PublicObjectSearchRequest, Filter, FilterGroup

def main(event):
    # Autenticação com a API do HubSpot
    hubspot = HubSpot(access_token=os.getenv('token'))
    
    # Recupera o hubspot_owner_id do input
    hubspot_owner_id = event.get('inputFields').get('hubspot_owner_id')
    equipe = event.get('inputFields').get('equipe')
    
    # ID do objeto customizado "Executivos"
    custom_object_id = "2-39459982"
    
    try:
        # Passo 1: Identifica o executivo que é da mesma equipe que o selecionado anteriormente, validando se o ID é diferente e se ele está disponível
        search_request = PublicObjectSearchRequest(
            filter_groups=[
                FilterGroup(filters=[
                    Filter(property_name="hubspot_owner_id", operator="NEQ", value=hubspot_owner_id),
                  	Filter(property_name="equipe", operator="EQ", value=equipe),
                    Filter(property_name="disponivel", operator="EQ", value=True)
                ])
            ],
            properties=["equipe", "e_mail", "hubspot_owner_id", "count_negocios_dia"]
        )
        search_response = hubspot.crm.objects.search_api.do_search(
            object_type=custom_object_id,
            public_object_search_request=search_request
        )
        
        print(search_response)
        
        if not search_response.results:
            return {"outputFields": {"status_distribuicao": "Não redistribuído"}}
                
        # Passo 2: Selecionar um executivo aleatório da lista de resultados
        novo_executivo = random.choice(search_response.results)
        novo_hubspot_owner_id = novo_executivo.properties.get('hubspot_owner_id')
        
        # Passo 3: Atualizar o proprietário do negócio
        negocio_id = event.get('object').get('objectId')
        hubspot.crm.objects.basic_api.update(
            object_type="deals",
            object_id=negocio_id,
            simple_public_object_input=SimplePublicObjectInput(properties={"hubspot_owner_id": novo_hubspot_owner_id})
        )
        
        return {"outputFields": {"status_distribuicao": "Redistribuido", "novo_owner_id": novo_executivo.id, "novo_count_dia": novo_executivo.properties.get('count_negocios_dia')}}
    
    except ApiException as e:
        print(f"Erro na API do HubSpot: {e}")
        return {"outputFields": {"status_distribuicao": "Não redistribuído"}}
