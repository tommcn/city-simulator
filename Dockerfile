FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app

ENV RUNNING_IN_CONTAINER=true

COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY . /app

CMD [ "yarn", "start" ]
