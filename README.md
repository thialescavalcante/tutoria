# Tutor de Matemática IA - BNCC 🎓📐

O **Tutor de Matemática IA** é uma plataforma Full Stack projetada para transformar o aprendizado de matemática do Ensino Fundamental (1º ao 9º ano). Utilizando o **Método Socrático** potencializado por inteligência artificial (Google Gemini), o sistema guia o aluno na resolução de problemas sem nunca fornecer a resposta diretamente, promovendo o pensamento crítico e a autonomia.

---

## 🚀 Principais Funcionalidades

### 🧠 Inteligência Artificial Socrática & Pedagógica

- **Foco Estrito na BNCC:** A IA é configurada para atuar exclusivamente dentro das competências da Base Nacional Comum Curricular de acordo com o ano escolar do aluno.
- **Personalização de Interesses:** O tutor utiliza os hobbies e preferências cadastrados pelo aluno (ex: futebol, Minecraft, música, espaço) para criar analogias e exercícios contextuais altamente engajadores.
- **Não Fornece Respostas:** O sistema é programado para responder com perguntas provocativas que estimulam o raciocínio independente.

### 📸 Visão Computacional

- **Correção de Exercícios por Foto:** O aluno pode anexar fotos de cálculos realizados no caderno. A IA analisa a imagem, entende o cálculo e orienta o aluno exatamente sobre o próximo passo.

### 🔐 Segurança, Usabilidade & Dupla Validação

- **Confirmação de E-mail Obrigatória:** Fluxo de proteção contra e-mails inválidos. Ao realizar o cadastro, o usuário é salvo como inativo (`ativo = 0`) e uma credencial temporária de ativação é disparada para sua caixa de entrada. O acesso só é liberado após a validação do token de 6 dígitos.
- **Confirmação Dupla de Senhas:** O formulário de cadastro e alteração exige a redigitação da senha para mitigar erros operacionais do usuário.
- **Controle de Visibilidade Dinâmica:** Inclusão de recursos visuais (ícone de ocultar/mostrar senha através de emojis dinâmicos) nas telas de Login, Cadastro e Recuperação de Credenciais.
- **Recuperação Temporal via SMTP:** Sistema robusto de redefinição de senha utilizando códigos randômicos de 6 dígitos com tempo de expiração blindado em 15 minutos via backend.
- **Painel Administrativo:** Interface restrita para consulta e moderação, permitindo que administradores visualizem dados cadastrais, anos escolares e alternem o status de acesso (bloquear ou liberar) dos alunos em tempo real.

### 🛠️ Infraestrutura "Passe Livre"

- **Bypass de SSL:** O backend inclui um hack de interceptação de rede (*monkey-patching* no core do cliente HTTP `httpx`) para desativar a validação local de certificados em nível de runtime. Isso garante o funcionamento da IA em redes com firewalls restritivos, proxies acadêmicos ou antivírus que bloqueiam certificados locais.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | React.js, Vite, CSS3 (Design Responsivo com Grid/Flexbox) |
| **Backend Framework** | Python 3, Flask, Flask-CORS, Flask-Limiter |
| **Inteligência Artificial** | Google Gemini 2.5 Flash (via SDK oficial `google-genai`) |
| **Banco de Dados** | MongoDB (via `pymongo`) |
| **Autenticação** | PyJWT (Algoritmo HS256) |
| **E-mail** | SMTP (Biblioteca `smtplib` nativa do Python com suporte a TLS/SSL) |

---

## 📦 Como Instalar e Rodar

### 1. Requisitos Prévios

- [Python 3.10+](https://www.python.org/) instalado.
- [Node.js](https://nodejs.org/) instalado.

### 2. Configuração do Ambiente (.env)

Na pasta `backend`, crie um arquivo `.env` com as seguintes chaves (utilize o `.env.example` como referência):

```env
# Chave obtida no Google AI Studio
GEMINI_API_KEY=sua_chave_aqui

# Assinatura de criptografia dos Tokens dos Alunos
JWT_SECRET=sua_chave_secreta_jwt_tutor_bncc_2026

# Credenciais do Administrador do Sistema
ADMIN_EMAIL=admin@tutorbncc.com
ADMIN_SENHA=Admin123!

# Configuração do Provedor de E-mail (Exemplo para Gmail usando Senhas de App)
SMTP_EMAIL=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app_google

# Conexão com o MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=tutor_bncc
```

### 3. Execução Automatizada (Windows)

Basta executar o arquivo `run.bat` na raiz do projeto. Ele irá:

1. Verificar os requisitos do sistema.
2. Criar o ambiente virtual Python (`venv`) e instalar as dependências do `requirements.txt`.
3. Instalar os pacotes do Node e iniciar a interface React/Vite.
4. Iniciar o servidor Backend (Porta 5000) e o Frontend (Porta 3000) simultaneamente.

> Certifique-se de que o MongoDB esteja em execução (local ou via Atlas) e que a variável `MONGO_URI` esteja configurada no `.env`.

### 4. Execução Manual (Multiplataforma)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows utilize: call venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Estrutura do Projeto

```plaintext
TUTOR-MATEMATICA/
├── backend/
│   ├── ai_service.py    # Interceptador HTTPX, Cérebro Gemini e Prompts BNCC
│   ├── auth.py          # Hashing PBKDF2, Emissão JWT e Validação de Cadastro
│   ├── app.py           # Endpoints da API Flask, Wraps e Rate Limiting
│   ├── database.py      # Conexão MongoDB e Histórico Persistente
│   ├── mailer.py        # Template HTML e Disparos SMTP
│   └── .env.example     # Modelo de exemplo para novas variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── Chat.jsx     # Interface do Tutor com botão de câmera e preview de mídias
│   │   ├── Login.jsx    # Autenticação, Estado de Recuperação e Olhinho Dinâmico
│   │   ├── Cadastro.jsx # Formulário completo (Gênero, Preferências) com Step de Token
│   │   └── Admin.jsx    # Painel de Controle e Moderação do Status de Alunos
│   └── index.html       # Arquivo base
└── run.bat              # Script Batch de automação para inicialização rápida
```

---

## ✒️ Licença e Uso

Este projeto foi desenvolvido estritamente para fins educacionais, de pesquisa e desenvolvimento de Trabalho de Conclusão de Curso (TCC) em tecnologias de IA aplicadas ao ensino. Sinta-se à vontade para expandir as funcionalidades e contribuir para o repositório!