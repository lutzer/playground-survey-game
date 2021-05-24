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

### With heroku

* Create heroku account
* login with `heroku login`
* create app with `heroku create playground-survey-server`
* add remote to git `heroku git:remote -a playground-survey-server`
* push server subdir to heroku `git subtree push --prefix server heroku master`

#### Download database backup

* Old lowdb version: Download database backup with `heroku ps:copy data/data.json`
* new version: make postgres dump
