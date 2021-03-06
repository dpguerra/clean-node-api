FROM node:12.16.3
WORKDIR /usr/src/clean-node-api
COPY package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5050
CMD npm start