import datetime
import requests
import time
import os
from datetime import datetime, timezone

def main(event):
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
        access_token = auth_response_json.get("access_token")
        instance_url = auth_response_json.get("instance_url")
        return access_token, instance_url

    SF_API_VERSION = 'v57.0'
    SF_INSTANCE_URL = 'https://client.sandbox.my.salesforce.com'
    HUBSPOT_API_KEY = os.getenv("HUBSPOT_API_KEY")

    SF_ACCESS_TOKEN, SF_INSTANCE_URL = get_salesforce_access_token()

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

    sf_query_url = (
        f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/query/?q="
        "SELECT+Ano_da_Venda__c,Atendente_GA__c,CloseDate,Contato_imobiliaria__c,DataOportunidade__c,"
        "Owner.Name,Owner.Email,"
        "DataVenda__c,Diretor_de_vendas__c,Email_Principal__c,Gerente_de_vendas__c,"
        "Gerente_regional__c,Id,IDOportunidade__c,Imobiliaria__c,LeadSource,Nome_imob__c,"
        "NumeroVenda__c,Observa_o__c,Observacoes_SDR__c,ObservacoesGA__c,Produto__c,"
        "RecordTypeId,RegionalComercial__c,StageName,TipoDeVenda__c,Unidade_De_Neg_cio__c,"
        "Valor_do_Contrato__c,Valor_Real_de_Venda__c,B_Adimplencia__c,Banco__c,"
        "BonificarITBI__c,BonificarRegistro__c,Bonus_CR__c,C_digos_de_produtos_do_UAUTaxas__c,"
        "CampaignId,Canal__c,Codigo_CV__c,CodigosProdutoUAU__c,Comissao_nao_separada__c,"
        "Comissao_separada__c,ContratoGerado__c,ContratoGeradoEm__c,CriarOportunidadeTaxas__c,"
        "Data_assinatura__c,Data_Casamento__c,Data_da_Analise__c,Data_de_Emissao_RG__c,"
        "Data_de_nascimento__c,Data_de_vencimento__c,Data_Sinal_CC__c,"
        "DataBasedoValorPagoAtual__c,DataComunicadodeVendas__c,DataPrimeiroEnvioAnalise__c,"
        "DataUltimoEnvioAnalise__c,Desconto__c,Desconto_Aprovado__c,DescontoNum__c,"
        "Dia_do_Vencimento__c,DirecionalVendas__c,Email__c,Emp_Interesse_Web__c,"
        "Empreendimento_de_interesse__c,Estado_Civil__c,Etapa_SAFI__c,ExpectedRevenue,"
        "Faixa_Etaria__c,FID__c,FIDNovo__c,FIDOriginal__c,ForecastCategory,"
        "Forma_de_pagamentoTaxas__c,GeradoComunicadoVenda__c,IdadeMaisVelho__c,"
        "Imprimir_Clausula_Auxiliar__c,IsClosed,IsWon,ITBI_Bonificado__c,Justificativa__c,"
        "Justificativa_gerencial__c,LastActivityDate,LastModifiedDate,Midia__c,"
        "Motivo_de_Queda__c,Nacionalidade__c,Name,Numero_de_Venda_UAUTaxas__c,"
        "numeroVendaUAU__c,Origem_da_Conta__c,PagamentosCriado__c,Percentual_do_Titular__c,"
        "Possui_dependentes__c,PossuiDireitoRedutor__c,PossuiRegistroDeTransEPag__c,"
        "PrazoFinanciamento__c,Premiacao_Comissao_Original__c,Premiacao_nao_separada__c,"
        "Premiacao_por_campanha__c,Premiacao_por_venda__c,Premiacao_separada__c,"
        "PrestacaoFinan__c,Profissao__c,Quantidade_de_parcelasTaxas__c,Quantidade_Parcelas__c,"
        "Regime_Casamento__c,Regional__c,RendaApurada__c,Resultado__c,RG__c,Sexo__c,"
        "SICAQ__c,SiteDaWeb__c,Status_Financiamento_SAFI__c,Status_Integracao_UAU__c,"
        "Status_SAFI__c,statusBloqueioTPs__c,StatusIntegracao__c,StatusVendaKits__c,Taxa__c,"
        "Taxas_vendidas__c,Telefone__c,Telefone_Principal__c,Tipo__c,TipoRenda__c,"
        "TipoVenda__c,Total_Devolucao__c,Total_Devolucao_por_Parcelas__c,Total_recebido__c,"
        "TotalComissoes__c,TotalPremiacao__c,Type,Valor_avaliacao_financiamento__c,"
        "Valor_Sinal_CC__c,Valor_Soma_ParcelasDesconto__c,VincularImobiliariaAutomaticamente__c "
        "FROM+Opportunity "
        "WHERE+LastModifiedDate=Yesterday "
        "AND+RecordTypeId='012KZ000000Xd01YAC'"
    )

    sf_headers = {
        'Authorization': f'Bearer {SF_ACCESS_TOKEN}',
        'Content-Type': 'application/json'
    }

    response = requests.get(sf_query_url, headers=sf_headers)
    opportunities = response.json().get('records', [])


    def update_hubspot_deals_batch(deals):
        url = "https://api.hubapi.com/deals/v1/batch-async/update"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {HUBSPOT_API_KEY}'
        }
        response = requests.post(url, json=deals, headers=headers)
        return response.status_code, response.json()

    def create_hubspot_deal(deal):
        url = "https://api.hubapi.com/deals/v1/deal"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {HUBSPOT_API_KEY}'
        }
        response = requests.post(url, json=deal, headers=headers)
        return response.status_code, response.json()

    def search_hubspot_contact_by_email(email):
        url = f"https://api.hubapi.com/contacts/v1/contact/email/{email}/profile"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {HUBSPOT_API_KEY}'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return None

    def update_salesforce_opportunity(opportunity_id, hubspot_deal_id):
        url = f"{SF_INSTANCE_URL}/services/data/{SF_API_VERSION}/sobjects/Opportunity/{opportunity_id}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {SF_ACCESS_TOKEN}'
        }
        data = {
            'IdHubspot__c': hubspot_deal_id
        }
        response = requests.patch(url, json=data, headers=headers)
        return response.status_code
    
    def get_hubspot_owner_id_by_email(email):
        url = f"https://api.hubapi.com/owners/v2/owners"
        headers = {
            'Authorization': f'Bearer {HUBSPOT_API_KEY}'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            owners = response.json()
            for owner in owners:
                if owner.get('email') == email:
                    return owner.get('ownerId')
        return None

    def chunk_list(lst, chunk_size):
        for i in range(0, len(lst), chunk_size):
            yield lst[i:i + chunk_size]

    def convert_date_to_timestamp(date_str):
        if not date_str:
            return None
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d')
            date_utc = date.replace(tzinfo=timezone.utc)
            return int(date_utc.timestamp() * 1000)
        except ValueError:
            return None
        

    deals_to_update = []
    deals_to_create = []

    dealstage_mapping = {
        "Aguardando atendimento Corretor": "95e479e2-44a9-4ceb-bbce-079c48a32741",
        "Em atendimento": "1444faaf-3a44-44d4-9e63-23b40763d9e7",
        "Visita Agendada": "c54ae7b7-42ef-4087-bf5b-29f4d8095307",
        "Visita Realizada": "00b052ae-7347-457a-b3b9-5091a9556582",
        "Em Análise de Crédito": "1306c13a-e9bf-4965-b978-e2926b4e1760",
        "Análise de Crédito Realizada": "0e120078-eea7-424e-8e0a-ace6fd726a29",
        "Fechado e ganho": "c928b51b-b9fe-418c-bd90-a003fd2dc027",
        "Cancelado": "ae3c0342-2a77-4165-878c-7143eb15bb26",
        "Enviado Aprovação Pró Soluto": "f5c1c702-3cab-405b-94d2-291ce6917704",
        "Aprovado Pró soluto": "b7e57ca7-fb42-4d73-a76a-50df67ffd8ba",
        "Rejeitado Pro Soluto": "ba42da02-5583-4024-9d43-a007d1b42ad8",
        "Enviado Aprovação Comissões": "d91c0381-3d2a-4114-a3c7-27571830b223",
        "Reprovado Comissões": "d0837c46-74f9-4aa1-925a-0681a07b1261",
        "Aprovado Comissões": "3d1b43f5-a36f-4531-bffe-ad821ac1948f"
    }

    for opp in opportunities:
        hubspot_id = opp.get('IdHubspot__c')
        amount = opp.get('Amount', 0) or 0
        pipeline = "6e65ceb6-a462-40cb-84db-30f7037697d5"
        dealstage_name = opp.get('StageName')
        dealstage = dealstage_mapping.get(dealstage_name, None)

        closedate = convert_date_to_timestamp(opp.get('CloseDate'))
        dataoportunidade = convert_date_to_timestamp(opp.get('DataOportunidade__c'))
        datavenda = convert_date_to_timestamp(opp.get('DataVenda__c'))
        datanascimento = convert_date_to_timestamp(opp.get('Data_de_nascimento__c'))
        dataultimoenvioanalise = convert_date_to_timestamp(opp.get('DataUltimoEnvioAnalise__c'))
        dataemissaorg = convert_date_to_timestamp(opp.get('Data_de_Emissao_RG__c'))

        deal = {
            'properties': [
                {'name': 'dealname', 'value': opp.get('Name')},
                {'name': 'amount', 'value': amount},
                {'name': 'closedate', 'value': closedate},
                {'name': 'dealstage', 'value': dealstage},
                {'name': 'ano_da_venda_c', 'value': opp.get('Ano_da_Venda__c')},
                {'name': 'proprietario_de_ga', 'value': opp.get('Atendente_GA__c')},
                {'name': 'contato_imobiliaria_c', 'value': opp.get('Contato_imobiliaria__c')},
                {'name': 'dataoportunidade__c', 'value': dataoportunidade},
                {'name': 'datavenda__c', 'value': datavenda},
                {'name': 'diretor_de_vendas_c', 'value': opp.get('Diretor_de_vendas__c')},
                {'name': 'email_principal__c', 'value': opp.get('Email_Principal__c')},
                {'name': 'gerente_de_vendas_c', 'value': opp.get('Gerente_de_vendas__c')},
                {'name': 'gerente_regional_c', 'value': opp.get('Gerente_regional__c')},
                {'name': 'idoportunidade__c', 'value': opp.get('Id')},
                {'name': 'imobiliaria_c', 'value': opp.get('Imobiliaria__c')},
                {'name': 'leadsource', 'value': opp.get('LeadSource')},
                {'name': 'nome_imobiliaria_c', 'value': opp.get('Nome_imob__c')},
                {'name': 'contato_corretor_proprietario1__c', 'value': opp.get('NomeDoCorretor__c')},
                {'name': 'numerovenda__c', 'value': opp.get('NumeroVenda__c')},
                {'name': 'observa_o__c', 'value': opp.get('Observa_o__c')},
                {'name': 'observacoes_sdr', 'value': opp.get('Observacoes_SDR__c')},
                {'name': 'observacoesga__c', 'value': opp.get('ObservacoesGA__c')},
                {'name': 'produto_c', 'value': opp.get('Produto__c')},
                {'name': 'pipeline', 'value': pipeline},
                {'name': 'regionalcomercial__c', 'value': opp.get('RegionalComercial__c')},
                {'name': 'tipodevenda__c', 'value': opp.get('TipoDeVenda__c')},
                {'name': 'unidadenegocio__c', 'value': opp.get('Unidade_De_Neg_cio__c')},
                {'name': 'valor_real_de_venda_c', 'value': opp.get('Valor_Real_de_Venda__c')},
                {'name': 'valor_da_parcela_c', 'value': opp.get('ValorParcelaComap__c')},
                {'name': 'accountid', 'value': opp.get('AccountId')},
                {'name': 'aprovado_pro_soluto_c', 'value': opp.get('AprovadoProSoluto__c')},
                {'name': 'hubspot_owner_id', 'value': opp.get('OwnerId')},
                {'name': 'b_adimplencia__c', 'value': opp.get('B_Adimplencia__c')},
                {'name': 'banco__c', 'value': opp.get('Banco__c')},
                {'name': 'bonificaritbi__c', 'value': opp.get('BonificarITBI__c')},
                {'name': 'bonificarregistro__c', 'value': opp.get('BonificarRegistro__c')},
                {'name': 'bonus_cr__c', 'value': opp.get('Bonus_CR__c')},
                {'name': 'codigosprodutouau__c', 'value': opp.get('C_digos_de_produtos_do_UAUTaxas__c')},
                {'name': 'campaignid', 'value': opp.get('CampaignId')},
                {'name': 'canal__c', 'value': opp.get('Canal__c')},
                {'name': 'codigo_cv__c', 'value': opp.get('Codigo_CV__c')},
                {'name': 'codigosprodutouau__c', 'value': opp.get('CodigosProdutoUAU__c')},
                {'name': 'comissao_nao_separada__c', 'value': opp.get('Comissao_nao_separada__c')},
                {'name': 'comissao_separada__c', 'value': opp.get('Comissao_separada__c')},
                {'name': 'contratogerado__c', 'value': opp.get('ContratoGerado__c')},
                {'name': 'contratogeradoem__c', 'value': opp.get('ContratoGeradoEm__c')},
                {'name': 'criaroportunidadetaxas__c', 'value': opp.get('CriarOportunidadeTaxas__c')},
                {'name': 'data_assinatura__c', 'value': opp.get('Data_assinatura__c')},
                {'name': 'data_de_emissao_rg__c', 'value': dataemissaorg},
                {'name': 'data_de_nascimento__c', 'value': datanascimento},
                {'name': 'data_de_vencimento__c', 'value': opp.get('Data_de_vencimento__c')},
                {'name': 'data_sinal_cc__c', 'value': opp.get('Data_Sinal_CC__c')},
                {'name': 'databasedovalorpagoatual__c', 'value': opp.get('DataBasedoValorPagoAtual__c')},
                {'name': 'datacomunicadodevendas__c', 'value': opp.get('DataComunicadodeVendas__c')},
                {'name': 'dataultimoenvioanalise__c', 'value': dataultimoenvioanalise},
                {'name': 'desconto__c', 'value': opp.get('Desconto__c')},
                {'name': 'desconto_aprovado__c', 'value': opp.get('Desconto_Aprovado__c')},
                {'name': 'descontonum__c', 'value': opp.get('DescontoNum__c')},
                {'name': 'dia_do_vencimento__c', 'value': opp.get('Dia_do_Vencimento__c')},
                {'name': 'direcionalvendas__c', 'value': opp.get('DirecionalVendas__c')},
                {'name': 'email__c', 'value': opp.get('Email__c')},
                {'name': 'emp_interesse_web__c', 'value': opp.get('Emp_Interesse_Web__c')},
                {'name': 'empreendimento_de_interesse__c', 'value': opp.get('Empreendimento_de_interesse__c')},
                {'name': 'empreendimento_de_interesse_lista', 'value': opp.get('Empreendimento_de_interesse__c')},
                {'name': 'etapa_safi__c', 'value': opp.get('Etapa_SAFI__c')},
                {'name': 'faixa_etaria__c', 'value': opp.get('Faixa_Etaria__c')},
                {'name': 'fid__c', 'value': opp.get('FID__c')},
                {'name': 'fidnovo__c', 'value': opp.get('FIDNovo__c')},
                {'name': 'fidoriginal__c', 'value': opp.get('FIDOriginal__c')},
                {'name': 'forma_pagamento__c', 'value': opp.get('Forma_de_pagamentoTaxas__c')},
                {'name': 'geradocomunicadovenda__c', 'value': opp.get('GeradoComunicadoVenda__c')},
                {'name': 'idademaisvelho__c', 'value': opp.get('IdadeMaisVelho__c')},
                {'name': 'imprimir_clausula_auxiliar__c', 'value': opp.get('Imprimir_Clausula_Auxiliar__c')},
                {'name': 'justificativa__c', 'value': opp.get('Justificativa__c')},
                {'name': 'justificativa_gerencial__c', 'value': opp.get('Justificativa_gerencial__c')},
                {'name': 'hs_lastmodifieddate', 'value': opp.get('LastModifiedDate')},
                {'name': 'midia__c', 'value': opp.get('Midia__c')},
                {'name': 'motivo_de_queda__c', 'value': opp.get('Motivo_de_Queda__c')},
                {'name': 'nacionalidade__c', 'value': opp.get('Nacionalidade__c')},
                {'name': 'numerovendauau__c', 'value': opp.get('Numero_de_Venda_UAUTaxas__c')},
                {'name': 'numerovendauau__c', 'value': opp.get('numeroVendaUAU__c')},
                {'name': 'origem_da_conta', 'value': opp.get('Origem_da_Conta__c')},
                {'name': 'pagamentoscriado__c', 'value': opp.get('PagamentosCriado__c')},
                {'name': 'percentual_do_titular__c', 'value': opp.get('Percentual_do_Titular__c')},
                {'name': 'possui_dependentes__c', 'value': opp.get('Possui_dependentes__c')},
                {'name': 'possuidireitoredutor__c', 'value': opp.get('PossuiDireitoRedutor__c')},
                {'name': 'possuiregistrodetransepag__c', 'value': opp.get('PossuiRegistroDeTransEPag__c')},
                {'name': 'prazofinanciamento__c', 'value': opp.get('PrazoFinanciamento__c')},
                {'name': 'premiacao_comissao_original__c', 'value': opp.get('Premiacao_Comissao_Original__c')},
                {'name': 'premiacao_nao_separada__c', 'value': opp.get('Premiacao_nao_separada__c')},
                {'name': 'premiacao_por_campanha__c', 'value': opp.get('Premiacao_por_campanha__c')},
                {'name': 'premiacao_por_venda__c', 'value': opp.get('Premiacao_por_venda__c')},
                {'name': 'premiacao_separada__c', 'value': opp.get('Premiacao_separada__c')},
                {'name': 'prestacaofinan__c', 'value': opp.get('PrestacaoFinan__c')},
                {'name': 'profissao__c', 'value': opp.get('Profissao__c')},
                {'name': 'quant_de_parcelas_taxasnaobonificadas__c', 'value': opp.get('Quantidade_de_parcelasTaxas__c')},
                {'name': 'quantidade_parcelas__c', 'value': opp.get('Quantidade_Parcelas__c')},
                {'name': 'regime_casamento__c', 'value': opp.get('Regime_Casamento__c')},
                {'name': 'regional__c', 'value': opp.get('Regional__c')},
                {'name': 'rendaapurada__c', 'value': opp.get('RendaApurada__c')},
                {'name': 'resultado__c', 'value': opp.get('Resultado__c')},
                {'name': 'rg__c', 'value': opp.get('RG__c')},
                {'name': 'sexo__c', 'value': opp.get('Sexo__c')},
                {'name': 'sicaq__c', 'value': opp.get('SICAQ__c')},
                {'name': 'sitedaweb__c', 'value': opp.get('SiteDaWeb__c')},
                {'name': 'status_financiamento_safi__c', 'value': opp.get('Status_Financiamento_SAFI__c')},
                {'name': 'status_integracao_uau__c', 'value': opp.get('Status_Integracao_UAU__c')},
                {'name': 'status_safi__c', 'value': opp.get('Status_SAFI__c')},
                {'name': 'statusbloqueiotps__c', 'value': opp.get('statusBloqueioTPs__c')},
                {'name': 'statusintegracao__c', 'value': opp.get('StatusIntegracao__c')},
                {'name': 'statusvendakits__c', 'value': opp.get('StatusVendaKits__c')},
                {'name': 'taxa__c', 'value': opp.get('Taxa__c')},
                {'name': 'taxas_vendidas__c', 'value': opp.get('Taxas_vendidas__c')},
                {'name': 'telefone__c', 'value': opp.get('Telefone__c')},
                {'name': 'telefone_principal__c', 'value': opp.get('Telefone_Principal__c')},
                {'name': 'tipo__c', 'value': opp.get('Tipo__c')},
                {'name': 'tiporenda__c', 'value': opp.get('TipoRenda__c')},
                {'name': 'tipovenda__c', 'value': opp.get('TipoVenda__c')},
                {'name': 'total_devolucao__c', 'value': opp.get('Total_Devolucao__c')},
                {'name': 'total_devolucao_por_parcelas__c', 'value': opp.get('Total_Devolucao_por_Parcelas__c')},
                {'name': 'total_recebido__c', 'value': opp.get('Total_recebido__c')},
                {'name': 'totalcomissoes__c', 'value': opp.get('TotalComissoes__c')},
                {'name': 'totalpremiacao__c', 'value': opp.get('TotalPremiacao__c')},
                {'name': 'dealtype', 'value': opp.get('Type')},
                {'name': 'valor_avaliacao_financiamento__c', 'value': opp.get('Valor_avaliacao_financiamento__c')},
                {'name': 'valor_sinal_cc__c', 'value': opp.get('Valor_Sinal_CC__c')},
                {'name': 'valor_soma_parcelasdesconto__c', 'value': opp.get('Valor_Soma_ParcelasDesconto__c')},
                {'name': 'vincularimobiliariaautomaticamente__c', 'value': opp.get('VincularImobiliariaAutomaticamente__c')}
            ]
        }

        owner_email = opp.get('Owner', {}).get('Email')
        if owner_email:
            hubspot_owner_id = get_hubspot_owner_id_by_email(owner_email)
        if hubspot_owner_id:
            deal['properties'].append({
                'name': 'hubspot_owner_id',
                'value': str(hubspot_owner_id)
            })

        DEBUG = True

        if hubspot_id:
            deal['objectId'] = hubspot_id
            deals_to_update.append(deal)
        else:
            if DEBUG:
                deals_to_create.append((opp['Id'], deal))
            else:
                email = opp.get('Email_Principal__c')
                if email:
                    contact = search_hubspot_contact_by_email(email)
                    if contact:
                        deal['associations'] = {'associatedVids': [contact['vid']]}
                        deals_to_create.append((opp['Id'], deal))

    if deals_to_update:
        for chunk in chunk_list(deals_to_update, 100):
            for deal in chunk:
                start_time = time.time()
                log_entry = create_log_entry(
                    hubspot_id=deal.get('objectId'),
                    salesforce_id=deal.get('properties', {}).get('idoportunidade__c'),
                    operation_type="UPDATE",
                    status="STARTED",
                    fields=[prop['name'] for prop in deal['properties']]
                )
                integration_logs.append(log_entry)
                
            status_code, response = update_hubspot_deals_batch(chunk)
            for log in integration_logs:
                if log["operation_type"] == "UPDATE":
                    log["processing_duration"] = time.time() - start_time
                    if status_code == 200:
                        log["status"] = "SUCCESS"
                    else:
                        log["status"] = "ERROR"
                        log["error_message"] = str(response)

    for opp_id, deal in deals_to_create:
        start_time = time.time()
        log_entry = create_log_entry(
            hubspot_id=None,
            salesforce_id=opp_id,
            operation_type="CREATE",
            status="STARTED",
            fields=[prop['name'] for prop in deal['properties']]
        )
        integration_logs.append(log_entry)
        
        try:
            status_code, response = create_hubspot_deal(deal)
            if status_code == 200:
                hubspot_deal_id = response.get('dealId')
                update_status_code = update_salesforce_opportunity(opp_id, hubspot_deal_id)
                
                log_entry["hubspot_deal_id"] = hubspot_deal_id
                log_entry["status"] = "SUCCESS" if update_status_code == 204 else "ERROR"
                if update_status_code != 204:
                    log_entry["error_message"] = f"Failed to update Salesforce with status code: {update_status_code}"
            else:
                log_entry["status"] = "ERROR"
                log_entry["error_message"] = f"Failed to create HubSpot deal: {response}"
        except Exception as e:
            log_entry["status"] = "ERROR"
            log_entry["error_message"] = str(e)
        finally:
            log_entry["processing_duration"] = time.time() - start_time

    results = {
        'results': integration_logs,
        'success': True,
        'created': len([log for log in integration_logs if log["operation_type"] == "CREATE" and log["status"] == "SUCCESS"]),
        'updated': len([log for log in integration_logs if log["operation_type"] == "UPDATE" and log["status"] == "SUCCESS"]),
        'errors': len([log for log in integration_logs if log["status"] == "ERROR"])
    }

    return {
        'outputFields': {
            'results': integration_logs,
            'status': 'SUCCESS' if results['errors'] == 0 else 'PARTIAL_SUCCESS',
            'message': f"Processed {len(integration_logs)} deals. Created: {results['created']}, Updated: {results['updated']}, Errors: {results['errors']}",
            'deals_processed': len(integration_logs),
            'deals_created': results['created'],
            'deals_updated': results['updated'],
            'deals_with_errors': results['errors']
        }
    }