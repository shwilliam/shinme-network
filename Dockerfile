FROM node:12-alpine

WORKDIR /usr/app/api/
COPY api/package*.json ./
RUN npm install -qy
COPY api/ ./

EXPOSE 3000

CMD ["npm", "start"]
