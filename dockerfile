FROM alpine
RUN apk add --update nodejs npm
WORKDIR /src
COPY ./package.json ./
RUN npm install
COPY . /src
EXPOSE 3000
ENTRYPOINT ["node", "./app.js"]