FROM node:24.0-alpine

WORKDIR /usr/app/backend

COPY package*.json .

RUN npm install --os=linux --libc=musl --cpu=x64 sharp
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]
# RUN npm cache clean --force && rm -rf node_modules && npm install