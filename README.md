# DevNotes AI

> Base de conhecimento pessoal com busca full-text nativa do MongoDB — construída como projeto de portfólio para demonstrar stack moderno full-stack.

## 🎯 Sobre

DevNotes AI é uma aplicação para salvar, organizar e buscar notas de estudo, snippets de código e aprendizados. Utiliza **MongoDB Full-Text Search** nativo (via `mongot`) para busca por relevância, facetas e autocomplete — sem depender de Elasticsearch ou outros motores externos.

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| **Banco** | MongoDB 8.2+ com `$search`, `$searchMeta` |
| **Backend** | Node.js + Express + Apollo Server |
| **Frontend** | React + Next.js (App Router) + Apollo Client |
| **Monorepo** | Yarn 4 workspaces + Turborepo |
| **DevOps** | Docker + Kubernetes (kind) + GitHub Actions |
| **Linguagem** | TypeScript (strict) |

## 🏗️ Arquitetura

```
devnotes-ai/
├── apps/
│   ├── web/        # NextJS + Apollo Client
│   └── api/        # Express + Apollo Server
├── packages/
│   ├── shared/     # Tipos TS, schema GraphQL, zod
│   └── config/     # Configs compartilhadas
└── infra/
    ├── docker/     # Dockerfiles
    └── k8s/        # Manifests Kubernetes
```

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Corepack (`corepack enable`)
- Docker + Docker Compose
- (Opcional) kind + kubectl para Kubernetes

### Passos

```bash
# 1. Clonar
git clone git@github.com:<seu-usuario>/devnotes-ai.git
cd devnotes-ai

# 2. Instalar dependências
yarn install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com seus valores

# 4. Subir MongoDB com Search
docker compose up -d mongodb

# 5. Rodar em modo desenvolvimento
yarn dev
```

- API: http://localhost:4000/graphql
- Web: http://localhost:3000

## 📚 Roadmap

- [x] **Fase 0** — Setup do monorepo
- [ ] **Fase 1** — API Express + Apollo Server (CRUD em memória)
- [ ] **Fase 2** — MongoDB + Mongoose (persistência)
- [ ] **Fase 3** — Frontend Next.js + Apollo Client
- [ ] **Fase 4** — Busca full-text com `$search`
- [ ] **Fase 5** — Facetas com `$searchMeta`
- [ ] **Fase 6** — Dockerfiles + compose completo
- [ ] **Fase 7** — Kubernetes (kind)
- [ ] **Fase 8** — CI/CD + deploy público
- [ ] **Fase 9** *(stretch)* — Busca híbrida + chat RAG

## 🔒 Segurança

- Nunca commite arquivos `.env`
- `gitleaks` via pre-commit hook
- Secret scanning ativo no GitHub
- Variáveis sensíveis via Kubernetes Secrets

## 📄 Licença

MIT