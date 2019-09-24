FROM node:alpine

ENV SCHEDULE_LOGS=/home/node/logs
VOLUME [ "/home/node/logs" ]
WORKDIR /home/node

COPY dist /home/node/app
COPY package.json /home/node/package.json

RUN npm install

CMD [ "sh" ]