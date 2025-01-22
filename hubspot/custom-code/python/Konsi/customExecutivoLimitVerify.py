import os
import random
from hubspot import HubSpot
from hubspot.crm.objects import ApiException, SimplePublicObjectInput
from hubspot.crm.objects.models import PublicObjectSearchRequest, Filter, FilterGroup

def main(event):
    # Como utilizar os inputs
    # Obtém os valores das propriedades "count_negocios_dia" e "limite_de_negocios_dia" dos inputs do workflow
    hubspot = HubSpot(access_token=os.getenv("token"))
    custom_object_id = "2-39459982"
    
    ## Buscar objeto Executivo pelo seu owner, comparando com o owner do deal
    try:
      hubspot_owner_id = event.get('inputFields').get('hubspot_owner_id')
      search_request = PublicObjectSearchRequest(
        filter_groups=[
          FilterGroup(filters=[
            Filter(property_name="hubspot_owner_id", operator="EQ", value=hubspot_owner_id)
          ])
        ],
        properties=["equipe", "e_mail", "hubspot_owner_id", "count_negocios_dia", "limite_de_negocios_dia", "equipe"]
      )
      search_response = hubspot.crm.objects.search_api.do_search(
        object_type=custom_object_id,
        public_object_search_request=search_request
      )

    except ValueError:
      print('Erro')

    # Realiza a verificação de comparação conforme o contexto
    print(search_response.results[0])
    count_negocios_dia = search_response.results[0].properties['count_negocios_dia']
    limite_de_negocios_dia = search_response.results[0].properties['limite_de_negocios_dia']
    equipe = search_response.results[0].properties['equipe']
    executivo_id = None
    
    if count_negocios_dia is not None and limite_de_negocios_dia is not None:
        try:
            count_negocios_dia = int(count_negocios_dia)
            limite_de_negocios_dia = int(limite_de_negocios_dia)

            if count_negocios_dia >= limite_de_negocios_dia:
                status_limite = "Sim"
            else:
                status_limite = "Não"
                executivo_id = search_response.results[0].id
        except ValueError:
            # Trata casos onde os inputs não sejam convertíveis para inteiros
            status_limite = "Erro: Valores inválidos"
    else:
        # Trata casos onde as variáveis não estejam definidas nos inputs
        status_limite = "Erro: Inputs ausentes"

    # Retorna os resultados como outputs para as próximas ações no workflow
    return {
        "outputFields": {
            "status_limite": status_limite,
          	"executivo_id": executivo_id,
          	"count_negocios_dia": count_negocios_dia,
          	"equipe": equipe
        }
    }