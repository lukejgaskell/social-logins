# create a file named Dockerfile
FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY package.json /app

RUN npm install -g pm2

RUN npm install

COPY . /app

EXPOSE 8000
CMD ["pm2-docker", "./src/accounts.js"]