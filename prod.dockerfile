FROM node:14.0.0-stretch

ENV NODE_ENV=production

EXPOSE 4000

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install -g pm2

RUN npm install \
    && mv node_modules ../

RUN useradd -g 1000 -u 1001 solid \
    && chown -R solid /app \
    && mkdir -p /home/solid/.pm2 \
    && chown -R 1001.1000 /home/solid/.pm2

USER solid

COPY . /app

CMD ["npm", "run", "pm2"]
