FROM node:latest

RUN mkdir -p /usr/src/app
#VOLUME ["/app"]
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install
# Bundle app source
COPY . /usr/src/app

#COPY index.js /usr/src/app
COPY config /usr/src/app
ADD build /usr/src/app

USER node

EXPOSE 8000
CMD [ "node", "index.js" ]
#OR CMD [ "npm", "start" ]

