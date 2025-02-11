import requests
from datetime import datetime, timedelta
import time
import json
import os


def get_salesforce_access_token():
    client_id = os.getenv("client_id")
    client_secret = os.getenv("client_secret")
    username = os.getenv("username")
    password = os.getenv("password")

    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "username": username,
        "password": password
    }

    auth_response = requests.post(f"{SF_INSTANCE_URL}/services/oauth2/token", data=data)
    auth_response_json = auth_response.json()
    return auth_response_json["access_token"], auth_response_json["instance_url"]


yesterday = datetime.now() - timedelta(days=1)
yesterday_timestamp = int(yesterday.timestamp())
integration_logs = []

def create_log_entry(hubspot_id, salesforce_id, operation_type, status, error=None, fields=None):
    return {
        "timestamp": datetime.now().isoformat(),
        "hubspot_deal_id": hubspot_id,
        "salesforce_opportunity_id": salesforce_id,
        "operation_type": operation_type,
        "status": status,
        "error_message": error,
        "fields_processed": fields or [],
        "processing_duration": None,
        "deal_stage": None,
        "processing_details": None
    }

def batch_update_salesforce_records(records, object_type='Opportunity'):
    batch_size = 25
    url = f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/composite/sobjects"
    headers = {
        'Authorization': f'Bearer {SF_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    results = []
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        composite_request = {
            "allOrNone": False,
            "records": [
                {**record, "attributes": {"type": object_type}} 
                for record in batch
            ]
        }
        
        response = requests.patch(url, headers=headers, json=composite_request)
        if response.status_code == 200:
            results.extend(response.json())
        else:
            raise Exception(f"Batch update failed: {response.text}")
            
    return results


def create_single_salesforce_opportunity(record, object_type='Opportunity'):
    url = f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/sobjects/{object_type}"
    headers = {
        'Authorization': f'Bearer {SF_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, headers=headers, json=record)
    response_json = response.json() if not isinstance(response.json(), list) else response.json()[0]
    
    if (response.status_code != 201 and 
        response_json.get('errorCode') == 'INACTIVE_OWNER_OR_USER'):
        record_without_owner = record.copy()
        record_without_owner.pop('OwnerId', None)
        retry_response = requests.post(url, headers=headers, json=record_without_owner)
        
        if retry_response.status_code == 201:
            return {
                'success': True,
                'id': retry_response.json().get('id'),
                'errors': []
            }
        else:
            return {
                'success': False,
                'errors': [retry_response.json()]
            }
    
    if response.status_code == 201:
        return {
            'success': True,
            'id': response.json().get('id'),
            'errors': []
        }
    else:
        return {
            'success': False,
            'errors': [response.json()]
        }


def update_hubspot_deal(deal_id, opportunity_id):
    hubspot_url = f"https://api.hubapi.com/crm/v3/objects/deals/{deal_id}"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {HUBSPOT_API_KEY}'
    }
    payload = {
        "properties": {
            "idoportunidade__c": opportunity_id
        }
    }
    response = requests.patch(hubspot_url, json=payload, headers=headers)
    return response.json()

def fetch_hubspot_owner(owner_id):
    hubspot_url = f"https://api.hubapi.com/crm/v3/owners/{owner_id}"
    headers = {
        'Authorization': f'Bearer {HUBSPOT_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(hubspot_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None


def find_salesforce_user_by_email(email):
    query_url = f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/query"
    query = f"SELECT Id, Name, Email FROM User WHERE Email = '{email}'"
    
    headers = {
        'Authorization': f'Bearer {SF_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(query_url, headers=headers, params={'q': query})
    records = response.json().get('records', [])
    return records[0] if records else None


def fetch_hubspot_deals():
    deals = []
    has_more = True
    after = None

    while has_more:
        hubspot_url = "https://api.hubapi.com/crm/v3/objects/deals/search"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {HUBSPOT_API_KEY}'
        }
        payload = {
            "filterGroups": [{
                "filters": [
                    {
                        "propertyName": "pipeline",
                        "operator": "EQ",
                        "value": "6e65ceb6-a462-40cb-84db-30f7037697d5"
                    },
                    {
                        "propertyName": "hs_lastmodifieddate",
                        "operator": "GTE",
                        "value": yesterday_timestamp
                    }
                ]
            }],
        "properties": [
            "dealname","hubspot_owner_id", "amount", "closedate", "pipeline", "dealstage",
            "ano_da_venda_c", "proprietario_de_ga", "contato_imobiliaria_c",
            "dataoportunidade__c", "datavenda__c", "diretor_de_vendas_c",
            "email_principal__c", "gerente_de_vendas_c", "gerente_regional_c",
            "idoportunidade__c", "imobiliaria_c", "leadsource", "nome_imobiliaria_c",
            "numerovenda__c", "observa_o__c", "observacoes_sdr", "observacoesga__c",
            "produto_c", "regionalcomercial__c", "tipodevenda__c", "unidadenegocio__c",
            "valor_real_de_venda_c", "b_adimplencia__c", "banco__c", "bonificaritbi__c",
            "bonificarregistro__c", "bonus_cr__c", "codigosprodutouau__c", "campaignid",
            "canal__c", "codigo_cv__c", "comissao_nao_separada__c", "comissao_separada__c",
            "contratogerado__c", "contratogeradoem__c", "criaroportunidadetaxas__c",
            "data_assinatura__c", "data_casamento__c", "data_de_emissao_rg__c",
            "data_de_nascimento__c", "data_de_vencimento__c", "data_sinal_cc__c",
            "databasedovalorpagoatual__c", "datacomunicadodevendas__c", "dataultimoenvioanalise__c",
            "desconto__c", "desconto_aprovado__c", "descontonum__c", "dia_do_vencimento__c",
            "direcionalvendas__c", "email__c", "emp_interesse_web__c", "empreendimento_de_interesse__c",
            "estado_civil__c", "etapa_safi__c", "faixa_etaria__c", "fid__c", "fidnovo__c",
            "fidoriginal__c", "forma_pagamento__c", "geradocomunicadovenda__c", "idademaisvelho__c",
            "imprimir_clausula_auxiliar__c", "justificativa__c", "justificativa_gerencial__c",
            "midia__c", "motivo_de_queda__c", "nacionalidade__c", "numerovendauau__c",
            "origem_da_conta", "pagamentoscriado__c", "percentual_do_titular__c","empreendimento_de_interesse_lista",
            "possui_dependentes__c", "possuidireitoredutor__c", "possuiregistrodetransepag__c",
            "prazofinanciamento__c", "premiacao_comissao_original__c", "premiacao_nao_separada__c",
            "premiacao_por_campanha__c", "premiacao_por_venda__c", "premiacao_separada__c",
            "prestacaofinan__c", "profissao__c", "quant_de_parcelas_taxasnaobonificadas__c",
            "quantidade_parcelas__c", "regime_casamento__c", "regional__c", "rendaapurada__c",
            "resultado__c", "rg__c", "sexo__c", "sicaq__c", "sitedaweb__c", "status_financiamento_safi__c",
            "status_integracao_uau__c", "status_safi__c", "statusbloqueiotps__c", "statusintegracao__c",
            "statusvendakits__c", "taxa__c", "taxas_vendidas__c", "telefone__c", "telefone_principal__c",
            "tipo__c", "tiporenda__c", "tipovenda__c", "total_devolucao__c", "total_devolucao_por_parcelas__c",
            "total_recebido__c", "totalcomissoes__c", "totalpremiacao__c", "dealtype",
            "valor_avaliacao_financiamento__c", "valor_sinal_cc__c", "valor_soma_parcelasdesconto__c",
            "vincularimobiliariaautomaticamente__c"
        ],
        "limit": 100
        }
        if after:
            payload["after"] = after

        response = requests.post(hubspot_url, json=payload, headers=headers)
        data = response.json()
        deals.extend(data.get('results', []))
        
        after = data.get('paging', {}).get('next', {}).get('after')
        has_more = after is not None

    return deals


def fetch_salesforce_opportunities(deals):
    deals_with_opp_id = [deal for deal in deals if deal['properties'].get('idoportunidade__c')]
    deals_without_opp = [deal for deal in deals if not deal['properties'].get('idoportunidade__c')]
    
    if not deals_with_opp_id:
        return {
            'opportunities': {},
            'deals_with_opp': [],
            'deals_without_opp': deals_without_opp
        }
        
    opportunity_ids = [f"'{deal['properties']['idoportunidade__c']}'" for deal in deals_with_opp_id]
    opportunity_ids_string = ",".join(opportunity_ids)
    
    query_url = f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/query"
    query = (
        f"SELECT Id, Name, Amount, CloseDate, IdHubspot__c, "
        f"Ano_da_Venda__c, Atendente_GA__c, Contato_imobiliaria__c, "
        f"DataOportunidade__c, DataVenda__c, Diretor_de_vendas__c, "
        f"Email_Principal__c, Gerente_de_vendas__c, Gerente_regional__c, "
        f"IDOportunidade__c, Imobiliaria__c, LeadSource, Nome_imob__c, "
        f"NumeroVenda__c, Observa_o__c, Observacoes_SDR__c, ObservacoesGA__c, "
        f"Produto__c, RegionalComercial__c, TipoDeVenda__c, "
        f"Unidade_De_Neg_cio__c, Valor_do_Contrato__c, B_Adimplencia__c, "
        f"Banco__c, BonificarITBI__c, BonificarRegistro__c, Bonus_CR__c, "
        f"C_digos_de_produtos_do_UAUTaxas__c, CampaignId, Canal__c, "
        f"Codigo_CV__c, CodigosProdutoUAU__c, Comissao_nao_separada__c, "
        f"Comissao_separada__c, ContratoGerado__c, ContratoGeradoEm__c, "
        f"CriarOportunidadeTaxas__c, Data_assinatura__c, Data_Casamento__c, "
        f"Data_de_Emissao_RG__c, Data_de_nascimento__c, Data_de_vencimento__c, "
        f"Data_Sinal_CC__c, DataBasedoValorPagoAtual__c, "
        f"DataComunicadodeVendas__c, DataUltimoEnvioAnalise__c, Desconto__c, "
        f"Desconto_Aprovado__c, DescontoNum__c, Dia_do_Vencimento__c, "
        f"DirecionalVendas__c, Email__c, Emp_Interesse_Web__c, "
        f"Empreendimento_de_interesse__c, Estado_Civil__c, Etapa_SAFI__c, "
        f"Faixa_Etaria__c, FID__c, FIDNovo__c, FIDOriginal__c, "
        f"Forma_de_pagamentoTaxas__c, GeradoComunicadoVenda__c, "
        f"IdadeMaisVelho__c, Imprimir_Clausula_Auxiliar__c, Justificativa__c, "
        f"Justificativa_gerencial__c, Midia__c, Motivo_de_Queda__c, "
        f"Nacionalidade__c, Numero_de_Venda_UAUTaxas__c, Origem_da_Conta__c, "
        f"PagamentosCriado__c, Percentual_do_Titular__c, Possui_dependentes__c, "
        f"PossuiDireitoRedutor__c, PossuiRegistroDeTransEPag__c, "
        f"PrazoFinanciamento__c, Premiacao_Comissao_Original__c, "
        f"Premiacao_nao_separada__c, Premiacao_por_campanha__c, "
        f"Premiacao_por_venda__c, Premiacao_separada__c, PrestacaoFinan__c, "
        f"Profissao__c, Quantidade_de_parcelasTaxas__c, Quantidade_Parcelas__c, "
        f"Regime_Casamento__c, Regional__c, RendaApurada__c, Resultado__c, "
        f"RG__c, Sexo__c, SICAQ__c, SiteDaWeb__c, Status_Financiamento_SAFI__c, "
        f"Status_Integracao_UAU__c, Status_SAFI__c, statusBloqueioTPs__c, "
        f"StatusIntegracao__c, StatusVendaKits__c, Taxa__c, Taxas_vendidas__c, "
        f"Telefone__c, Telefone_Principal__c, Tipo__c, TipoRenda__c, "
        f"TipoVenda__c, Total_Devolucao__c, Total_Devolucao_por_Parcelas__c, "
        f"Total_recebido__c, TotalComissoes__c, TotalPremiacao__c, Type, "
        f"Valor_avaliacao_financiamento__c, Valor_Sinal_CC__c, "
        f"Valor_Soma_ParcelasDesconto__c, "
        f"VincularImobiliariaAutomaticamente__c "
        f"FROM Opportunity "
        f"WHERE Id IN ({opportunity_ids_string})"
    )
    
    headers = {
        'Authorization': f'Bearer {SF_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(query_url, headers=headers, params={'q': query})
    opportunities = response.json().get('records', [])
    
    opportunities_by_id = {}
    for opp in opportunities:
        if 'Id' in opp:
            opportunities_by_id[opp['Id']] = opp
    
    return {
        'opportunities': opportunities_by_id,
        'deals_with_opp': deals_with_opp_id,
        'deals_without_opp': deals_without_opp
    }


def fetch_empreendimento_code(empreendimento_name):
    query_url = f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/query"
    query = f"SELECT Id, Name FROM Empreendimento__c WHERE Name = '{empreendimento_name}'"
    headers = {
        'Authorization': f'Bearer {SF_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }
    response = requests.get(query_url, headers=headers, params={'q': query})
    records = response.json().get('records', [])
    return records[0]['Id'] if records else None

dealstage_mapping = {
    "95e479e2-44a9-4ceb-bbce-079c48a32741": "Aguardando atendimento Corretor",
    "1444faaf-3a44-44d4-9e63-23b40763d9e7": "Em atendimento",
    "c54ae7b7-42ef-4087-bf5b-29f4d8095307": "Visita Agendada",
    "00b052ae-7347-457a-b3b9-5091a9556582": "Visita Realizada",
    "1306c13a-e9bf-4965-b978-e2926b4e1760": "Em Análise de Crédito",
    "0e120078-eea7-424e-8e0a-ace6fd726a29": "Análise de Crédito Realizada",
    "c928b51b-b9fe-418c-bd90-a003fd2dc027": "Fechado e ganho",
    "ae3c0342-2a77-4165-878c-7143eb15bb26": "Cancelado",
    "f5c1c702-3cab-405b-94d2-291ce6917704": "Enviado Aprovação Pró Soluto",
    "b7e57ca7-fb42-4d73-a76a-50df67ffd8ba": "Aprovado Pró soluto",
    "ba42da02-5583-4024-9d43-a007d1b42ad8": "Rejeitado Pro Soluto",
    "d91c0381-3d2a-4114-a3c7-27571830b223": "Enviado Aprovação Comissões",
    "d0837c46-74f9-4aa1-925a-0681a07b1261": "Reprovado Comissões",
    "3d1b43f5-a36f-4531-bffe-ad821ac1948f": "Aprovado Comissões"
}

def filter_null_values(data):
    return {k: v for k, v in data.items() if v is not None}

def map_hubspot_to_salesforce(deal):
    properties = deal['properties']
    sf_deal_data = {
        'Name': properties.get('dealname'),
        'Amount': properties.get('amount'),
        'CloseDate': properties.get('closedate'),
        'IdHubspot__c': deal['id'],
        'Ano_da_Venda__c': properties.get('ano_da_venda_c'),
        'Atendente_GA__c': properties.get('proprietario_de_ga'),
        'Contato_imobiliaria__c': properties.get('contato_imobiliaria_c'),
        'DataOportunidade__c': properties.get('dataoportunidade__c'),
        'DataVenda__c': properties.get('datavenda__c'),
        'Diretor_de_vendas__c': properties.get('diretor_de_vendas_c'),
        'Email_Principal__c': properties.get('email_principal__c'),
        'Gerente_de_vendas__c': properties.get('gerente_de_vendas_c'),
        'Gerente_regional__c': properties.get('gerente_regional_c'),
        'IDOportunidade__c': properties.get('idoportunidade__c'),
        'Imobiliaria__c': properties.get('imobiliaria_c'),
        'LeadSource': properties.get('leadsource'),
        'Nome_imob__c': properties.get('nome_imobiliaria_c'),
        'NumeroVenda__c': properties.get('numerovenda__c'),
        'Observa_o__c': properties.get('observa_o__c'),
        'Observacoes_SDR__c': properties.get('observacoes_sdr'),
        'ObservacoesGA__c': properties.get('observacoesga__c'),
        'Produto__c': properties.get('produto_c'),
        'RegionalComercial__c': properties.get('regionalcomercial__c'),
        'TipoDeVenda__c': properties.get('tipodevenda__c'),
        'Unidade_De_Neg_cio__c': properties.get('unidadenegocio__c'),
        'Valor_do_Contrato__c': properties.get('valor_real_de_venda_c'),
        'B_Adimplencia__c': properties.get('b_adimplencia__c'),
        'Banco__c': properties.get('banco__c'),
        'BonificarITBI__c': properties.get('bonificaritbi__c'),
        'BonificarRegistro__c': properties.get('bonificarregistro__c'),
        'Bonus_CR__c': properties.get('bonus_cr__c'),
        'C_digos_de_produtos_do_UAUTaxas__c': properties.get('codigosprodutouau__c'),
        'CampaignId': properties.get('campaignid'),
        'Canal__c': properties.get('canal__c'),
        'Codigo_CV__c': properties.get('codigo_cv__c'),
        'CodigosProdutoUAU__c': properties.get('codigosprodutouau__c'),
        'Comissao_nao_separada__c': properties.get('comissao_nao_separada__c'),
        'Comissao_separada__c': properties.get('comissao_separada__c'),
        'ContratoGerado__c': properties.get('contratogerado__c'),
        'ContratoGeradoEm__c': properties.get('contratogeradoem__c'),
        'CriarOportunidadeTaxas__c': properties.get('criaroportunidadetaxas__c'),
        'Data_assinatura__c': properties.get('data_assinatura__c'),
        'Data_Casamento__c': properties.get('data_casamento__c'),
        'Data_de_Emissao_RG__c': properties.get('data_de_emissao_rg__c'),
        'Data_de_nascimento__c': properties.get('data_de_nascimento__c'),
        'Data_de_vencimento__c': properties.get('data_de_vencimento__c'),
        'Data_Sinal_CC__c': properties.get('data_sinal_cc__c'),
        'DataBasedoValorPagoAtual__c': properties.get('databasedovalorpagoatual__c'),
        'DataComunicadodeVendas__c': properties.get('datacomunicadodevendas__c'),
        'DataUltimoEnvioAnalise__c': properties.get('dataultimoenvioanalise__c'),
        'Desconto__c': properties.get('desconto__c'),
        'Desconto_Aprovado__c': properties.get('desconto_aprovado__c'),
        'DescontoNum__c': properties.get('descontonum__c'),
        'Dia_do_Vencimento__c': properties.get('dia_do_vencimento__c'),
        'Email__c': properties.get('email__c'),
        'Emp_Interesse_Web__c': properties.get('emp_interesse_web__c'),
        'Empreendimento_de_interesse__c': properties.get('empreendimento_de_interesse__c'),
        'Estado_Civil__c': properties.get('estado_civil__c'),
        'Etapa_SAFI__c': properties.get('etapa_safi__c'),
        'Faixa_Etaria__c': properties.get('faixa_etaria__c'),
        'FID__c': properties.get('fid__c'),
        'FIDNovo__c': properties.get('fidnovo__c'),
        'FIDOriginal__c': properties.get('fidoriginal__c'),
        'Forma_de_pagamentoTaxas__c': properties.get('forma_pagamento__c'),
        'GeradoComunicadoVenda__c': properties.get('geradocomunicadovenda__c'),
        'IdadeMaisVelho__c': properties.get('idademaisvelho__c'),
        'Imprimir_Clausula_Auxiliar__c': properties.get('imprimir_clausula_auxiliar__c'),
        'Justificativa__c': properties.get('justificativa__c'),
        'Justificativa_gerencial__c': properties.get('justificativa_gerencial__c'),
        'Midia__c': properties.get('midia__c'),
        'Motivo_de_Queda__c': properties.get('motivo_de_queda__c'),
        'Nacionalidade__c': properties.get('nacionalidade__c'),
        'Numero_de_Venda_UAUTaxas__c': properties.get('numerovendauau__c'),
        'Origem_da_Conta__c': properties.get('origem_da_conta'),
        'PagamentosCriado__c': properties.get('pagamentoscriado__c'),
        'Percentual_do_Titular__c': properties.get('percentual_do_titular__c'),
        'Possui_dependentes__c': properties.get('possui_dependentes__c'),
        'PossuiDireitoRedutor__c': properties.get('possuidireitoredutor__c'),
        'PossuiRegistroDeTransEPag__c': properties.get('possuiregistrodetransepag__c'),
        'PrazoFinanciamento__c': properties.get('prazofinanciamento__c'),
        'Premiacao_Comissao_Original__c': properties.get('premiacao_comissao_original__c'),
        'Premiacao_nao_separada__c': properties.get('premiacao_nao_separada__c'),
        'Premiacao_por_campanha__c': properties.get('premiacao_por_campanha__c'),
        'Premiacao_por_venda__c': properties.get('premiacao_por_venda__c'),
        'Premiacao_separada__c': properties.get('premiacao_separada__c'),
        'PrestacaoFinan__c': properties.get('prestacaofinan__c'),
        'Profissao__c': properties.get('profissao__c'),
        'Quantidade_de_parcelasTaxas__c': properties.get('quant_de_parcelas_taxasnaobonificadas__c'),
        'Quantidade_Parcelas__c': properties.get('quantidade_parcelas__c'),
        'Regime_Casamento__c': properties.get('regime_casamento__c'),
        'Regional__c': properties.get('regional__c'),
        'RendaApurada__c': properties.get('rendaapurada__c'),
        'Resultado__c': properties.get('resultado__c'),
        'RG__c': properties.get('rg__c'),
        'Sexo__c': properties.get('sexo__c'),
        'SICAQ__c': properties.get('sicaq__c'),
        'SiteDaWeb__c': properties.get('sitedaweb__c'),
        'Status_Financiamento_SAFI__c': properties.get('status_financiamento_safi__c'),
        'Status_Integracao_UAU__c': properties.get('status_integracao_uau__c'),
        'Status_SAFI__c': properties.get('status_safi__c'),
        'statusBloqueioTPs__c': properties.get('statusbloqueiotps__c'),
        'StatusIntegracao__c': properties.get('statusintegracao__c'),
        'StatusVendaKits__c': properties.get('statusvendakits__c'),
        'Taxa__c': properties.get('taxa__c'),
        'Taxas_vendidas__c': properties.get('taxas_vendidas__c'),
        'Telefone__c': properties.get('telefone__c'),
        'Telefone_Principal__c': properties.get('telefone_principal__c'),
        'Tipo__c': properties.get('tipo__c'),
        'TipoRenda__c': properties.get('tiporenda__c'),
        'TipoVenda__c': properties.get('tipovenda__c'),
        'Total_Devolucao__c': properties.get('total_devolucao__c'),
        'Total_Devolucao_por_Parcelas__c': properties.get('total_devolucao_por_parcelas__c'),
        'Total_recebido__c': properties.get('total_recebido__c'),
        'TotalComissoes__c': properties.get('totalcomissoes__c'),
        'TotalPremiacao__c': properties.get('totalpremiacao__c'),
        'Type': properties.get('dealtype'),
        'Valor_avaliacao_financiamento__c': properties.get('valor_avaliacao_financiamento__c'),
        'Valor_Sinal_CC__c': properties.get('valor_sinal_cc__c'),
        'Valor_Soma_ParcelasDesconto__c': properties.get('valor_soma_parcelasdesconto__c'),
        'VincularImobiliariaAutomaticamente__c': properties.get('vincularimobiliariaautomaticamente__c'),
        'Empreendimento__c': properties.get('empreendimento_de_interesse_lista')
    }
    
    empreendimento_name = properties.get('empreendimento_de_interesse_lista')
    if empreendimento_name:
        empreendimento_code = fetch_empreendimento_code(empreendimento_name)
        if empreendimento_code:
            sf_deal_data['Empreendimento__c'] = empreendimento_code

    dealstage_id = properties.get('dealstage')
    if dealstage_id:
        sf_deal_data['StageName'] = dealstage_mapping.get(dealstage_id)

    if 'hubspot_owner_id' in properties:
        owner = fetch_hubspot_owner(properties['hubspot_owner_id'])
        if owner and 'email' in owner:
            sf_user = find_salesforce_user_by_email(owner['email'])
            if sf_user:
                sf_deal_data['OwnerId'] = sf_user['Id']

    sf_deal_data = filter_null_values(sf_deal_data)
        
    return sf_deal_data


SF_API_VERSION = 'v57.0'
SF_INSTANCE_URL = 'https://client.sandbox.my.salesforce.com'
HUBSPOT_API_KEY = os.getenv("HUBSPOT_API_KEY")
    
SF_ACCESS_TOKEN, SF_INSTANCE_URL = get_salesforce_access_token()

def main(event):
    
    try:
        deals = fetch_hubspot_deals()
        
        sf_data = fetch_salesforce_opportunities(deals)
        update_data = []
        create_data = []
        integration_logs = []

        for deal in sf_data['deals_with_opp']:
            start_time = time.time()
            deal_id = deal['id']
            opp_id = deal['properties']['idoportunidade__c']
            
            log_entry = create_log_entry(
                hubspot_id=deal_id,
                salesforce_id=opp_id,
                operation_type="PROCESSING",
                status="STARTED",
                fields=list(deal['properties'].keys())
            )
            integration_logs.append(log_entry)
            
            try:
                sf_opp = sf_data['opportunities'].get(opp_id)
                if sf_opp:
                    sf_deal_data = map_hubspot_to_salesforce(deal)
                    update_fields = {}
                    
                    for field, value in sf_deal_data.items():
                        if sf_opp.get(field) is None and value is not None:
                            update_fields[field] = value
                    
                    if update_fields:
                        update_fields['Id'] = sf_opp['Id']
                        update_data.append(update_fields)
                        log_entry["operation_type"] = "UPDATE"
                        log_entry["processing_details"] = f"Updating {len(update_fields)} fields"
                    else:
                        log_entry["operation_type"] = "SKIP"
                        log_entry["processing_details"] = "No empty fields to update"
                
                log_entry["processing_duration"] = time.time() - start_time
                
            except Exception as e:
                log_entry["status"] = "ERROR"
                log_entry["error_message"] = str(e)
                log_entry["processing_duration"] = time.time() - start_time


        for deal in sf_data['deals_without_opp']:
            start_time = time.time()
            deal_id = deal['id']
            
            log_entry = create_log_entry(
                hubspot_id=deal_id,
                salesforce_id=None,
                operation_type="CREATE",
                status="STARTED",
                fields=list(deal['properties'].keys())
            )
            integration_logs.append(log_entry)
            
            try:
                sf_deal_data = map_hubspot_to_salesforce(deal)
                create_data.append(sf_deal_data)
                log_entry["processing_details"] = "Creating new opportunity"
                log_entry["processing_duration"] = time.time() - start_time
                
            except Exception as e:
                log_entry["status"] = "ERROR"
                log_entry["error_message"] = str(e)
                log_entry["processing_duration"] = time.time() - start_time

        results = {
            'success': True,
            'message': '',
            'created': 0,
            'updated': 0,
            'errors': 0
        }

        if update_data:
            update_results = batch_update_salesforce_records(update_data)
            for log in integration_logs:
                if log["operation_type"] == "UPDATE":
                    result = next((r for r in update_results if r.get("id") == log["salesforce_opportunity_id"]), None)
                    if result and result.get("success"):
                        log["status"] = "SUCCESS"
                        results['updated'] += 1
                    else:
                        log["status"] = "ERROR"
                        log["error_message"] = result.get("errors", ["Unknown error"])[0]
                        results['errors'] += 1

        if create_data:
            create_results = []
            for i, opportunity in enumerate(create_data):
                filtered_opportunity = filter_null_values(opportunity)
                result = create_single_salesforce_opportunity(filtered_opportunity)
                create_results.append(result)
                
                log = next((log for log in integration_logs if log["operation_type"] == "CREATE"), None)
                if log:
                    if result.get("success"):
                        log["status"] = "SUCCESS"
                        log["salesforce_opportunity_id"] = result["id"]
                        results['created'] += 1
                        try:
                            update_hubspot_deal(log["hubspot_deal_id"], result["id"])
                            log["hubspot_update_status"] = "SUCCESS"
                        except Exception as e:
                            log["hubspot_update_status"] = "ERROR"
                            log["error_message"] = f"HubSpot update failed: {str(e)}"
                            results['errors'] += 1
                    else:
                        log["status"] = "ERROR"
                        log["error_message"] = result.get("errors", ["Unknown error"])[0]
                        results['errors'] += 1

        results['message'] = (
            f"Processed {len(integration_logs)} deals. "
            f"Created: {results['created']}, "
            f"Updated: {results['updated']}, "
            f"Errors: {results['errors']}"
        )

        return {
            'outputFields': {
                'status': 'SUCCESS' if results['errors'] == 0 else 'PARTIAL_SUCCESS',
                'message': results['message'],
                'deals_processed': len(integration_logs),
                'deals_created': results['created'],
                'deals_updated': results['updated'],
                'deals_with_errors': results['errors']
            }
        }

    except Exception as e:
        return {
            'outputFields': {
                'status': 'ERROR',
                'message': str(e),
                'deals_processed': 0,
                'deals_created': 0,
                'deals_updated': 0,
                'deals_with_errors': 1
            }
        }
    