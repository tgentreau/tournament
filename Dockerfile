FROM node:lts-alpine as dev

WORKDIR /home/node/app/

COPY --chown=node:node ./package*.json .
RUN npm ci

USER node