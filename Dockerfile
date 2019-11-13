FROM node:alpine

#ENV NODE_ENV production

# Installing all dependencies
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install 

# Compile sources
COPY . /usr/src/app
ARG SERVER_PORT
ARG SERVER_URL
ARG KEYCLOAK_URL 
ARG API_SERVER_URL
ENV SERVER_PORT=$SERVER_PORT
ENV SERVER_URL=$SERVER_URL
ENV KEYCLOAK_URL=$KEYCLOAK_URL
ENV API_SERVER_URL=$API_SERVER_URL
RUN yarn run build --release;

# Run
EXPOSE 3000
CMD node build/server.js
