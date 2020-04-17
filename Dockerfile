FROM node:12.16.2-stretch

EXPOSE 3000

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

RUN useradd -g 1000 -u 1001 solid \
    && chown -R solid /app

USER solid

COPY . /app

CMD ["npm", "start"]
