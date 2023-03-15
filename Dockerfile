FROM node:lts-alpine

COPY . .

RUN npm ci

CMD [ "npm", "run", "dev" ]