FROM alpine:edge

ENV LOGGER=false STORAGE=storage/logs

COPY dist /app
WORKDIR /app

RUN apk --no-cache add nodejs npm

RUN apk --no-cache add --virtual native-deps \
    git \
    g++ \
    gcc \
    libgcc \
    libstdc++ \
    linux-headers \
    make \
    python \
    \
    && npm install node-gyp -g \
    && cd /app \
    && npm install --production \
    && npm rebuild --build-from-source \
    && npm cache clean --force \
    && apk del native-deps \
    && npm uninstall node-gyp -g \
    && apk del npm

VOLUME [ "/app/storage" ]
EXPOSE 3000

CMD [ "node", "./schedule-api.js" ]
