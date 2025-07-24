# driver.py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def get_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    #options.add_argument("--headless=new")  # Executar em modo headless
    options.add_argument("--disable-gpu")  # Necessário para o Windows, se não for Linux
    options.add_argument("--no-sandbox") 
    # options.add_argument("--headless")  # se quiser rodar sem abrir janela
    service = Service("C:/Drivers/chromedriver.exe") 
    driver = webdriver.Chrome(service=service, options=options)
    return driver
