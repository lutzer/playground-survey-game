# Playground survey game

Gamified Survey for planing the playground at Tempelhofer Feld in Berlin.

## Development

* run `cd app; npm install; npm run build` to build app into server/public dir
* run `cd server; npm install` to
* create file `server/.env` containing the postgres database url:
  ```
  DATABASE_URL = <url>
  ```
* start server with `cd server; npm start`

## Deployment

### With Docker

```
# build docker image
docker-compose build
# run docker container in detached mode
docker-compose up -d
```

