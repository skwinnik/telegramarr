# Base image
FROM node:20.5.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]

ENTRYPOINT ["top", "-b"]