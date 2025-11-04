# Use a imagem oficial do Playwright que já tem todas as dependências
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /usr/src/app

# Copia e instala as dependências do Node.js
COPY package*.json ./
RUN npm install

# Instala os browsers do Playwright
RUN npx playwright install

# Copia o código fonte
COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]