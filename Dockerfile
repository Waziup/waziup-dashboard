FROM node:alpine

WORKDIR /usr/src/app

# Installing all dependencies
COPY ./package.json .
COPY ./yarn.lock .

ENV NODE_ENV production

RUN yarn install 

COPY . /usr/src/app

EXPOSE 3000

# We build before running. 
# The build will substitute the environement variables in the client code.
CMD yarn run build -- --release; node build/server.js
