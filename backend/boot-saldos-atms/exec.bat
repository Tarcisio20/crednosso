@echo off
setlocal

REM Notifica início
curl.exe -X POST http://172.16.98.170:5555/tarefa-iniciada

REM Muda para o diretório do projeto
cd /d C:\crednosso\backend\boot-saldos-atms

REM Executa com o Python da venv
venv\Scripts\python.exe index.py >> logs\log_execucao.txt 2>&1

REM Verifica se houve erro
IF %ERRORLEVEL% NEQ 0 (
    curl.exe -X POST http://172.16.98.170:5555/tarefa-erro
)

REM Notifica fim
curl.exe -X POST http://172.16.98.170:5555/tarefa-finalizada

endlocal
