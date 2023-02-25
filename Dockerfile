FROM node

WORKDIR /usr/src/wordle-app

COPY package*.json .
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3000

CMD ["node", "server.ts"]