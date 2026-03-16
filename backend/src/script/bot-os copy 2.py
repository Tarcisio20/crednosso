import sys
import json
import time
import math
import os
import pandas as pd

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

teste = False


def workData(data):
    data_datetime = pd.to_datetime(data)
    dia = data_datetime.day
    mes = data_datetime.month
    ano = data_datetime.year
    return f"{dia:02d}/{mes:02d}/{ano}"


def comparingDates(dateAt):
    data_atual = pd.to_datetime('today').normalize()
    outra_data = pd.to_datetime(dateAt, format='%d/%m/%Y')
    return data_atual == outra_data


def textDescription(type, dateAt, cass_A, cass_B, cass_C, cass_D):
    dt = comparingDates(dateAt)
    if type in ('S', 's'):
        if (cass_A == 0 or math.isnan(cass_A)) and (cass_B == 0 or math.isnan(cass_B)) and (cass_C == 0 or math.isnan(cass_C)) and (cass_D == 0 or math.isnan(cass_D)):
            return ('RECOLHIMENTO ESPECIAL - ' if dt else 'RECOLHIMENTO TOTAL - ') + dateAt
        else:
            return ('TROCA TOTAL ESPECIAL - ' if dt else 'TROCA TOTAL - ') + dateAt
    elif type in ('N', 'n'):
        return ('ABASTECIMENTO COMPLEMENTAR ESPECIAL - ' if dt else 'ABASTECIMENTO COMPLEMENTAR - ') + dateAt
    return f"ABASTECIMENTO - {dateAt}"


def _json_error(message: str, meta=None):
    payload = {"ok": False, "error": message}
    if meta is not None:
        payload["meta"] = meta
    sys.stdout.write(json.dumps(payload, ensure_ascii=False))


def validate_payload(rows):
    if not isinstance(rows, list) or len(rows) == 0:
        return False, "Payload deve ser um array JSON não vazio."

    required = ["terminal", "troca_total", "data_atendimento",
                "cassete_A", "cassete_B", "cassete_C", "cassete_D"]
    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            return False, f"Item {i} não é um objeto."
        missing = [k for k in required if k not in row]
        if missing:
            return False, f"Item {i} está faltando campos: {', '.join(missing)}"
    return True, ""


def mark_checkbox_if_needed(navegador, xpath):
    el = WebDriverWait(navegador, 10).until(
        EC.presence_of_element_located((By.XPATH, xpath))
    )
    try:
        aria_checked = el.get_attribute("aria-checked")
        if aria_checked != "true":
            el.click()
    except Exception:
        try:
            cls = el.get_attribute("class") or ""
            if "ui-state-active" not in cls:
                el.click()
        except Exception:
            el.click()
    time.sleep(1)


def recover_num_os_single(navegador, terminal):
    elementNumAtm = WebDriverWait(navegador, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[2]/td[2]/table/tbody/tr/td[1]/input'))
    )
    time.sleep(1)
    elementNumAtm.clear()
    time.sleep(1)

    elementNumAtm.send_keys(str(terminal))
    time.sleep(1)
    elementNumAtm.send_keys(Keys.TAB)
    time.sleep(1)

    mark_checkbox_if_needed(
        navegador,
        '/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[6]/td[2]/span/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]'
    )

    mark_checkbox_if_needed(
        navegador,
        '/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[7]/td[2]/span/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]'
    )

    mark_checkbox_if_needed(
        navegador,
        '/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[7]/td[2]/span/table/tbody/tr/td/table/tbody/tr/td[3]/div/div[2]'
    )

    buttonSearch = WebDriverWait(navegador, 10).until(
        EC.element_to_be_clickable(
            (By.XPATH, '/html/body/div[2]/div[2]/form/span[1]/table/tbody/tr/td[1]/button'))
    )
    buttonSearch.click()
    time.sleep(5)

    numOS = WebDriverWait(navegador, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]/td[4]/span'))
    )
    situacao = WebDriverWait(navegador, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]/td[8]/span'))
    )
    valorOS = WebDriverWait(navegador, 10).until(
        EC.presence_of_element_located(
            (By.ID, 'formularioOrdemServicoAtmConsultar:tabelaDataTable:0:tabelavalortarefaSuprimentoordemNumerarioTOvlExibido'))
    )

    return {
        'terminal': str(terminal),
        'os': numOS.text,
        'situacao': situacao.text,
        'valor': valorOS.text
    }


def main():
    raw = sys.stdin.read()
    try:
        openOSs = json.loads(raw)
    except Exception:
        _json_error("JSON inválido recebido no stdin.")
        return

    ok, msg = validate_payload(openOSs)
    if not ok:
        _json_error(msg)
        return

    normalized = []
    for row in openOSs:
        cassA = float(row.get("cassete_A", 0) or 0)
        cassB = float(row.get("cassete_B", 0) or 0)
        cassC = float(row.get("cassete_C", 0) or 0)
        cassD = float(row.get("cassete_D", 0) or 0)

        dt = row.get("data_atendimento")
        try:
            if isinstance(dt, str) and "/" in dt:
                dt_fmt = dt
            else:
                dt_fmt = workData(dt)
        except Exception:
            dt_fmt = str(dt or "")

        troca_total = row.get("troca_total", "N")
        text_obs = row.get("text_obs") or textDescription(
            troca_total, dt_fmt, cassA, cassB, cassC, cassD)

        normalized.append({
            **row,
            "terminal": str(row.get("terminal", "")),
            "data_atendimento": dt_fmt,
            "text_obs": text_obs,
            "cassete_A": cassA,
            "cassete_B": cassB,
            "cassete_C": cassC,
            "cassete_D": cassD,
        })

    chrome_options = Options()
    # chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    servico = Service()
    navegador = webdriver.Chrome(service=servico, options=chrome_options)

    try:
        navegador.maximize_window()
        navegador.get('http://b2b.crednosso.com.br/backoffice/login.jsf')

        user = os.getenv("BACKOFFICE_USER")
        pwd = os.getenv("BACKOFFICE_PASS")
        if not user or not pwd:
            _json_error("BACKOFFICE_USER/BACKOFFICE_PASS não definidos no ambiente.")
            return

        print("[PY] >> FAZENDO LOGIN", file=sys.stderr, flush=True)

        navegador.find_element('xpath', '//*[@id="formulario:txLoginInput"]').send_keys(user)
        time.sleep(1)
        navegador.find_element('xpath', '//*[@id="formulario:txSenhaInput"]').send_keys(pwd)
        time.sleep(1)

        WebDriverWait(navegador, 15).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="formulario:botaoEntrar"]'))
        ).click()

        time.sleep(2)
        print("[PY] >> ACESSANDO PAGINA", file=sys.stderr, flush=True)

        element = WebDriverWait(navegador, 15).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="form-cabecalho:menuSistema"]/ul/li[5]'))
        )
        ActionChains(navegador).move_to_element(element).perform()
        time.sleep(2)

        submenu_a_xpath = "/html/body/div[2]/form[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span/div/ul/li[5]/ul/table/tbody/tr/td[1]/ul/li[8]/a"

        try:
            WebDriverWait(navegador, 15).until(
                EC.element_to_be_clickable((By.XPATH, submenu_a_xpath))
            ).click()
        except Exception:
            el = WebDriverWait(navegador, 15).until(
                EC.presence_of_element_located((By.XPATH, submenu_a_xpath))
            )
            navegador.execute_script("arguments[0].click();", el)

        time.sleep(2)

        result = []

        for os_item in normalized:
            elementHidden = navegador.find_element('xpath', '/html/body/div[2]/div[2]/form/table[2]/tbody/tr/td[2]')
            navegador.execute_script("arguments[0].style.display = 'block'", elementHidden)
            time.sleep(1)

            WebDriverWait(navegador, 15).until(
                EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/form/span[1]/table/tbody/tr/td[2]/button'))
            ).click()
            time.sleep(1)

            print(f"[PY] >> INFORMANDO ATM {os_item.get('terminal', '')}", file=sys.stderr, flush=True)

            inputAtm = WebDriverWait(navegador, 15).until(
                EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div[2]/div[1]/div[2]/form/span/div/table/tbody/tr[1]/td[2]/table/tbody/tr/td[1]/input'))
            )
            inputAtm.clear()
            inputAtm.send_keys(str(os_item.get('terminal', '')))
            time.sleep(1)

            print("[PY] >> SELECIONANDO TIPO DE ABASTECIMENTO", file=sys.stderr, flush=True)

            inputAtm.send_keys(Keys.TAB)
            time.sleep(1)

            WebDriverWait(navegador, 15).until(
                EC.element_to_be_clickable((By.XPATH, "/html/body/div[2]/div[2]/div[1]/div[2]/form/span/div/table/tbody/tr[2]/td[2]/span/table/tbody/tr/td[1]/div"))
            ).click()
            time.sleep(1)

            try:
                WebDriverWait(navegador, 15).until(
                    EC.element_to_be_clickable((
                        By.XPATH,
                        "//div[contains(@class,'ui-selectonemenu-panel') and contains(@style,'display')]//li[@title='TRANSPORTE_VALORES']"
                    ))
                ).click()
            except Exception:
                WebDriverWait(navegador, 15).until(
                    EC.element_to_be_clickable((
                        By.XPATH,
                        "//div[contains(@class,'ui-selectonemenu-panel') and contains(@style,'display')]//li[normalize-space()='Transporte de valores']"
                    ))
                ).click()

            time.sleep(1)

            WebDriverWait(navegador, 15).until(
                EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[1]/div[2]/form/span/table/tbody/tr/td[1]/button'))
            ).click()
            time.sleep(1)

            print("[PY] >> INFORMANDO DESCRIÇÃO", file=sys.stderr, flush=True)

            WebDriverWait(navegador, 15).until(
                EC.presence_of_element_located((By.XPATH, '//*[@id="formularioOrdemServicoAtmJanelaCadastrar:txDescricaoInput"]'))
            ).send_keys(os_item['text_obs'])
            time.sleep(1)

            if os_item.get('troca_total') in ('S', 's'):
                WebDriverWait(navegador, 15).until(
                    EC.element_to_be_clickable((By.XPATH, '//*[@id="formularioOrdemServicoAtmJanelaCadastrar:j_idt277"]'))
                ).click()
                time.sleep(1)

            cassA = float(os_item.get('cassete_A', 0) or 0)
            cassB = float(os_item.get('cassete_B', 0) or 0)
            cassC = float(os_item.get('cassete_C', 0) or 0)
            cassD = float(os_item.get('cassete_D', 0) or 0)

            def is_zero_or_nan(v):
                try:
                    return v == 0 or math.isnan(v)
                except Exception:
                    return v == 0

            if not (is_zero_or_nan(cassA) and is_zero_or_nan(cassB) and is_zero_or_nan(cassC) and is_zero_or_nan(cassD)):
                WebDriverWait(navegador, 15).until(
                    EC.element_to_be_clickable((By.XPATH, '//*[@id="formularioOrdemServicoAtmJanelaCadastrar:j_idt279"]'))
                ).click()
                time.sleep(1)

                if not is_zero_or_nan(cassA):
                    WebDriverWait(navegador, 15).until(
                        EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[1]/td[1]/div'))
                    ).click()
                    time.sleep(1)
                    inputCass_A = WebDriverWait(navegador, 15).until(
                        EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[1]/td[4]/span/input'))
                    )
                    inputCass_A.clear()
                    inputCass_A.send_keys(str(int(cassA)))
                    time.sleep(1)

                if not is_zero_or_nan(cassB):
                    WebDriverWait(navegador, 15).until(
                        EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[2]/td[1]/div'))
                    ).click()
                    time.sleep(1)
                    inputCass_B = WebDriverWait(navegador, 15).until(
                        EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[2]/td[4]/span/input'))
                    )
                    inputCass_B.clear()
                    inputCass_B.send_keys(str(int(cassB)))
                    time.sleep(1)

                if not is_zero_or_nan(cassC):
                    WebDriverWait(navegador, 15).until(
                        EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[3]/td[1]/div'))
                    ).click()
                    time.sleep(1)
                    inputCass_C = WebDriverWait(navegador, 15).until(
                        EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[3]/td[4]/span/input'))
                    )
                    inputCass_C.clear()
                    inputCass_C.send_keys(str(int(cassC)))
                    time.sleep(1)

                if not is_zero_or_nan(cassD):
                    WebDriverWait(navegador, 15).until(
                        EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[4]/td[1]/div'))
                    ).click()
                    time.sleep(1)
                    inputCass_D = WebDriverWait(navegador, 15).until(
                        EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[4]/td[4]/span/input'))
                    )
                    inputCass_D.clear()
                    inputCass_D.send_keys(str(int(cassD)))
                    time.sleep(1)

            time.sleep(1)

            if teste:
                WebDriverWait(navegador, 15).until(
                    EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/table/tbody/tr/td[2]/button'))
                ).click()
            else:
                WebDriverWait(navegador, 15).until(
                    EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[2]/div[2]/div[2]/form/span/table/tbody/tr/td[1]/button'))
                ).click()

            time.sleep(6)

            print(f"[PY] >> RECUPERANDO OS DO TERMINAL {os_item.get('terminal', '')}", file=sys.stderr, flush=True)
            os_info = recover_num_os_single(navegador, os_item.get("terminal", ""))
            result.append(os_info)

        sys.stdout.write(json.dumps(result, ensure_ascii=False))

    finally:
        try:
            navegador.quit()
        except Exception:
            pass


if __name__ == "__main__":
    main()