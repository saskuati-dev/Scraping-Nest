# Scraping-Nest
---
## 🧰 Visão Geral

Scraping-Nest é uma aplicação que combina frontend e backend para realizar scraping de dados de sites como weworkremotely.com e remoteok.com

Este repositório serve como base para iniciar um projeto de coleta de dados web com apresentação visual.

---
## ✨ Funcionalidades

Raspagem (scraping) de páginas web para extração de dados.

Interface frontend para visualização ou interação.

Estrutura modular que permite fácil expansão (novos endpoints, novas páginas, etc).

Desenvolvido com tecnologias como TypeScript, Nest.js e Next.js conforme pasta frontend indica.

---
## 🛠️ Tecnologias utilizadas

<div align="center">

| Critério | Pontos |
|-----------|--------|
| Backend | Nest.js |
| Frontend | Next.js |
| Linguagem | TypeScript |
| Scraping| Playwright |
| Automação | n8n |
| Banco de dados | PostgreSQL |
</div>

---
# 🚀 Instalação & Uso
## Pré-requisitos

Node.js (versão 20.x ou superior)

npm ou yarn

Banco PostgreSQL

## Passos

### Clone este repositório:
``` bash 
git clone https://github.com/saskuati-dev/Scraping-Nest.git
cd Scraping-Nest
```

### Instale dependências do backend:
``` bash
cd backend
npm install
```
### Variáveis de ambiente

Crie um arquivo .env para as variaveis de ambiente:
```bash
DB_HOST=localhost
DB_PORT=5432                  
DB_USERNAME=meuusuario    
DB_PASSWORD=minhasenha123   
DB_DATABASE=meubanco
JWT_SECRET=meusegredo
JWT_EXPIRATION=7d
```


### Instale dependências do frontend:
``` bash
cd ../frontend
npm install
``` 


Crie um arquivo .env.local para conectar o frontend ao backend:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```
Definido como localhost na porta 3001 por padrao, sendo /api/v1 parte do endpoint.

### Execute o backend em modo de desenvolvimento:

``` bash
cd ../backend
npm run dev
``` 
### Variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:


Execute o frontend em modo de desenvolvimento (em outra aba/terminal):
``` bash
cd ../frontend
npm run start
``` 


Acesse o frontend via browser, normalmente em http://localhost:3000

Use a aplicação para iniciar scraping ou visualizar dados.
---

## 📁 Estrutura do Projeto

```
/
├── backend/
│   ├── src/
|   └── app/
|   |    ├──auth/
|   |    ├──scraping/
|   |    ├──items/
|   |    ├──position/
|   |    └──user/
|   |    
│   ├── test/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   |    └── app/  
│   ├── package.json
│   └── Dockerfile
│
├── infra/
│   └── docker-compose.yml
│
├── n8n/
│   └── Schedule Scraper.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md 
``` 
---
## 🧾 Endpoints da API REST

A API segue o padrão RESTful, com autenticação via JWT e controle de acesso baseado em roles (usuário e admin).

### 🔐 1. Autenticação & Usuários

|Método	|Endpoint	|Acesso	Descrição|
|-----------|--------|--------|
|POST	|``` /api/v1/auth/register```|	Público	Registra um novo usuário. Recebe name, email e password.|
POST| ``` /api/v1/auth/login ``` |	Público	Autentica um usuário e retorna um token JWT.

---

## 📥 Exemplo de registro
``` curl
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
``` 

## 📥 Exemplo de login
``` curl
curl -X POST http://localhost:3001/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'

``` 

#### 📤 Resposta esperada
``` json
{
  "accessToken": "<jwt_token>",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "['user']"
  }
}
```

### 📦 2. Itens (dados coletados)
<div align="center">

|Método|	Endpoint |	Acesso|	Descrição|
|--------|--------|--------|--------|
|GET	|``` /api/v1/items ```	|Autenticado	| Retorna lista paginada de itens coletados.|
|GET	|``` /api/v1/items/:id  ``` |	Autenticado |	Retorna detalhes de um item específico.|
|POST	| ``` /api/v1/items	``` |Admin	|Cria manualmente um item.|
|PUT	| ``` /api/v1/items/:id ``` |	Admin |	Atualiza um item existente.|
|DELETE	| ``` /api/v1/items/:id ``` |Admin	| Remove um item da base. |

</div>

### 🔍 Exemplo de listagem

``` curl
curl -X GET "http://localhost:3001/api/v1/items?page=1&pageSize=10&source=remoteok&query=developer" \
  -H "Authorization: Bearer <jwt_token>"
```
#### 📤 Resposta esperada
``` json
{
  "page": 1,
  "pageSize": 10,
  "total": 42,
  "items": [
    {
      "id": 1,
      "title": "Full Stack Developer",
      "source": "remoteok",
      "externalId": "12345",
      "url": "https://remoteok.com/remote-jobs/12345",
      "createdAt": "2025-11-03T12:00:00Z"
    }
  ]
}
``` 
----

## 🕸️ 3. Scraping

|Método |	Endpoint |	Acesso |	Descrição|
|--------|--------|--------|--------|
|POST |	``` /api/v1/scrape ```|	Admin	| Aciona o processo de scraping manualmente.|

### ⚙️ Exemplo
```curl
curl -X POST http://localhost:3001/api/v1/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token_JWT>" \
  -d '{
    "site": "weworkremotely"
  }'
``` 
---

### 🔑 Autorização & Cabeçalhos

Em todas as rotas protegidas, é necessário enviar o JWT no header da requisição:

Authorization: Bearer <seu_token_JWT>


Tokens expiram conforme configuração da variável de ambiente JWT_EXPIRES_IN (definida no .env).

Rotas administrativas usam os guards:
```typescript
@Roles(role)

@UseGuards(JwtAuthGuard)
```

garantindo acesso apenas a usuários com role = 'admin'.

---
### 🔁 4. Integração com n8n

Criar workflow no n8n:

Trigger (cron, HTTP ou manual)

Node HTTP Request → POST /api/v1/scrape

Node HTTP Request → GET /api/v1/items

Node de notificação (Slack, Email ou Console)

Exportar o workflow JSON e salvar em:

n8n/workflow-export.json


# 🚀 Como usar

Na raiz do projeto:
```bash
cd infra
docker compose up --build
```

Isso vai levantar tudo:

-   PostgreSQL em localhost:5432

-    Backend (Nest.js) em http://localhost:3001  

-   Frontend (Next.js) em http://localhost:3000

- n8n em http://localhost:5678