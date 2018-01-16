FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install 
#--production --no-progress

COPY . /usr/src/app

RUN yarn run build

EXPOSE 3000

CMD [ "node", "build/server.js" ]
