import sys
import json
import time
import math
import os
import pandas as pd

from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException

teste = False


def workData(data):
    data_datetime = pd.to_datetime(data)
    dia = data_datetime.day
    mes = data_datetime.month
    ano = data_datetime.year
    return f"{dia:02d}/{mes:02d}/{ano}"


def comparingDates(dateAt):
    data_atual = pd.to_datetime("today").normalize()
    outra_data = pd.to_datetime(dateAt, format="%d/%m/%Y")
    return data_atual == outra_data


def is_zero_or_nan(v):
    try:
        return v == 0 or math.isnan(v)
    except Exception:
        return v == 0


def textDescription(tipo, dateAt, cass_A, cass_B, cass_C, cass_D):
    dt = comparingDates(dateAt)

    if tipo in ("S", "s"):
        if (
            is_zero_or_nan(cass_A)
            and is_zero_or_nan(cass_B)
            and is_zero_or_nan(cass_C)
            and is_zero_or_nan(cass_D)
        ):
            return ("RECOLHIMENTO ESPECIAL - " if dt else "RECOLHIMENTO TOTAL - ") + dateAt
        return ("TROCA TOTAL ESPECIAL - " if dt else "TROCA TOTAL - ") + dateAt

    if tipo in ("N", "n"):
        return ("ABASTECIMENTO COMPLEMENTAR ESPECIAL - " if dt else "ABASTECIMENTO COMPLEMENTAR - ") + dateAt

    return f"ABASTECIMENTO - {dateAt}"


def _json_error(message: str, meta=None):
    payload = {"ok": False, "error": message}
    if meta is not None:
        payload["meta"] = meta
    sys.stdout.write(json.dumps(payload, ensure_ascii=False))


def validate_payload(rows):
    if not isinstance(rows, list) or len(rows) == 0:
        return False, "Payload deve ser um array JSON não vazio."

    required = [
        "job_id",
        "id_supply",
        "id_treasury",
        "treasury_name",
        "date_on_supply",
        "id_atm",
        "atm_name",
        "terminal",
        "troca_total",
        "data_atendimento",
        "cassete_A",
        "cassete_B",
        "cassete_C",
        "cassete_D",
    ]

    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            return False, f"Item {i} não é um objeto."

        missing = [k for k in required if k not in row]
        if missing:
            return False, f"Item {i} está faltando campos: {', '.join(missing)}"

    return True, ""


def wait_back_wait_disappear(navegador, timeout=20):
    try:
        WebDriverWait(navegador, timeout).until(
            EC.invisibility_of_element_located((By.CSS_SELECTOR, ".back-wait"))
        )
    except TimeoutException:
        pass
    except Exception:
        pass


def safe_find(navegador, by, value, timeout=20):
    wait_back_wait_disappear(navegador, timeout)
    return WebDriverWait(navegador, timeout).until(
        EC.presence_of_element_located((by, value))
    )


def safe_js_click(navegador, element):
    navegador.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.3)
    navegador.execute_script("arguments[0].click();", element)


def safe_click(navegador, by, value, timeout=20, sleep_after=0.6):
    wait_back_wait_disappear(navegador, timeout)

    el = WebDriverWait(navegador, timeout).until(
        EC.presence_of_element_located((by, value))
    )

    navegador.execute_script("arguments[0].scrollIntoView({block: 'center'});", el)
    time.sleep(0.3)
    wait_back_wait_disappear(navegador, timeout)

    try:
        WebDriverWait(navegador, timeout).until(
            EC.element_to_be_clickable((by, value))
        )
        el.click()
    except Exception:
        time.sleep(0.5)
        wait_back_wait_disappear(navegador, timeout)
        try:
            el.click()
        except Exception:
            safe_js_click(navegador, el)

    time.sleep(sleep_after)
    wait_back_wait_disappear(navegador, timeout)
    return el


def mark_checkbox_if_needed(navegador, xpath):
    el = safe_find(navegador, By.XPATH, xpath, 15)
    try:
        aria_checked = el.get_attribute("aria-checked")
        if aria_checked != "true":
            safe_click(navegador, By.XPATH, xpath, 15)
    except Exception:
        try:
            cls = el.get_attribute("class") or ""
            if "ui-state-active" not in cls:
                safe_click(navegador, By.XPATH, xpath, 15)
        except Exception:
            safe_click(navegador, By.XPATH, xpath, 15)


def recover_num_os_single(navegador, terminal):
    elementNumAtm = safe_find(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[2]/td[2]/table/tbody/tr/td[1]/input",
        15,
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
        "/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[6]/td[2]/span/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]",
    )

    mark_checkbox_if_needed(
        navegador,
        "/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[7]/td[2]/span/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]",
    )

    mark_checkbox_if_needed(
        navegador,
        "/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[7]/td[2]/span/table/tbody/tr/td/table/tbody/tr/td[3]/div/div[2]",
    )

    safe_click(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/form/span[1]/table/tbody/tr/td[1]/button",
        15,
        1.0,
    )

    time.sleep(4)

    numOS = safe_find(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]/td[4]/span",
        15,
    )
    situacao = safe_find(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]/td[8]/span",
        15,
    )
    valorOS = safe_find(
        navegador,
        By.ID,
        "formularioOrdemServicoAtmConsultar:tabelaDataTable:0:tabelavalortarefaSuprimentoordemNumerarioTOvlExibido",
        15,
    )

    return {
        "terminal": str(terminal),
        "os": numOS.text,
        "situacao": situacao.text,
        "valor": valorOS.text,
    }


def post_open_os_to_api(payload):
    base_url = os.getenv("BASE_URL", "http://localhost:3001").rstrip("/")
    api_path = os.getenv("OPEN_OS_API_PATH", "/open-os/add-os").strip()

    if not api_path.startswith("/"):
        api_path = "/" + api_path

    api_url = f"{base_url}{api_path}"

    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = Request(
        api_url,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )

    try:
        with urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            try:
                return json.loads(raw)
            except Exception:
                return {
                    "ok": True,
                    "raw": raw,
                    "url": api_url,
                }

    except HTTPError as e:
        try:
            err_body = e.read().decode("utf-8")
        except Exception:
            err_body = str(e)

        return {
            "ok": False,
            "error": f"HTTPError {e.code}",
            "details": err_body,
            "url": api_url,
        }

    except URLError as e:
        return {
            "ok": False,
            "error": "URLError",
            "details": str(e),
            "url": api_url,
        }

    except Exception as e:
        return {
            "ok": False,
            "error": "Erro ao chamar API",
            "details": str(e),
            "url": api_url,
        }


def build_api_payload(os_item, os_info):
    return {
        "job_id": os_item.get("job_id"),
        "socket_id": os_item.get("socket_id"),
        "id_supply": int(os_item.get("id_supply", 0) or 0),
        "id_treasury": int(os_item.get("id_treasury", 0) or 0),
        "treasury_name": str(os_item.get("treasury_name", "") or ""),
        "date_on_supply": str(os_item.get("date_on_supply", "") or ""),
        "id_atm": int(os_item.get("id_atm", 0) or 0),
        "atm_name": str(os_item.get("atm_name", "") or ""),
        "terminal": str(os_item.get("terminal", "") or ""),
        "total_exchange": bool(os_item.get("total_exchange", False)),
        "troca_total": str(os_item.get("troca_total", "N") or "N"),
        "cassete_A": float(os_item.get("cassete_A", 0) or 0),
        "cassete_B": float(os_item.get("cassete_B", 0) or 0),
        "cassete_C": float(os_item.get("cassete_C", 0) or 0),
        "cassete_D": float(os_item.get("cassete_D", 0) or 0),
        "emails": os_item.get("emails", []) or [],
        "operator_card": os_item.get("operator_card"),
        "text_obs": str(os_item.get("text_obs", "") or ""),
        "os": str(os_info.get("os", "") or ""),
        "situacao": str(os_info.get("situacao", "") or ""),
        "valor": str(os_info.get("valor", "") or ""),
        "status": True,
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
            troca_total, dt_fmt, cassA, cassB, cassC, cassD
        )

        normalized.append(
            {
                **row,
                "terminal": str(row.get("terminal", "")),
                "data_atendimento": dt_fmt,
                "text_obs": text_obs,
                "cassete_A": cassA,
                "cassete_B": cassB,
                "cassete_C": cassC,
                "cassete_D": cassD,
            }
        )

    chrome_options = Options()
    # chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    servico = Service()
    navegador = webdriver.Chrome(service=servico, options=chrome_options)

    try:
        navegador.maximize_window()
        navegador.get("http://b2b.crednosso.com.br/backoffice/login.jsf")

        user = os.getenv("BACKOFFICE_USER")
        pwd = os.getenv("BACKOFFICE_PASS")

        if not user or not pwd:
            _json_error("BACKOFFICE_USER/BACKOFFICE_PASS não definidos no ambiente.")
            return

        print("[PY] >> FAZENDO LOGIN", file=sys.stderr, flush=True)

        safe_find(navegador, By.XPATH, '//*[@id="formulario:txLoginInput"]', 15).send_keys(user)
        time.sleep(1)
        safe_find(navegador, By.XPATH, '//*[@id="formulario:txSenhaInput"]', 15).send_keys(pwd)
        time.sleep(1)

        safe_click(navegador, By.XPATH, '//*[@id="formulario:botaoEntrar"]', 15, 1.0)

        time.sleep(2)
        print("[PY] >> ACESSANDO PAGINA", file=sys.stderr, flush=True)

        element = safe_find(navegador, By.XPATH, '//*[@id="form-cabecalho:menuSistema"]/ul/li[5]', 15)
        ActionChains(navegador).move_to_element(element).perform()
        time.sleep(2)

        submenu_a_xpath = "/html/body/div[2]/form[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span/div/ul/li[5]/ul/table/tbody/tr/td[1]/ul/li[8]/a"
        safe_click(navegador, By.XPATH, submenu_a_xpath, 15, 1.0)

        time.sleep(2)

        result = []

        for os_item in normalized:
            try:
                elementHidden = navegador.find_element(
                    "xpath",
                    "/html/body/div[2]/div[2]/form/table[2]/tbody/tr/td[2]",
                )
                navegador.execute_script("arguments[0].style.display = 'block'", elementHidden)
                time.sleep(1)

                safe_click(
                    navegador,
                    By.XPATH,
                    "/html/body/div[2]/div[2]/form/span[1]/table/tbody/tr/td[2]/button",
                    15,
                    1.0,
                )

                print(
                    f"[PY] >> INFORMANDO ATM {os_item.get('terminal', '')}",
                    file=sys.stderr,
                    flush=True,
                )

                inputAtm = safe_find(
                    navegador,
                    By.XPATH,
                    "/html/body/div[2]/div[2]/div[1]/div[2]/form/span/div/table/tbody/tr[1]/td[2]/table/tbody/tr/td[1]/input",
                    15,
                )
                inputAtm.clear()
                inputAtm.send_keys(str(os_item.get("terminal", "")))
                time.sleep(1)

                print("[PY] >> SELECIONANDO TIPO DE ABASTECIMENTO", file=sys.stderr, flush=True)

                inputAtm.send_keys(Keys.TAB)
                time.sleep(1)

                safe_click(
                    navegador,
                    By.XPATH,
                    "/html/body/div[2]/div[2]/div[1]/div[2]/form/span/div/table/tbody/tr[2]/td[2]/span/table/tbody/tr/td[1]/div",
                    15,
                )

                try:
                    safe_click(
                        navegador,
                        By.XPATH,
                        "//div[contains(@class,'ui-selectonemenu-panel') and contains(@style,'display')]//li[@title='TRANSPORTE_VALORES']",
                        15,
                    )
                except Exception:
                    safe_click(
                        navegador,
                        By.XPATH,
                        "//div[contains(@class,'ui-selectonemenu-panel') and contains(@style,'display')]//li[normalize-space()='Transporte de valores']",
                        15,
                    )

                safe_click(
                    navegador,
                    By.XPATH,
                    "/html/body/div[2]/div[2]/div[1]/div[2]/form/span/table/tbody/tr/td[1]/button",
                    15,
                    1.0,
                )

                print("[PY] >> INFORMANDO DESCRIÇÃO", file=sys.stderr, flush=True)

                safe_find(
                    navegador,
                    By.XPATH,
                    '//*[@id="formularioOrdemServicoAtmJanelaCadastrar:txDescricaoInput"]',
                    15,
                ).send_keys(os_item["text_obs"])
                time.sleep(1)

                if os_item.get("troca_total") in ("S", "s"):
                    safe_click(
                        navegador,
                        By.XPATH,
                        '//*[@id="formularioOrdemServicoAtmJanelaCadastrar:j_idt277"]',
                        15,
                    )

                cassA = float(os_item.get("cassete_A", 0) or 0)
                cassB = float(os_item.get("cassete_B", 0) or 0)
                cassC = float(os_item.get("cassete_C", 0) or 0)
                cassD = float(os_item.get("cassete_D", 0) or 0)

                if not (
                    is_zero_or_nan(cassA)
                    and is_zero_or_nan(cassB)
                    and is_zero_or_nan(cassC)
                    and is_zero_or_nan(cassD)
                ):
                    safe_click(
                        navegador,
                        By.XPATH,
                        '//*[@id="formularioOrdemServicoAtmJanelaCadastrar:j_idt279"]',
                        15,
                    )

                    if not is_zero_or_nan(cassA):
                        safe_click(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[1]/td[1]/div",
                            15,
                        )
                        inputCass_A = safe_find(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[1]/td[4]/span/input",
                            15,
                        )
                        inputCass_A.clear()
                        inputCass_A.send_keys(str(int(cassA)))
                        time.sleep(1)

                    if not is_zero_or_nan(cassB):
                        safe_click(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[2]/td[1]/div",
                            15,
                        )
                        inputCass_B = safe_find(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[2]/td[4]/span/input",
                            15,
                        )
                        inputCass_B.clear()
                        inputCass_B.send_keys(str(int(cassB)))
                        time.sleep(1)

                    if not is_zero_or_nan(cassC):
                        safe_click(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[3]/td[1]/div",
                            15,
                        )
                        inputCass_C = safe_find(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[3]/td[4]/span/input",
                            15,
                        )
                        inputCass_C.clear()
                        inputCass_C.send_keys(str(int(cassC)))
                        time.sleep(1)

                    if not is_zero_or_nan(cassD):
                        safe_click(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[4]/td[1]/div",
                            15,
                        )
                        inputCass_D = safe_find(
                            navegador,
                            By.XPATH,
                            "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/div/table[6]/tbody/tr[2]/td[4]/span/div/div/table/tbody/tr[4]/td[4]/span/input",
                            15,
                        )
                        inputCass_D.clear()
                        inputCass_D.send_keys(str(int(cassD)))
                        time.sleep(1)

                if teste:
                    safe_click(
                        navegador,
                        By.XPATH,
                        "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/table/tbody/tr/td[2]/button",
                        15,
                        1.0,
                    )
                else:
                    safe_click(
                        navegador,
                        By.XPATH,
                        "/html/body/div[2]/div[2]/div[2]/div[2]/form/span/table/tbody/tr/td[1]/button",
                        15,
                        1.0,
                    )

                time.sleep(5)

                print(
                    f"[PY] >> RECUPERANDO OS DO TERMINAL {os_item.get('terminal', '')}",
                    file=sys.stderr,
                    flush=True,
                )

                os_info = recover_num_os_single(navegador, os_item.get("terminal", ""))

                payload_api = build_api_payload(os_item, os_info)
                api_response = post_open_os_to_api(payload_api)

                result.append(
                    {
                        **os_info,
                        "ok": bool(os_info.get("os")),
                        "api_response": api_response,
                    }
                )

            except Exception as e:
                result.append(
                    {
                        "terminal": str(os_item.get("terminal", "")),
                        "ok": False,
                        "error": str(e),
                    }
                )

        sys.stdout.write(json.dumps(result, ensure_ascii=False))

    finally:
        try:
            navegador.quit()
        except Exception:
            pass


if __name__ == "__main__":
    main()