FROM node:16

WORKDIR /app

COPY package.json .
COPY package-lock.json* .

RUN npm config set strict-ssl false && \
    npm install

COPY . . 

EXPOSE 3000

ENV REACT_APP_API_URL=http://server:5000


CMD ["npm", "start"]