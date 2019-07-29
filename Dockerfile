FROM node:10.16.0-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn

EXPOSE 3000
CMD ["yarn", "run", "start"]
