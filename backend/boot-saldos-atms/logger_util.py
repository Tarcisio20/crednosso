# logger_util.py

import logging
from datetime import datetime
import os

# Gera o nome do arquivo com data/hora
log_file = f"log_execucao_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.txt"
log_dir = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(log_dir, exist_ok=True)  # Cria a pasta se não existir
log_path = os.path.join(log_dir, log_file)

# Configura o logger
logging.basicConfig(
    filename=log_path,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    encoding="utf-8"
)

# Também imprime no terminal
console = logging.StreamHandler()
console.setLevel(logging.INFO)
console.setFormatter(logging.Formatter("%(asctime)s - [%(levelname)s] - %(message)s"))
logging.getLogger().addHandler(console)

# Funções para logar e imprimir
def log_info(msg: str):
    print(msg)
    logging.info(msg)

def log_error(msg: str, exc: Exception = None):
    print(msg)
    if exc:
        logging.error(msg, exc_info=True)
    else:
        logging.error(msg)
