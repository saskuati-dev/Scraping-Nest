# TESTE TÉCNICO — 2ª ETAPA | NeoFuturo

## 🎯 Visão geral

O objetivo é construir uma aplicação completa, com **backend NestJS**, **frontend Next.js**, **scraping**, **orquestração via n8n**, **autenticação e autorização JWT**, e **infraestrutura containerizada** com Docker.

A aplicação deve coletar dados públicos (via scraping), armazenar em banco (Postgres), permitir acesso autenticado a rotas administrativas e exibir os dados em uma interface web moderna e responsiva.

---

## 🧠 Objetivos de avaliação

Avaliar:
- Arquitetura e qualidade do código
- Organização e clareza de commits
- Domínio de NestJS, Next.js e TypeScript
- Integração entre sistemas (API, n8n, frontend)
- Implementação de autenticação e autorização
- Uso de boas práticas, padrões e testes
- Documentação e facilidade de execução

---

## ⚙️ Stack obrigatória

| Camada | Tecnologia obrigatória |
|--------|--------------------------|
| **Backend** | NestJS (TypeScript) |
| **Banco de Dados** | PostgreSQL |
| **ORM** | TypeORM |
| **Scraper** | Axios + Cheerio (ou Playwright) |
| **Frontend** | Next.js (TypeScript) |
| **Orquestração** | n8n |
| **Autenticação** | JWT (JSON Web Token) |
| **Infraestrutura** | Docker + docker-compose |
| **CI/CD** | GitHub Actions |
| **Testes** | Jest + Supertest (backend), React Testing Library ou Playwright (frontend) |

---

## 📦 Estrutura esperada do repositório

```
|
├── backend/
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── infra/
│   └── docker-compose.yml
│
├── n8n/
│   └── workflow-export.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md
```

---

## 🧩 Funcionalidades obrigatórias

### 1. Autenticação e autorização

O sistema deve possuir **usuários com papéis (roles)** e autenticação via **JWT**.

- **Usuário**: registro e login via `/api/v1/auth/register` e `/api/v1/auth/login`
- **Admin**: role especial que pode:
  - Executar scraping manual (`POST /api/v1/scrape`)
  - Deletar ou editar itens (`DELETE /api/v1/items/:id`, `PUT /api/v1/items/:id`)
- **Token JWT**:
  - Enviado no header: `Authorization: Bearer <token>`
  - Expiração configurável via `.env`
- **Proteção de rotas**:
  - `@UseGuards(JwtAuthGuard, RolesGuard)`
  - Exemplo: apenas admin pode criar, atualizar ou deletar.

---

### 2. Scraping

- Deve coletar dados públicos de **uma fonte real** (ex: `https://remoteok.com`, `https://weworkremotely.com`, etc)
- Implementar **adapter pattern**: cada fonte possui um adapter independente
- Deduplicar registros por `(source, externalId)`
- Armazenar também o `rawPayload` (JSON bruto do item)
- Permitir execução manual (`POST /api/v1/scrape`) e automática (via n8n)
- Registrar logs de scraping (data, sucesso, falhas)

---

### 3. API REST

- **Endpoints obrigatórios**
  - `POST /api/v1/auth/register` — cria usuário
  - `POST /api/v1/auth/login` — retorna JWT
  - `GET /api/v1/items` — lista itens (paginado, filtros por source e query)
  - `GET /api/v1/items/:id` — detalhe do item
  - `POST /api/v1/items` — (admin) cria manualmente
  - `PUT /api/v1/items/:id` — (admin) atualiza
  - `DELETE /api/v1/items/:id` — (admin) remove
  - `POST /api/v1/scrape` — (admin) aciona scraping

- **Filtros e paginação**
  - `GET /api/v1/items?page=1&pageSize=10&source=remoteok&query=developer`

---

### 4. Integração com n8n

- Criar workflow no n8n com:
  1. Trigger (cron ou manual)
  2. Node HTTP Request chamando `/api/v1/scrape`
  3. Node HTTP Request chamando `/api/v1/items` (opcional)
  4. Node de notificação (Slack, Email ou Console log)
- Exportar workflow JSON e incluir em `n8n/workflow-export.json`
- Documentar como importar e executar no README

---

### 5. Frontend

- Desenvolvido em **Next.js (TypeScript)**
- Páginas obrigatórias:
  - `/` — listagem dos itens com paginação e busca
  - `/items/[id]` — detalhe do item
  - `/login` — autenticação (gera JWT e salva em cookie/localStorage)
  - `/admin` — painel administrativo (listar, editar, deletar, acionar scraping)
- Requisitos visuais:
  - Responsivo
  - Pode usar TailwindCSS, ChakraUI ou outro framework
  - Deve consumir a API real via `fetch` ou `axios`

---

### 6. Docker e Infraestrutura

O projeto deve incluir um `docker-compose.yml` que levante os serviços:
- `db` — PostgreSQL
- `backend` — NestJS API
- `frontend` — Next.js app
- `n8n` — orquestrador

Comando principal:
```bash
docker-compose up --build
```

Todos os serviços devem subir e se comunicar automaticamente.

---

### 7. CI/CD

Adicionar pipeline no GitHub Actions (`.github/workflows/ci.yml`) com as etapas:
1. Instalar dependências
2. Rodar lint
3. Rodar testes
4. Buildar backend e frontend
5. (Opcional) publicar build em container registry

---

### 8. Testes

- **Backend**
  - Unit tests com Jest
  - Integration tests com Supertest (simulando requisições HTTP)
- **Frontend**
  - Teste de componentes com React Testing Library
  - (Opcional) e2e com Playwright
- Os testes devem ser executáveis via `npm test`

---

### 9. Critérios de avaliação

| Critério | Pontos |
|-----------|--------|
| API funcional (CRUD, Auth, Scraping) | 25 |
| Qualidade e organização do código | 20 |
| Autenticação e autorização JWT | 15 |
| Frontend completo (login, listagem, admin) | 15 |
| Integração com n8n | 10 |
| Testes automatizados | 10 |
| Docker + CI funcional | 5 |
| **Total** | **100 pts** |

---

### 10. Checklist de entrega

- [ ] Repositório público criado
- [ ] README.md com instruções detalhadas
- [ ] docker-compose.yml funcional
- [ ] Autenticação e roles implementados
- [ ] Scraper funcional e integrado
- [ ] Integração n8n testada e documentada
- [ ] Frontend integrado ao backend
- [ ] Testes automatizados passando
- [ ] CI configurado

---

### 11. Entrega

Envie o link do repositório público por e-mail para o avaliador da NeoFuturo.

Boa sorte! 🚀
