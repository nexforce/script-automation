import requests

def main(event):
    recent_conversion = event["inputFields"].get("recent_conversion_event_name", "").strip().lower()
    curso_interesse = event["inputFields"].get("curso_de_interesse", "").strip().lower()
    
    termos_busca = []
    if recent_conversion:
        termos_busca.extend([termo.strip() for termo in recent_conversion.split(' or ')])
    if curso_interesse:
        termos_busca.extend([termo.strip() for termo in curso_interesse.split(' and ')])
    
    response = requests.get("https://api-newams.ipog.edu.br/cursos")
    if response.status_code != 200:
        return {"error": "Falha ao buscar cursos"}
        
    cursos = response.json()
    
    curso_encontrado = None
    for curso in cursos:
        for termo in termos_busca:
            if (termo.lower() == curso.get('nome', '').strip().lower() or 
                termo.lower() == curso.get('slug', '').strip().lower()):
                curso_encontrado = curso
                break
        if curso_encontrado:
            break
    
    if not curso_encontrado:
        return {
          "outputFields":{
            "curso_id": None,
            "curso_id_crm": None,
            "tipo_de_ensino_slug": None,
            "tipo_de_formacao_slug": None,
            "Área de Atuação": None
        }}
    
    return {
      "outputFields": {
        "curso_id": curso_encontrado.get('id'),
        "curso_id_crm": curso_encontrado.get('id_crm'),
        "tipo_de_ensino_slug": curso_encontrado.get('tipo_de_ensino'),
        "tipo_de_formacao_slug": curso_encontrado.get('tipo_de_formacao'),
        "Área de Atuação": curso_encontrado.get('area_de_atuacao')
    }}