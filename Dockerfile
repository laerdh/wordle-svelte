FROM node

WORKDIR /usr/src/wordle-app

ARG SERVER_PORT=80
ENV SERVER_PORT=$SERVER_PORT

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

CMD ["node", "server.ts"]