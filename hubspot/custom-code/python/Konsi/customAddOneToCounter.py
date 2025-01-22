import os
import random
from hubspot import HubSpot
from hubspot.crm.objects import ApiException, SimplePublicObjectInput
from hubspot.crm.objects.models import PublicObjectSearchRequest, Filter, FilterGroup

def main(event):
  hubspot = HubSpot(access_token=os.getenv('token'))
  executivo_id = event.get('inputFields').get('novo_owner_id') if event.get('inputFields').get('novo_owner_id') is not None else event.get('inputFields').get('executivo_id')
  count_negocios_dia = event.get('inputFields').get('novo_count_dia') if event.get('inputFields').get('novo_count_dia') is not None else event.get('inputFields').get('count_negocios_dia')
  custom_object_id = "2-39459982"

  try:
    hubspot.crm.objects.basic_api.update(
      object_type=custom_object_id,
      object_id=executivo_id,
      simple_public_object_input=SimplePublicObjectInput(properties={"count_negocios_dia": int(count_negocios_dia) + 1})
    )

    return {"outputFields": {"status_atualizacao": "Atualizado", "executivo_id": executivo_id}}

  except ApiException as e:
    print(f"Erro na API do HubSpot: {e}")
    return {"outputFields": {"status_atualizacao": "Não atualizado"}}
