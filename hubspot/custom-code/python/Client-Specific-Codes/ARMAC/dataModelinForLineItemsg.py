import re

def main(event):
    input_fields = event.get('inputFields', {})
    itens = []
    
    equipamentos_e_quantidades_solicitados = input_fields.get('equipamentos_e_quantidades_solicitados')
    
    if equipamentos_e_quantidades_solicitados and equipamentos_e_quantidades_solicitados.strip():
        print("Processando dados de LOCAÇÃO")
        itens = [linha.strip() for linha in equipamentos_e_quantidades_solicitados.splitlines() if linha.strip()]
    else:
        print("Processando dados de COMPRA DE SEMINOVOS")
        item_encontrado = False
        
        for i in range(1, 7):
            item_nome = input_fields.get(f'item_{i}')
            item_quantidade = input_fields.get(f'item_{i}_quantidade', '1')
            
            if item_nome:
                item_encontrado = True
                print(item_nome)
                
                try:
                    quantidade = int(item_quantidade) if item_quantidade else 1
                    if quantidade > 0:
                        item_formatado = f"{quantidade} - {item_nome}"
                        itens.append(item_formatado)
                except (ValueError, TypeError):
                    print(f"Quantidade inválida para {item_nome}, assumindo 1")
                    itens.append(f"1 - {item_nome}")
        
        if not item_encontrado and not (equipamentos_e_quantidades_solicitados and equipamentos_e_quantidades_solicitados.strip()):
            raise ValueError("Nenhum item encontrado! Verifique se há dados de LOCAÇÃO ou COMPRA DE SEMINOVOS.")
    
    if not itens:
        raise ValueError("Nenhum item válido encontrado! Verifique se há dados de LOCAÇÃO ou COMPRA DE SEMINOVOS.")
    
    print("-------------")
    print("Itens processados:")
    for item in itens:
        print(f"- {item}")
    
    itens_estruturados = []
    for item in itens:
        match = re.match(r'(\d+)\s*-\s*(.*)', item)
        if match:
            quantidade, nome_equipamento = match.groups()
            itens_estruturados.append({
                "quantidade": int(quantidade),
                "equipamento": nome_equipamento.strip()
            })
        else:
            itens_estruturados.append({
                "quantidade": 1,
                "equipamento": item.strip()
            })
    
    return {
        "outputFields": {
            "itens": itens,
            "itens_estruturados": itens_estruturados,
            "total_itens": len(itens)
        }
    }