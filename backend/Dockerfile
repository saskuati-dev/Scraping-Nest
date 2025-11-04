
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npx playwright install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]