FROM alpine:edge

COPY dist /app
WORKDIR /app

RUN apk --no-cache add nodejs npm

RUN cd /app \
    && npm install --production \
    && npm cache clean --force \
    && apk del npm

EXPOSE 3000

VOLUME [ "app/data" ]

CMD [ "node", "app.js" ]
