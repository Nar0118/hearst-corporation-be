FROM node:16

WORKDIR /usr/src/app

COPY package.json ./

COPY .env .env

RUN npm install

COPY . .

#ARG ENV

#RUN if [ "$ENV" = "production" ] ; then  mv .env.prod.example .env ; else mv .env.development.example .env ; fi

RUN npm run build

ENTRYPOINT ["npm", "start"]
