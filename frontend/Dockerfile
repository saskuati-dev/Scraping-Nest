
FROM node:18 AS builder

WORKDIR /app

# 1. Instala dependências e otimiza o cache
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# 2. Copia o código fonte e executa o build
COPY . .
RUN npm run build 

# ------------------------------------
# Estágio 2: Runner (Execução em Produção Otimizada)
# ------------------------------------
FROM node:18-slim AS runner

# Cria e usa o usuário não-root padrão para segurança
WORKDIR /app
USER node

# COPIA OS ARQUIVOS ESSENCIAIS DO ESTÁGIO 'builder' (Ponto de correção!)
# 1. Copia o node_modules para que o comando 'next start' funcione
COPY --from=builder /app/node_modules ./node_modules
# 2. Copia os arquivos de build do Next.js
COPY --from=builder /app/.next ./.next
# 3. Copia arquivos estáticos
COPY --from=builder /app/public ./public
# 4. Copia o package.json para que o 'npm run start' funcione
COPY --from=builder /app/package.json ./package.json 

# EXPOSE a porta que a aplicação vai escutar
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start"]
