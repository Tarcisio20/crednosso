import os
import pandas as pd
from datetime import datetime
from logger_util import log_info, log_error  # Se você usa logging customizado

def salvar_planilha(infos: list[dict], nome_base: str = "dados", subpasta: str = "planilhas") -> str:
    """
    Salva uma lista de dicionários em uma planilha Excel com data atual,
    na pasta planilhas UMA PASTA ACIMA do diretório onde esse script está.

    Args:
        infos (list[dict]): Lista de dicionários com os dados.
        nome_base (str): Nome base do arquivo (sem extensão).
        subpasta (str): Nome da subpasta onde salvar (dentro da pasta superior).

    Returns:
        str: Caminho completo do arquivo salvo.
    """
    try:
        # Caminho uma pasta acima do diretório atual
        pasta_superior = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        caminho_pasta = os.path.join(pasta_superior, subpasta)
        os.makedirs(caminho_pasta, exist_ok=True)

        data_atual = datetime.now().strftime("%d-%m-%Y")
        nome_arquivo = f"{nome_base}-{data_atual}.xlsx"
        caminho_arquivo = os.path.join(caminho_pasta, nome_arquivo)

        df = pd.DataFrame(infos)
        df.to_excel(caminho_arquivo, index=False)

        log_info(f"[EXCEL_UTIL] >> PLANILHA SALVA: {caminho_arquivo}")
        return caminho_arquivo
    except Exception as e:
        log_error("[EXCEL_UTIL] >> ERRO AO SALVAR PLANILHA", e)
        raise
