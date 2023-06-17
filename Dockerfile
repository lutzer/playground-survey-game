FROM mhart/alpine-node:16
# install required packages
# -

WORKDIR /usr/src/

# copy all files
COPY . ./

# install dependencies
RUN (cd app && npm install)
RUN (cd server && npm install)

# run build commands
RUN (cd app && npm run build)

# expose app & admin editor
EXPOSE 8080

WORKDIR /usr/src/server

# start server
CMD ["npm", "start"]