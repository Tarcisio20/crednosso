from dotenv import load_dotenv
import os
from pathlib import Path

dotenv_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

SITE_URL = os.getenv("SITE_URL")
USERNAME = os.getenv("MY_USERNAME", "")
PASSWORD = os.getenv("MY_PASSWORD")
