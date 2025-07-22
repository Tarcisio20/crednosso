from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from driver import get_driver
import time
from config import SITE_URL, USERNAME, PASSWORD

driver = get_driver()
try:
    print("[BOOT-PY] >> ACESSANDO SITE")
    driver.get(SITE_URL)
    time.sleep(2)
    driver.maximize_window()
    time.sleep(2)
    print("[BOOT-PY] >> INSERINDO USUARIO")
    driver.find_element(
        'xpath', '//*[@id="formulario:txLoginInput"]').send_keys(USERNAME)
    time.sleep(2)
    print("[BOOT-PY] >> INSERINDO SENHA")
    driver.find_element(
        'xpath', '//*[@id="formulario:txSenhaInput"]').send_keys(PASSWORD)
    time.sleep(2)
    print("[BOOT-PY] >> ENTER PARA LOGIN NO SISTEMA")
    button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '//*[@id="formulario:botaoEntrar"]'))
    )
    button.click()
    time.sleep(2)
    print("[BOOT-PY] >> ACESSANDO MENU")
    element = driver.find_element(
        'xpath', '//*[@id="form-cabecalho:menuSistema"]/ul/li[5]')
    actions = ActionChains(driver)
    actions.move_to_element(element).perform()
    time.sleep(2)
    print("[BOOT-PY] >> ACESSANDO SUB MENU")
    subElement = driver.find_element(
        'xpath', '/html/body/div[2]/form[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/span/div/ul/li[5]/ul/table/tbody/tr/td[1]/ul/li[5]/a/span')
    actions.move_to_element(subElement).perform()
    time.sleep(2)
    print("[BOOT-PY] >> ACESSANDO SUB MENU")
    subElement.click()
    time.sleep(2)
    print("[BOOT-PY] >> SELECIONANDO TIPO")
    type_select = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[2]/div[2]/form/span[1]/div/table/tbody/tr/td[1]/table[1]/tbody/tr[7]/td[2]/span/table/tbody/tr/td[1]/div/div[3]'))
    )
    actions.move_to_element(type_select).perform()
    type_select.click()
    time.sleep(2)
    print("[BOOT-PY] >> SELECIONANDO TIPO NO SELECT")
    type_sub_select = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, '/html/body/div[6]/div[2]/ul/li[2]')
        )
    )
    actions.move_to_element(type_sub_select).perform()
    type_sub_select.click()
    time.sleep(2)
    print("[BOOT-PY] >> PESQUISAR ATMS")
    button_pequisar = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH,
             '/html/body/div[2]/div[2]/form/span[1]/table/tbody/tr/td[1]/button')

        )
    )
    time.sleep(2)
    button_pequisar.click()
    time.sleep(2)
    atms = driver.find_elements(
      By.CLASS_NAME, "divATM"
    )
    time.sleep(2)
    infos = []
    for atm in atms:
        try:
          num = 1
          print("[BOOT-PY] >> PEGAR INFORMAÇÕES DE ATM "+str(num))
          driver.execute_script("arguments[0].scrollIntoView(true);", atm)
          time.sleep(1)

          nome = atm.find_element(By.CLASS_NAME, "divATMTitulo").text
          numero = atm.find_element(By.CLASS_NAME, "divATMTelaStatus").text
          rede = atm.find_element(By.CLASS_NAME, "divATMTelaStatus").get_attribute("title")
          saque = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/form/div/div[1]/div[2]/div[4]/img[3]").get_attribute("title") 
          leitor = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/form/div/div[1]/div[3]/img[5]").get_attribute("title") 
        
          WebDriverWait(driver, 5).until(EC.element_to_be_clickable(atm))
          driver.execute_script("arguments[0].click();", atm)
          time.sleep(2)
          transportadora = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/table[1]/tbody/tr[4]/td[2]/span/table/tbody/tr/td[1]/span").text
          habilitado = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/table[1]/tbody/tr[6]/td[2]/span/table/tbody/tr/td/span").text
          saldoCassetes = atm.find_element(By.XPATH,"/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/table[1]/tbody/tr[7]/td[2]/span/table/tbody/tr/td/span").text
          saldoRejeicao = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/table[1]/tbody/tr[8]/td[2]/span/table/tbody/tr/td/span").text
          totalLogico = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/table[1]/tbody/tr[9]/td[2]/span/table/tbody/tr/td/span").text
          saldoConta = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/table[1]/tbody/tr[10]/td[2]/span/table/tbody/tr/td/span").text
          qtCassA = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[1]/td[3]/span/table/tbody/tr/td/span").text
          qtRejA = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[1]/td[4]/span/table/tbody/tr/td/span").text
          qtCassB = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[2]/td[3]/span/table/tbody/tr/td/span").text
          qtRejB = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[2]/td[4]/span/table/tbody/tr/td/span").text
          qtCassC = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[3]/td[3]/span/table/tbody/tr/td/span").text
          qtRejC = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[3]/td[4]/span/table/tbody/tr/td/span").text
          qtCassD = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[4]/td[3]/span/table/tbody/tr/td/span").text
          qtRejD = atm.find_element(By.XPATH, "/html/body/div[2]/div[2]/div[3]/div[2]/form/span/div/div/div/div[1]/span/div[2]/div/table/tbody/tr[4]/td[4]/span/table/tbody/tr/td/span").text
          
          i = {
             "nome" : nome,
             "numero" : numero,
             "rede" : rede,
             "saque" : saque,
             "leitor" : leitor,
             "transportadora" : transportadora, 
             "habilitado" : habilitado,
             "saldoCassetes" : saldoCassetes,
             "saldoRejeicao" : saldoRejeicao,
             "totalLogico" : totalLogico,
             "saldoConta" : saldoConta,
             "qtCassA" : qtCassA, 
             "qtRejA" : qtRejA,
             "qtCassB" : qtCassB, 
             "qtRejB" : qtRejB,
             "qtCassC" : qtCassC, 
             "qtRejC" : qtRejC,
             "qtCassD" : qtCassD, 
             "qtRejD" : qtRejD
          }
          
          infos.append(i)
          num = num + 1
        except Exception as error:
          print("[BOOT-PY] >> ERRO AO ACESSAR O SISTEMA", error)
    print(infos)
    time.sleep(10)

    driver.quit()
except Exception as error:
    print("[BOOT-PY] >> ERRO AO ACESSAR O SISTEMA", error)
    driver.quit()
