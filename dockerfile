# From the docker alpine image
FROM alpine 
# update node and npm
RUN apk add --update nodejs npm
# define work directory
WORKDIR /src
# copy package json
COPY ./package.json ./
# run npm install
RUN npm install
# copy files
COPY . ./
# expose port that app is running on 
EXPOSE 3000
# entrypoint to start app
ENTRYPOINT ["node", "./app.js"]