FROM node:12-alpine

EXPOSE 8080
WORKDIR /app

ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

COPY package*.json ./
COPY credentials.json credentials.json
RUN npm install
COPY dist/ dist/
COPY deployment-scripts/ deployment-scripts/

CMD [ "npm", "start" ]
