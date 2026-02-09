FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY package-lock.json* .

RUN npm config set strict-ssl false && \
    npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]