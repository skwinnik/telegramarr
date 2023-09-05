# Base image
FROM node:20.5.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT [ "node", "dist/main.js" ]
