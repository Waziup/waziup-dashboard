FROM node:alpine

WORKDIR /usr/src/app

# Installing all dependencies
COPY ./package.json .
COPY ./yarn.lock .

ENV NODE_ENV production

RUN yarn install 

COPY . /usr/src/app

EXPOSE 3000

ARG SERVER_PORT
ARG KEYCLOAK_URL 
ARG API_SERVER_URL
ENV SERVER_PORT=$SERVER_PORT
ENV KEYCLOAK_URL=$KEYCLOAK_URL
ENV API_SERVER_URL=$API_SERVER_URL

# We build before running. 
# The build will substitute the environement variables in the client code.
RUN yarn run build -- --release;
CMD node build/server.js
