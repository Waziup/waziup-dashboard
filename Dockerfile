FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./build/package.json .
COPY ./build/yarn.lock .

# Install Node.js dependencies
RUN yarn install --production --no-progress

COPY ./src/keycloak.json .
#COPY ./src/server/config .
#COPY ./src/server/config/default.yaml ./config

# Copy application files
ADD ./build .

CMD [ "node", "server.js" ]
