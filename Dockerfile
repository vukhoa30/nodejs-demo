FROM node:12

WORKDIR /usr/src/app

COPY dist/* .

EXPOSE 3000

CMD [ "npm", "start" ]
