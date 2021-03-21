FROM node:14-alpine

EXPOSE 8081

ENTRYPOINT ["npm", "run", "start"]

WORKDIR /srv

COPY package*.json ./

RUN npm install --production

COPY . ./
