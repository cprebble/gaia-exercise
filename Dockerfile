FROM node:6
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json src/ /usr/src/app/
RUN rm -rf node_modules
RUN npm install
EXPOSE 3000
CMD npm start
