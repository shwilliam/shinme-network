FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -qy
COPY . .
RUN npm run build

EXPOSE 80

CMD [ "npm", "start" ]
