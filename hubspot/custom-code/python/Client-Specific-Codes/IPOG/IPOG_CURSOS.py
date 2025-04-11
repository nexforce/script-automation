import requests

def main(event):
    input_fields = event["inputFields"]
    recent_conversion = input_fields.get("recent_conversion_event_name", "").strip().lower()
    curso_interesse = input_fields.get("curso_de_interesse", "").strip().lower()
    modalidade = input_fields.get("modalidade_de_interesse", "").strip().lower()

    # Mapeamento de modalidades
    MODALIDADE_MAP = {
        'ead': 'online',
        'remoto ao vivo': 'ao-vivo',
        'presencial': 'presencial'
    }
    modalidade_alvo = MODALIDADE_MAP.get(modalidade)

    # Construção dos termos de busca
    termos_busca = []
    if recent_conversion:
        termos_busca.extend([termo.strip() for termo in recent_conversion.split(' or ')])
    if curso_interesse:
        termos_busca.extend([termo.strip() for termo in curso_interesse.split(' and ')])

    # Busca cursos na API
    response = requests.get("https://api-newams.ipog.edu.br/cursos")
    if response.status_code != 200:
        return {"outputFields": {
            "curso_id": None,
            "curso_id_crm": None,
            "tipo_de_ensino_slug": None,
            "tipo_de_formacao_slug": None,
            "Área de Atuação": None
        }}

    cursos = response.json()
    curso_encontrado = None

    # Lógica de busca aprimorada
    for curso in cursos:
        for termo in termos_busca:
            termo = termo.lower()
            nome_curso = curso.get('nome', '').lower()
            slug_curso = curso.get('slug', '').lower()
            
            # Verifica match no termo
            match_termo = termo in (nome_curso, slug_curso)
            
            # Verifica modalidade se necessário
            match_modalidade = True
            if modalidade_alvo:
                curso_modalidade = curso.get('tipo_de_ensino', '')
                match_modalidade = (curso_modalidade == modalidade_alvo)

            if match_termo and match_modalidade:
                curso_encontrado = curso
                break
                
        if curso_encontrado:
            break

    if not curso_encontrado:
        return {"outputFields": {
            "curso_id": None,
            "curso_id_crm": None,
            "tipo_de_ensino_slug": None,
            "tipo_de_formacao_slug": None,
            "area_de_atuacao": None
        }}

    return {"outputFields": {
        "curso_id": curso_encontrado.get('id'),
        "curso_id_crm": curso_encontrado.get('id_crm'),
        "tipo_de_ensino_slug": curso_encontrado.get('tipo_de_ensino'),
        "tipo_de_formacao_slug": curso_encontrado.get('tipo_de_formacao'),
      	"tipo_de_ensino": curso_encontrado.get('tipo_de_ensino'),
        "area_de_atuacao": curso_encontrado.get('area_de_atuacao')
    }}