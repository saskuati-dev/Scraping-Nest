# backend/Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS builder

WORKDIR /usr/src/app

# Copia apenas os manifests primeiro para aproveitar cache
COPY package*.json ./

# Instala dependências (completo, incluindo devDependencies para build)
RUN npm ci

# Copia o restante do código
COPY . .

# Instala navegadores do Playwright
RUN npx playwright install --with-deps

# Compila o projeto NestJS (gera dist/)
RUN npm run build


# ---------- Fase final ----------
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /usr/src/app

# Copia apenas dependências necessárias
COPY package*.json ./
RUN npm ci --omit=dev

# Copia build pronto da fase anterior
COPY --from=builder /usr/src/app/dist ./dist

# Copia outros arquivos necessários (como scripts, assets, etc.)
COPY --from=builder /usr/src/app/src ./src

# Define a porta
ENV PORT=3001
EXPOSE 3001

# Comando de produção
CMD ["npm", "run", "start:prod"]
