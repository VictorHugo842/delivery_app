# 1) base: sistema e libs necessárias
FROM node:23-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2) dev: ambiente de desenvolvimento com hot‑reload
FROM base AS dev
COPY package.json package-lock.json ./
RUN npm cache clean --force
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Prod: build e serve o app com Next.js
FROM base AS prod
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
