FROM node:boron
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json dist/ /usr/src/app/
RUN rm -rf node_modules
RUN npm install --production
EXPOSE 3000
CMD npm start
