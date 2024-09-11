FROM node:21.6-alpine

WORKDIR /app
COPY package*.json ./
COPY jsconfig.json ./
COPY . .

RUN npm install
RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]
