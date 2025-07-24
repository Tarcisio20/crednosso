@echo off
setlocal

REM Notifica início
curl.exe -X POST http://localhost:3001/tarefa-iniciada

REM Executa o script Python e captura o código de saída
cd /d C:\Users\tarci\Documents\projetos\crednosso\backend\boot-saldos-atms
C:\Python312\python.exe index.py >> logs\log_execucao.txt 2>&1
IF %ERRORLEVEL% NEQ 0 (
    REM Notifica erro se o script falhar
    curl.exe -X POST http://localhost:3001/tarefa-erro
)

REM Notifica término
curl.exe -X POST http://localhost:3001/tarefa-finalizada

endlocal
