import sys
import json
import time
import os

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


def _json_error(message: str, meta=None):
    payload = {"ok": False, "error": message}
    if meta is not None:
        payload["meta"] = meta
    sys.stdout.write(json.dumps(payload, ensure_ascii=False))


def validate_payload(rows):
    if not isinstance(rows, list) or len(rows) == 0:
        return False, "Payload deve ser um array JSON não vazio."

    required = ["id", "os", "number_card"]

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


def does_element_exist(navegador, by, value):
    return len(navegador.find_elements(by, value)) > 0


def safe_js_click(navegador, element):
    navegador.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        element
    )
    time.sleep(0.3)
    navegador.execute_script("arguments[0].click();", element)


def safe_click(navegador, by, value, timeout=20, sleep_after=0.6):
    wait_back_wait_disappear(navegador, timeout)

    el = WebDriverWait(navegador, timeout).until(
        EC.presence_of_element_located((by, value))
    )

    navegador.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        el
    )
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


def safe_click_element(navegador, element, sleep_after=0.6):
    navegador.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        element
    )
    time.sleep(0.3)
    wait_back_wait_disappear(navegador, 15)

    try:
        element.click()
    except Exception:
        try:
            safe_js_click(navegador, element)
        except Exception:
            navegador.execute_script("arguments[0].click();", element)

    time.sleep(sleep_after)
    wait_back_wait_disappear(navegador, 15)


def mark_checkbox_if_needed(navegador, xpath):
    el = safe_find(navegador, By.XPATH, xpath, 15)
    try:
        aria_checked = el.get_attribute("aria-checked")
        if aria_checked != "true":
            safe_click(navegador, By.XPATH, xpath, 15)
            return
    except Exception:
        pass

    try:
        cls = el.get_attribute("class") or ""
        if "ui-state-active" not in cls:
            safe_click(navegador, By.XPATH, xpath, 15)
            return
    except Exception:
        pass

    safe_click(navegador, By.XPATH, xpath, 15)


def normalize_card(value):
    return str(value or "").replace(" ", "").strip()


def normalize_text(value):
    return str(value or "").strip().casefold()


def post_atender_os_for_ids_return(item_id, situacao):
    base_url = os.getenv("BASE_URL", "http://localhost:3001").rstrip("/")
    api_path = "/open-os/atender-os-for-ids-return"
    api_url = f"{base_url}{api_path}"

    payload = {
        "id": int(item_id),
        "situacao": str(situacao),
    }

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
                    "payload": payload,
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
            "payload": payload,
        }

    except URLError as e:
        return {
            "ok": False,
            "error": "URLError",
            "details": str(e),
            "url": api_url,
            "payload": payload,
        }

    except Exception as e:
        return {
            "ok": False,
            "error": "Erro ao chamar API",
            "details": str(e),
            "url": api_url,
            "payload": payload,
        }


def login_backoffice(navegador):
    navegador.get("http://b2b.crednosso.com.br/backoffice/login.jsf")

    user = os.getenv("BACKOFFICE_USER")
    pwd = os.getenv("BACKOFFICE_PASS")

    if not user or not pwd:
        raise Exception("BACKOFFICE_USER/BACKOFFICE_PASS não definidos no ambiente.")

    print("[PY] >> FAZENDO LOGIN", file=sys.stderr, flush=True)

    safe_find(navegador, By.XPATH, '//*[@id="formulario:txLoginInput"]', 15).send_keys(user)
    time.sleep(1)

    safe_find(navegador, By.XPATH, '//*[@id="formulario:txSenhaInput"]', 15).send_keys(pwd)
    time.sleep(1)

    safe_click(navegador, By.XPATH, '//*[@id="formulario:botaoEntrar"]', 15, 1.0)
    time.sleep(2)


def open_os_screen(navegador):
    print("[PY] >> ACESSANDO PAGINA", file=sys.stderr, flush=True)

    menu = safe_find(
        navegador,
        By.XPATH,
        '//*[@id="form-cabecalho:menuSistema"]/ul/li[5]',
        15
    )
    ActionChains(navegador).move_to_element(menu).perform()
    time.sleep(2)

    submenu_a_xpath = "/html/body/div[2]/form[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span/div/ul/li[5]/ul/table/tbody/tr/td[1]/ul/li[8]/a"
    safe_click(navegador, By.XPATH, submenu_a_xpath, 15, 1.0)
    time.sleep(2)


def search_os(navegador, os_number):
    campo_os = safe_find(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr[1]/td[2]/span/table/tbody/tr/td/input",
        15,
    )

    time.sleep(1)
    campo_os.clear()
    time.sleep(1)

    campo_os.send_keys(str(os_number))
    time.sleep(1)
    campo_os.send_keys(Keys.TAB)
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


def get_first_os_row(navegador):
    row_xpath = "/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]"
    link_xpath = "/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]/td[1]/a"

    if not does_element_exist(navegador, By.XPATH, link_xpath):
        return None

    return navegador.find_element(By.XPATH, row_xpath)


def get_os_status_from_row(linha_os):
    situacao_el = linha_os.find_element(By.XPATH, "./td[8]/span")
    return situacao_el.text.strip()


def open_os_from_first_row(navegador):
    safe_click(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/form/span[2]/div[2]/div/table/tbody/tr[1]/td[1]/a",
        15,
        1.0,
    )


def click_secondary_confirmation_if_exists(navegador):
    xpath = "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/table/tbody/tr/td[1]/button[2]"
    if does_element_exist(navegador, By.XPATH, xpath):
        safe_click(navegador, By.XPATH, xpath, 15, 1.0)
        time.sleep(2)


def get_card_rows(navegador):
    table_rows_xpath = "/html/body/div[2]/div[2]/div[4]/div[2]/form/span/span/div/div[2]/table/tbody/tr"
    return navegador.find_elements(By.XPATH, table_rows_xpath)


def select_card_row(linha, navegador):
    candidatos = [
        ".//td[1]//input[@type='checkbox']",
        ".//td[1]//div[contains(@class, 'ui-chkbox-box')]",
        ".//td[1]//span[contains(@class, 'ui-chkbox')]",
        ".//td[1]",
    ]

    ultimo_erro = None

    for xpath in candidatos:
        try:
            el = linha.find_element(By.XPATH, xpath)
            safe_click_element(navegador, el, 0.8)
            return True
        except Exception as e:
            ultimo_erro = e

    if ultimo_erro:
        raise ultimo_erro

    return False


def find_and_select_card_row(navegador, number_card_alvo):
    linhas = get_card_rows(navegador)
    time.sleep(2)

    linha_encontrada = None

    for i, linha in enumerate(linhas, start=1):
        try:
            td_card = linha.find_element(By.XPATH, "./td[2]")
            card_tela = normalize_card(td_card.text)

            print(f"[PY] Linha {i}: cartão={card_tela}", file=sys.stderr, flush=True)

            if card_tela == number_card_alvo:
                linha_encontrada = linha
                print(f"[PY] Cartão encontrado na linha {i}", file=sys.stderr, flush=True)
                break
        except Exception as e:
            print(f"[PY] Erro lendo linha {i}: {e}", file=sys.stderr, flush=True)

    if not linha_encontrada:
        return False

    select_card_row(linha_encontrada, navegador)
    return True


def finalize_card_selection(navegador):
    safe_click(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/div[4]/div[2]/form/center/button[1]",
        15,
        1.0,
    )

    time.sleep(5)

    safe_click(
        navegador,
        By.XPATH,
        "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/table/tbody/tr/td[2]/button",
        15,
        1.0,
    )


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

    chrome_options = Options()
    # chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    servico = Service()
    navegador = webdriver.Chrome(service=servico, options=chrome_options)

    try:
        navegador.maximize_window()

        login_backoffice(navegador)
        open_os_screen(navegador)

        result = []

        for os_item in openOSs:
            try:
                os_numero = str(os_item.get("os", "")).strip()
                number_card_alvo = normalize_card(os_item.get("number_card"))
                item_id = os_item.get("id")

                print(f"[PY] >> PROCESSANDO OS {os_numero}", file=sys.stderr, flush=True)

                search_os(navegador, os_numero)

                linha_os = get_first_os_row(navegador)
                if not linha_os:
                    result.append(
                        {
                            "id": item_id,
                            "os": os_numero,
                            "terminal": str(os_item.get("terminal", "")),
                            "ok": False,
                            "error": "OS não encontrada na tabela de resultados.",
                        }
                    )
                    continue

                situacao = get_os_status_from_row(linha_os)
                print(f"[PY] Situação da OS {os_numero}: {situacao}", file=sys.stderr, flush=True)

                if normalize_text(situacao) != "pendente":
                    result.append(
                        {
                            "id": item_id,
                            "os": os_numero,
                            "terminal": str(os_item.get("terminal", "")),
                            "ok": False,
                            "error": f"OS com situação diferente de Pendente: {situacao}",
                        }
                    )
                    continue

                open_os_from_first_row(navegador)
                time.sleep(2)

                click_secondary_confirmation_if_exists(navegador)

                encontrou_cartao = find_and_select_card_row(navegador, number_card_alvo)
                if not encontrou_cartao:
                    result.append(
                        {
                            "id": item_id,
                            "os": os_numero,
                            "terminal": str(os_item.get("terminal", "")),
                            "ok": False,
                            "error": f"Cartão {number_card_alvo} não encontrado na tabela.",
                        }
                    )
                    continue

                finalize_card_selection(navegador)

                api_response = post_atender_os_for_ids_return(
                    item_id=item_id,
                    situacao="Em atendimento",
                )

                result.append(
                    {
                        "id": item_id,
                        "os": os_numero,
                        "terminal": str(os_item.get("terminal", "")),
                        "ok": api_response.get("ok"),
                        "error": api_response.get("error"),
                    }
                )

            except Exception as e:
                result.append(
                    {
                        "id": os_item.get("id"),
                        "os": str(os_item.get("os", "")),
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