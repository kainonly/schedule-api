FROM alpine:edge

RUN apk add tzdata

COPY dist /app
WORKDIR /app

EXPOSE 3000

VOLUME [ "app/data" ]

CMD [ "./schedule-api" ]