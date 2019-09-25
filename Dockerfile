FROM node:alpine

ENV SCHEDULE_LOGS=logs

COPY dist /app
COPY package.json /app/package.json

RUN cd /app \
    && npm install --production

VOLUME ["/app"]
WORKDIR /app

CMD [ "sh" ]
