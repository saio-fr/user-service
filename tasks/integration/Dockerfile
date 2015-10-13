FROM node:latest

RUN echo "//registry.npmjs.org/:_authToken=16b46f03-f1fb-4dce-9a98-c7e685751e67" > ~/.npmrc

RUN mkdir -p /opt/service
WORKDIR /opt/service

ADD model ./model
ADD test/integration/helpers ./helpers
ADD test/integration/test.integration.js ./test.js
ADD test/integration/test.package.json ./package.json

RUN npm install
ENTRYPOINT ["npm","test"]
