FROM node:10.16-alpine

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 9092
EXPOSE 9093
EXPOSE 9094
EXPOSE 9095

CMD [ "npm", "start" ]