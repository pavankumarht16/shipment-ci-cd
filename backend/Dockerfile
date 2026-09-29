FROM node:24-slim

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY prisma.config.ts ./

COPY prisma ./prisma

RUN DATABASE_URL="postgresql://postgres:postgres@postgres:5432/shipment_db" ./node_modules/.bin/prisma generate

COPY src ./src

EXPOSE 5000

CMD ["npm", "start"]