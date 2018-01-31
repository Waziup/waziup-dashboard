FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install 
#--production --no-progress

COPY . /usr/src/app

EXPOSE 3000

CMD yarn run build -- --release; node build/server.js
