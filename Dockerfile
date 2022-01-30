FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY . /app
# RUN yarn build

CMD [ "yarn", "start" ]
