FROM node:12-alpine

EXPOSE 8080
WORKDIR /app

ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

COPY package*.json ./
COPY credentials/credentials.json credentials.json
RUN npm install
COPY dist/ dist/

CMD [ "npm", "start" ]
