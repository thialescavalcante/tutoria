@echo off
color 0B
echo ==========================================
echo   INICIANDO PLATAFORMA TUTOR BNCC
echo ==========================================

:: 1. Verificacao de Requisitos
python --version >nul 2>&1
if %errorlevel% neq 0 goto :ERRO_PYTHON

node -v >nul 2>&1
if %errorlevel% neq 0 goto :ERRO_NODE

echo [OK] Requisitos encontrados.

:: 2. Configuracao do Backend
echo Acessando pasta backend...
cd backend || goto :ERRO_PASTA_BACKEND

if not exist venv\Scripts\activate (
    echo Criando ambiente virtual...
    python -m venv venv
)

echo Ativando venv e instalando dependencias...
call venv\Scripts\activate
pip install -r requirements.txt

echo Iniciando Flask em segundo plano...
start "Servidor-Backend" /b python app.py
cd ..

:: 3. Configuracao do Frontend
echo Acessando pasta frontend...
cd frontend || goto :ERRO_PASTA_FRONTEND

if not exist node_modules (
    echo Instalando pacotes Node...
    call npm install
)

echo Iniciando interface React/Vite...
call npm run dev

goto :FIM

:: --- TRATAMENTO DE ERROS ---

:ERRO_PYTHON
echo [ERRO] Python nao encontrado.
pause
exit /b

:ERRO_NODE
echo [ERRO] Node.js nao encontrado.
pause
exit /b

:ERRO_PASTA_BACKEND
echo [ERRO] Pasta 'backend' nao encontrada.
pause
exit /b

:ERRO_PASTA_FRONTEND
echo [ERRO] Pasta 'frontend' nao encontrada.
pause
exit /b

:FIM
echo Operacao concluida.
pause